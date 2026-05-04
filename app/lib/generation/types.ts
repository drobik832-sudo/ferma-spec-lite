export type GenerationMode = 'local' | 'remote';

export interface GenerationConfig {
  mode: GenerationMode;
  localApiUrl: string;
  remoteApiUrl: string;
  remoteApiKey: string;
}

export interface GenerateRequest {
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  seed: number;
  steps: number;
  cfg: number;
  model: string;
}

export interface GenerateResponse {
  imageUrl: string;
  success: boolean;
  error?: string;
}
