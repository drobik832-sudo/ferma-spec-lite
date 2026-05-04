import crypto from "crypto";

export type TelegramInitDataUser = {
  id: number;
  first_name?: string;
  username?: string;
};

export type VerifyTelegramInitDataResult =
  | { ok: true; user: TelegramInitDataUser; authDate: number }
  | { ok: false; message: string };

function sha256(data: string | Buffer) {
  return crypto.createHash("sha256").update(data).digest();
}

function hmacSha256Hex(key: Buffer, data: string) {
  return crypto.createHmac("sha256", key).update(data).digest("hex");
}

export function verifyTelegramInitData(initData: string, botToken: string): VerifyTelegramInitDataResult {
  if (!initData) return { ok: false, message: "initData required" };
  if (!botToken) return { ok: false, message: "TELEGRAM_BOT_TOKEN missing" };

  const params = new URLSearchParams(initData);
  const hash = params.get("hash") || "";
  if (!hash) return { ok: false, message: "hash missing" };

  const pairs: string[] = [];
  params.forEach((value, key) => {
    if (key === "hash") return;
    pairs.push(`${key}=${value}`);
  });
  pairs.sort((a, b) => a.localeCompare(b));
  const dataCheckString = pairs.join("\n");

  const secretKey = sha256(botToken);
  const computedHash = hmacSha256Hex(secretKey, dataCheckString);
  if (computedHash !== hash) return { ok: false, message: "invalid signature" };

  const authDateRaw = params.get("auth_date") || "";
  const authDate = Number(authDateRaw);
  if (!Number.isFinite(authDate) || authDate <= 0) return { ok: false, message: "invalid auth_date" };

  const userRaw = params.get("user") || "";
  if (!userRaw) return { ok: false, message: "user missing" };
  let userParsed: unknown;
  try {
    userParsed = JSON.parse(userRaw);
  } catch {
    return { ok: false, message: "user is not valid JSON" };
  }
  const user = userParsed as Partial<TelegramInitDataUser>;
  if (!user?.id || typeof user.id !== "number") return { ok: false, message: "user.id missing" };

  return {
    ok: true,
    user: {
      id: user.id,
      first_name: typeof user.first_name === "string" ? user.first_name : undefined,
      username: typeof user.username === "string" ? user.username : undefined
    },
    authDate
  };
}

