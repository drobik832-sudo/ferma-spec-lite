import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { verifyTelegramInitData } from "./verifyInitData";

const BOT_TOKEN = "123456:test-bot-token";

function signInitData(params: Record<string, string>, botToken = BOT_TOKEN): string {
  const dataCheckString = Object.keys(params)
    .sort((a, b) => a.localeCompare(b))
    .map(key => `${key}=${params[key]}`)
    .join("\n");
  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const hash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  const search = new URLSearchParams({ ...params, hash });
  return search.toString();
}

const validUser = { id: 42, first_name: "Ada", username: "ada" };

describe("verifyTelegramInitData", () => {
  it("rejects empty initData", () => {
    expect(verifyTelegramInitData("", BOT_TOKEN)).toEqual({ ok: false, message: "initData required" });
  });

  it("rejects a missing bot token", () => {
    expect(verifyTelegramInitData("user=x", "")).toEqual({ ok: false, message: "TELEGRAM_BOT_TOKEN missing" });
  });

  it("rejects when the hash is missing", () => {
    const initData = new URLSearchParams({ auth_date: "1700000000", user: "{}" }).toString();
    expect(verifyTelegramInitData(initData, BOT_TOKEN)).toEqual({ ok: false, message: "hash missing" });
  });

  it("rejects an invalid signature", () => {
    const initData = new URLSearchParams({
      auth_date: "1700000000",
      user: JSON.stringify(validUser),
      hash: "deadbeef"
    }).toString();
    expect(verifyTelegramInitData(initData, BOT_TOKEN)).toEqual({ ok: false, message: "invalid signature" });
  });

  it("rejects a signature computed with a different bot token", () => {
    const initData = signInitData(
      { auth_date: "1700000000", user: JSON.stringify(validUser) },
      "other-token"
    );
    expect(verifyTelegramInitData(initData, BOT_TOKEN)).toEqual({ ok: false, message: "invalid signature" });
  });

  it("rejects an invalid auth_date", () => {
    const initData = signInitData({ auth_date: "0", user: JSON.stringify(validUser) });
    expect(verifyTelegramInitData(initData, BOT_TOKEN)).toEqual({ ok: false, message: "invalid auth_date" });
  });

  it("rejects when the user field is missing", () => {
    const initData = signInitData({ auth_date: "1700000000" });
    expect(verifyTelegramInitData(initData, BOT_TOKEN)).toEqual({ ok: false, message: "user missing" });
  });

  it("rejects when the user field is not valid JSON", () => {
    const initData = signInitData({ auth_date: "1700000000", user: "not-json" });
    expect(verifyTelegramInitData(initData, BOT_TOKEN)).toEqual({ ok: false, message: "user is not valid JSON" });
  });

  it("rejects when user.id is missing or not a number", () => {
    const initData = signInitData({ auth_date: "1700000000", user: JSON.stringify({ first_name: "Ada" }) });
    expect(verifyTelegramInitData(initData, BOT_TOKEN)).toEqual({ ok: false, message: "user.id missing" });
  });

  it("accepts a correctly signed payload and returns the parsed user", () => {
    const initData = signInitData({ auth_date: "1700000000", user: JSON.stringify(validUser) });
    const result = verifyTelegramInitData(initData, BOT_TOKEN);
    expect(result).toEqual({
      ok: true,
      user: { id: 42, first_name: "Ada", username: "ada" },
      authDate: 1700000000
    });
  });

  it("omits optional string fields when they are not strings", () => {
    const initData = signInitData({
      auth_date: "1700000000",
      user: JSON.stringify({ id: 7, first_name: 5, username: null })
    });
    const result = verifyTelegramInitData(initData, BOT_TOKEN);
    expect(result).toEqual({
      ok: true,
      user: { id: 7, first_name: undefined, username: undefined },
      authDate: 1700000000
    });
  });
});
