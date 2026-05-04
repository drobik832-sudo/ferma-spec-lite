export interface ComfyQueueSnapshot {
  running: number;
  pending: number;
}

export interface ComfyGenerateResult {
  imageUrl: string;
  strictApplied: boolean;
}

export interface ComfyGenerateArgs {
  apiBaseUrl: string;
  publicBaseUrl: string;
  modelNameCandidates: string[];
  controlNetCandidates: Array<string | null>;
  engine?: "sdxl" | "flux_gguf";
  fluxClipName1?: string;
  fluxClipName2?: string;
  fluxVaeName?: string;
  fluxMaxShift?: number;
  fluxBaseShift?: number;
  fluxLoras?: Array<{ name: string; strengthModel: number; strengthClip: number }>;
  clientId: string;
  finalPrompt: string;
  negativePrompt: string;
  seed: number;
  steps: number;
  cfg: number;
  denoise: number;
  controlNetStrength: number;
  controlNetStartPercent: number;
  controlNetEndPercent: number;
  width: number;
  height: number;
  inputImage?: File | string | null;
  useControlNet: boolean;
  maxWaitSeconds: number;
  onTick?: (elapsedSeconds: number) => void;
}

function normalizeStatus(value: unknown) {
  return typeof value === "string" ? value.toLowerCase() : "";
}

function isTerminalSuccess(statusValue: string) {
  return statusValue === "success" || statusValue === "succeeded" || statusValue === "completed" || statusValue === "complete";
}

async function uploadToComfy(apiBaseUrl: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", "input");
  formData.append("overwrite", "true");
  const uploadResponse = await fetch(`${apiBaseUrl}/upload/image`, {
    method: "POST",
    body: formData
  });
  const uploadData = await uploadResponse.json().catch(() => null);
  if (!uploadResponse.ok) {
    const errorMessage =
      uploadData?.error ||
      uploadData?.detail ||
      uploadData?.message ||
      `Ошибка загрузки изображения: ${uploadResponse.status}`;
    throw new Error(errorMessage);
  }
  return uploadData?.name || uploadData?.filename || file.name;
}

function toFileFromDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!match) return null;
  const mime = match[1] || "image/png";
  const base64 = match[2] || "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const extension = mime.includes("jpeg") ? "jpg" : mime.includes("png") ? "png" : "png";
  return new File([bytes], `upload_${Date.now()}.${extension}`, { type: mime });
}

async function toFileFromUrl(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const mime = blob.type || "image/png";
  const extension = mime.includes("jpeg") ? "jpg" : mime.includes("png") ? "png" : "png";
  return new File([blob], `upload_${Date.now()}.${extension}`, { type: mime });
}

function buildComfyGraph(args: {
  engine?: "sdxl" | "flux_gguf";
  modelName: string;
  imageName?: string | null;
  controlNetName?: string | null;
  finalPrompt: string;
  negativePrompt: string;
  seed: number;
  steps: number;
  cfg: number;
  denoise: number;
  controlNetStrength: number;
  controlNetStartPercent: number;
  controlNetEndPercent: number;
  width: number;
  height: number;
  fluxClipName1?: string;
  fluxClipName2?: string;
  fluxVaeName?: string;
  fluxMaxShift?: number;
  fluxBaseShift?: number;
  fluxLoras?: Array<{ name: string; strengthModel: number; strengthClip: number }>;
}) {
  const {
    modelName,
    imageName,
    finalPrompt,
    negativePrompt,
    seed,
    steps,
    cfg,
    denoise,
    width,
    height,
    fluxClipName1,
    fluxClipName2,
    fluxVaeName,
    fluxMaxShift,
    fluxBaseShift,
    fluxLoras
  } = args;

  if (!modelName.toLowerCase().endsWith(".gguf")) {
    throw new Error("Ожидалась Flux GGUF модель (.gguf).");
  }

  const clip1 = fluxClipName1 || "clip_l.safetensors";
  const clip2 = fluxClipName2 || "t5xxl_fp8_e4m3fn.safetensors";
  const vaeName = fluxVaeName || "ae.safetensors";
  const maxShift = Number.isFinite(fluxMaxShift as number) ? (fluxMaxShift as number) : 1.15;
  const baseShift = Number.isFinite(fluxBaseShift as number) ? (fluxBaseShift as number) : 0.5;
  const loras = Array.isArray(fluxLoras) ? fluxLoras.filter(lora => Boolean(lora?.name)) : [];

  const graph: Record<string, any> = {
    "1": { class_type: "UnetLoaderGGUF", inputs: { unet_name: modelName } },
    "2": { class_type: "DualCLIPLoader", inputs: { clip_name1: clip1, clip_name2: clip2, type: "flux" } },
    "3": { class_type: "VAELoader", inputs: { vae_name: vaeName } }
  };

  let currentModel: any = ["1", 0];
  let currentClip: any = ["2", 0];

  loras.forEach((lora, index) => {
    const nodeId = `${20 + index}`;
    graph[nodeId] = {
      class_type: "LoraLoader",
      inputs: {
        model: currentModel,
        clip: currentClip,
        lora_name: lora.name,
        strength_model: lora.strengthModel,
        strength_clip: lora.strengthClip
      }
    };
    currentModel = [nodeId, 0];
    currentClip = [nodeId, 1];
  });

  graph["4"] = { class_type: "CLIPTextEncode", inputs: { text: finalPrompt, clip: currentClip } };
  graph["5"] = { class_type: "CLIPTextEncode", inputs: { text: negativePrompt, clip: currentClip } };

  if (imageName) {
    graph["10"] = { class_type: "LoadImage", inputs: { image: imageName } };
    graph["11"] = { class_type: "VAEEncode", inputs: { pixels: ["10", 0], vae: ["3", 0] } };
  } else {
    graph["6"] = { class_type: "EmptyLatentImage", inputs: { width, height, batch_size: 1 } };
  }

  graph["15"] = { class_type: "ModelSamplingFlux", inputs: { model: currentModel, max_shift: maxShift, base_shift: baseShift, width, height } };
  graph["7"] = {
    class_type: "KSampler",
    inputs: {
      seed,
      steps,
      cfg,
      sampler_name: "euler",
      scheduler: "simple",
      denoise: imageName ? denoise : 1,
      model: ["15", 0],
      positive: ["4", 0],
      negative: ["5", 0],
      latent_image: imageName ? ["11", 0] : ["6", 0]
    }
  };

  graph["8"] = { class_type: "VAEDecode", inputs: { samples: ["7", 0], vae: ["3", 0] } };
  graph["9"] = { class_type: "SaveImage", inputs: { images: ["8", 0], filename_prefix: "ferma" } };

  return graph;
}

function sanitizeUploadFile(file: File) {
  const fileExtension = file.name.split(".").pop() || "png";
  const sanitizedFileName = `upload_${Date.now()}.${fileExtension}`;
  return new File([file], sanitizedFileName, { type: file.type });
}


function extractImageUrlFromHistoryEntry(apiBaseUrl: string, publicBaseUrl: string, historyEntry: any) {
  const outputs = historyEntry?.outputs || {};
  const outputValues = Object.values(outputs) as Array<{ images?: Array<{ filename?: string; subfolder?: string; type?: string }> }>;
  const firstImage = outputValues.flatMap(output => output?.images || []).find(image => Boolean(image?.filename));
  if (!firstImage?.filename) return null;
  const viewUrl = new URL(`${apiBaseUrl}/view`, publicBaseUrl);
  viewUrl.searchParams.set("filename", firstImage.filename);
  viewUrl.searchParams.set("subfolder", firstImage.subfolder || "");
  viewUrl.searchParams.set("type", firstImage.type || "output");
  return viewUrl.toString();
}

async function submitPrompt(params: {
  apiBaseUrl: string;
  promptGraph: any;
  clientId: string;
}) {
  const promptResponse = await fetch(`${params.apiBaseUrl}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: params.promptGraph, client_id: params.clientId })
  });
  const rawText = await promptResponse.text();
  let promptData: any = null;
  try {
    promptData = rawText ? JSON.parse(rawText) : null;
  } catch {
    promptData = rawText ? { message: rawText } : null;
  }
  if (!promptResponse.ok || !promptData?.prompt_id) {
    const nodeErrors = promptData?.node_errors ? JSON.stringify(promptData.node_errors) : "";
    const errorMessage =
      promptData?.error?.details ||
      promptData?.error?.message ||
      promptData?.error?.type ||
      promptData?.detail ||
      promptData?.message ||
      nodeErrors ||
      rawText ||
      `Ошибка API: ${promptResponse.status}`;
    throw new Error(errorMessage);
  }
  return promptData.prompt_id as string;
}

async function pollForImage(params: {
  apiBaseUrl: string;
  publicBaseUrl: string;
  promptId: string;
  maxWaitSeconds: number;
  onTick?: (elapsedSeconds: number) => void;
}) {
  let lastQueueState: ComfyQueueSnapshot | null = null;
  for (let attempt = 0; attempt < params.maxWaitSeconds; attempt += 1) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    params.onTick?.(attempt + 1);
    const historyResponse = await fetch(`${params.apiBaseUrl}/history/${params.promptId}`);
    const historyData = await historyResponse.json().catch(() => null);
    if (!historyResponse.ok) {
      const errorMessage =
        historyData?.error?.message ||
        historyData?.detail ||
        historyData?.message ||
        `Ошибка API: ${historyResponse.status}`;
      throw new Error(errorMessage);
    }
    const historyEntry = historyData?.[params.promptId];
    const status = normalizeStatus(historyEntry?.status?.status_str || historyEntry?.status?.status);
    const statusMessages = Array.isArray(historyEntry?.status?.messages) ? historyEntry.status.messages : [];
    const latestStatusMessage = statusMessages.length ? statusMessages[statusMessages.length - 1] : null;
    if (status === "error") {
      const rawMessage = Array.isArray(latestStatusMessage) ? latestStatusMessage[1] : latestStatusMessage;
      const extractedMessage =
        rawMessage?.exception_message ||
        rawMessage?.error ||
        rawMessage?.message ||
        rawMessage?.details ||
        "ComfyUI завершил задачу с ошибкой.";
      throw new Error(extractedMessage);
    }
    const extractedImageUrl = extractImageUrlFromHistoryEntry(params.apiBaseUrl, params.publicBaseUrl, historyEntry);
    if (extractedImageUrl) return extractedImageUrl;
    if (historyEntry && isTerminalSuccess(status)) {
      throw new Error("ComfyUI завершил генерацию, но не вернул файл изображения. Проверь права записи в папку output (SaveImage).");
    }
    if (attempt % 5 === 4) {
      const queueResponse = await fetch(`${params.apiBaseUrl}/queue`);
      const queueData = await queueResponse.json().catch(() => null);
      const running = Array.isArray(queueData?.queue_running) ? queueData.queue_running.length : 0;
      const pending = Array.isArray(queueData?.queue_pending) ? queueData.queue_pending.length : 0;
      lastQueueState = { running, pending };
      const inRunning = Array.isArray(queueData?.queue_running)
        ? queueData.queue_running.some((entry: any) => entry?.[1] === params.promptId || entry?.[0] === params.promptId)
        : false;
      const inPending = Array.isArray(queueData?.queue_pending)
        ? queueData.queue_pending.some((entry: any) => entry?.[1] === params.promptId || entry?.[0] === params.promptId)
        : false;
      if (!historyEntry && !inRunning && !inPending) {
        throw new Error("ComfyUI не нашёл задачу в history/queue. Возможно, сервер перезапускался или отклонил запрос.");
      }
    }
  }
  const queueSuffix = lastQueueState ? ` (очередь: running=${lastQueueState.running}, pending=${lastQueueState.pending})` : "";
  throw new Error(`ComfyUI не вернул изображение за ${params.maxWaitSeconds} сек.${queueSuffix}`);
}

export async function generateWithComfy(args: ComfyGenerateArgs): Promise<ComfyGenerateResult> {
  const modelNameCandidates = args.modelNameCandidates.filter(Boolean);
  if (!modelNameCandidates.length) {
    throw new Error("Не указана модель ComfyUI.");
  }

  let uploadedImageName: string | null = null;
  if (args.inputImage) {
    if (typeof args.inputImage === "string") {
      const file = args.inputImage.startsWith("data:") ? toFileFromDataUrl(args.inputImage) : await toFileFromUrl(args.inputImage);
      if (file) uploadedImageName = await uploadToComfy(args.apiBaseUrl, sanitizeUploadFile(file));
    } else {
      uploadedImageName = await uploadToComfy(args.apiBaseUrl, sanitizeUploadFile(args.inputImage));
    }
  }

  let lastError: Error | null = null;

  for (const modelName of modelNameCandidates) {
    const tryOnce = async () => {
      const promptGraph = buildComfyGraph({
        engine: args.engine,
        modelName,
        imageName: uploadedImageName,
        controlNetName: null,
        finalPrompt: args.finalPrompt,
        negativePrompt: args.negativePrompt,
        seed: args.seed,
        steps: args.steps,
        cfg: args.cfg,
        denoise: args.denoise,
        controlNetStrength: args.controlNetStrength,
        controlNetStartPercent: args.controlNetStartPercent,
        controlNetEndPercent: args.controlNetEndPercent,
        width: args.width,
        height: args.height,
        fluxClipName1: args.fluxClipName1,
        fluxClipName2: args.fluxClipName2,
        fluxVaeName: args.fluxVaeName,
        fluxMaxShift: args.fluxMaxShift,
        fluxBaseShift: args.fluxBaseShift,
        fluxLoras: args.fluxLoras
      });
      const promptId = await submitPrompt({
        apiBaseUrl: args.apiBaseUrl,
        promptGraph,
        clientId: args.clientId
      });
      const imageUrl = await pollForImage({
        apiBaseUrl: args.apiBaseUrl,
        publicBaseUrl: args.publicBaseUrl,
        promptId,
        maxWaitSeconds: args.maxWaitSeconds,
        onTick: args.onTick
      });
      return { imageUrl, strictApplied: false };
    };

    try {
      return await tryOnce();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("ComfyUI не принял prompt.");
    }
  }

  throw lastError || new Error("ComfyUI не принял prompt.");
}
