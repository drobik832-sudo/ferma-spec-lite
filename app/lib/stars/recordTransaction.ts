import { supabaseAdmin } from "../supabaseAdmin";

export interface TransactionInput {
  telegramId: number;
  kind: string;
  starsDelta: number;
  status?: string;
  amount?: number;
  currency?: string;
  provider?: string;
  providerRef?: string | null;
  payload?: Record<string, unknown> | null;
}

export async function recordTransaction(input: TransactionInput): Promise<void> {
  if (!supabaseAdmin) return;

  const row: Record<string, unknown> = {
    telegram_id: input.telegramId,
    kind: input.kind,
    stars_delta: input.starsDelta,
    status: input.status ?? "success"
  };

  if (input.amount !== undefined) row.amount = input.amount;
  if (input.currency !== undefined) row.currency = input.currency;
  if (input.provider !== undefined) row.provider = input.provider;
  if (input.providerRef !== undefined) row.provider_ref = input.providerRef;
  if (input.payload !== undefined) row.payload = input.payload;

  await supabaseAdmin.from("transactions").insert([row]);
}
