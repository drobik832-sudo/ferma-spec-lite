"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, LogOut, ShieldAlert } from "lucide-react";

type AdminUserRow = {
  telegram_id: number;
  first_name: string | null;
  username: string | null;
  stars: number | null;
  created_at: string;
};

type AdminEventRow = {
  id: number;
  created_at: string;
  telegram_id: number;
  event: string;
  payload: unknown;
};

type AdminTransactionRow = {
  id: number;
  created_at: string;
  telegram_id: number;
  kind: string;
  stars_delta: number;
  amount: number | null;
  currency: string | null;
  provider: string | null;
  provider_ref: string | null;
  status: string | null;
  payload: unknown;
};

type AdminOverview = {
  ok: boolean;
  users: AdminUserRow[];
  events: AdminEventRow[];
  transactions: AdminTransactionRow[];
  totals: {
    users: number;
    stars: number;
    generationStarts: number;
    generationSuccess: number;
    generationErrors: number;
    avgDurationSec: number | null;
  };
  message?: string;
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [data, setData] = useState<AdminOverview | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "events" | "transactions" | "health">("overview");
  const [userFilter, setUserFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [eventUserFilter, setEventUserFilter] = useState("");
  const [txUserFilter, setTxUserFilter] = useState("");
  const [txKindFilter, setTxKindFilter] = useState("");
  const [transactions, setTransactions] = useState<AdminTransactionRow[] | null>(null);
  const [health, setHealth] = useState<any>(null);

  const [adjustTelegramId, setAdjustTelegramId] = useState("");
  const [adjustDelta, setAdjustDelta] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustError, setAdjustError] = useState<string | null>(null);
  const [adjustOk, setAdjustOk] = useState<string | null>(null);

  const usersStarsLabel = useMemo(() => {
    const stars = data?.totals?.stars ?? 0;
    return `${stars} ⭐ (последние 50 пользователей)`;
  }, [data?.totals?.stars]);

  const successRate = useMemo(() => {
    const starts = data?.totals?.generationStarts ?? 0;
    const success = data?.totals?.generationSuccess ?? 0;
    if (!starts) return "—";
    return `${Math.round((success / starts) * 100)}%`;
  }, [data?.totals?.generationStarts, data?.totals?.generationSuccess]);

  const gpuVramTotal = useMemo(() => {
    const total = health?.comfy?.stats?.body?.system?.gpus?.[0]?.vram_total;
    return total ? Math.round(total / 1024 / 1024) : '—';
  }, [health]);

  const gpuVramUsed = useMemo(() => {
    const total = health?.comfy?.stats?.body?.system?.gpus?.[0]?.vram_total;
    const free = health?.comfy?.stats?.body?.system?.gpus?.[0]?.vram_free;
    if (!total || !free) return '—';
    return Math.round((total - free) / 1024 / 1024);
  }, [health]);

  const queueRunning = useMemo(() => health?.comfy?.queue?.body?.queue_running?.length ?? '—', [health]);
  const queuePending = useMemo(() => health?.comfy?.queue?.body?.queue_pending?.length ?? '—', [health]);

  const filteredUsers = useMemo(() => {
    const q = userFilter.trim().toLowerCase();
    if (!q) return data?.users || [];
    return (data?.users || []).filter(user => {
      const id = String(user.telegram_id);
      const firstName = (user.first_name || "").toLowerCase();
      const username = (user.username || "").toLowerCase();
      return id.includes(q) || firstName.includes(q) || username.includes(q);
    });
  }, [data?.users, userFilter]);

  const filteredEvents = useMemo(() => {
    const q = eventFilter.trim().toLowerCase();
    const u = eventUserFilter.trim();
    return (data?.events || []).filter(ev => {
      if (u && String(ev.telegram_id) !== u) return false;
      if (!q) return true;
      return ev.event.toLowerCase().includes(q);
    });
  }, [data?.events, eventFilter, eventUserFilter]);

  async function loadOverview() {
    setLoading(true);
    setAuthError(null);
    const res = await fetch("/api/admin/overview", { method: "GET" });
    const json = (await res.json().catch(() => null)) as AdminOverview | null;
    if (!res.ok) {
      setData(null);
      setLoading(false);
      return;
    }
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadOverview();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!data?.ok) return;
    if (activeTab !== "transactions") return;
    const params = new URLSearchParams();
    if (txUserFilter.trim()) params.set("telegramId", txUserFilter.trim());
    if (txKindFilter.trim()) params.set("kind", txKindFilter.trim());
    params.set("limit", "200");
    fetch(`/api/admin/transactions?${params.toString()}`)
      .then(res => res.json())
      .then(json => {
        if (json?.ok) setTransactions(json.items || []);
        else setTransactions([]);
      })
      .catch(() => setTransactions([]));
  }, [activeTab, data?.ok, txUserFilter, txKindFilter]);

  useEffect(() => {
    if (!data?.ok) return;
    if (activeTab !== "health") return;
    fetch("/api/admin/health")
      .then(res => res.json())
      .then(json => setHealth(json))
      .catch(() => setHealth({ ok: true, comfy: { status: 0, error: "failed" } }));
  }, [activeTab, data?.ok]);

  async function handleLogin() {
    setAuthError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token })
    });
    if (!res.ok) {
      setAuthError("Неверный токен");
      return;
    }
    setToken("");
    await loadOverview();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    setData(null);
    setAuthError(null);
    setLoading(false);
  }

  async function handleAdjust() {
    setAdjustError(null);
    setAdjustOk(null);
    const telegramId = Number(adjustTelegramId);
    const delta = Number(adjustDelta);
    if (!Number.isFinite(telegramId) || telegramId <= 0) {
      setAdjustError("Некорректный telegram_id");
      return;
    }
    if (!Number.isFinite(delta) || delta === 0) {
      setAdjustError("Delta должен быть числом и не 0");
      return;
    }
    const res = await fetch("/api/admin/users/adjust", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ telegramId, delta, reason: adjustReason || null })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.ok !== true) {
      setAdjustError(json?.message || "Ошибка");
      return;
    }
    setAdjustOk(`Готово. Новый баланс: ${json.stars} ⭐`);
    setAdjustTelegramId("");
    setAdjustDelta("");
    setAdjustReason("");
    await loadOverview();
    setActiveTab("overview");
  }

  const isAuthed = Boolean(data?.ok);

  return (
    <main className="min-h-screen bg-[#fdfbf7] text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 text-[#856c45] hover:underline font-medium">
              <ArrowLeft className="w-4 h-4" />
              Назад
            </Link>
            <div className="text-xl font-bold text-[#856c45]">Админка</div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthed && (
              <>
                <button
                  type="button"
                  onClick={() => void loadOverview()}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-[#856c45]/20 text-[#856c45] font-bold text-sm shadow-sm hover:bg-[#f8f1e6]"
                >
                  <RefreshCw className="w-4 h-4" />
                  Обновить
                </button>
                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-[#856c45]/20 text-[#856c45] font-bold text-sm shadow-sm hover:bg-[#f8f1e6]"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </>
            )}
          </div>
        </div>

        {!isAuthed && (
          <div className="mt-8 max-w-md bg-white border border-[#e3d3b8] rounded-2xl p-5 shadow-sm">
            <div className="text-sm font-bold text-[#856c45] mb-2">Вход</div>
            <div className="text-xs text-gray-600 mb-3">Введите ADMIN_TOKEN</div>
            <div className="flex gap-2">
              <input
                value={token}
                onChange={e => setToken(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#856c45]/30"
                placeholder="ADMIN_TOKEN"
              />
              <button
                type="button"
                onClick={() => void handleLogin()}
                className="px-4 py-2 rounded-xl bg-[#856c45] text-white font-bold"
              >
                Ок
              </button>
            </div>
            {authError && <div className="mt-2 text-xs text-red-600">{authError}</div>}
            {!loading && !authError && (
              <div className="mt-2 text-xs text-gray-500">
                Если это твой проект локально — добавь ADMIN_TOKEN в .env.local и перезапусти.
              </div>
            )}
          </div>
        )}

        {isAuthed && (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { id: "overview", label: "Сводка" },
                { id: "users", label: "Пользователи" },
                { id: "events", label: "События" },
                { id: "transactions", label: "Транзакции" },
                { id: "health", label: "Сервис" }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#856c45] text-white border-[#856c45]"
                      : "bg-white text-[#856c45] border-[#856c45]/20 hover:bg-[#f8f1e6]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-[#e3d3b8] rounded-2xl p-4">
                    <div className="text-xs text-gray-500">Пользователи</div>
                    <div className="text-2xl font-bold text-[#856c45]">{data?.totals?.users ?? 0}</div>
                  </div>
                  <div className="bg-white border border-[#e3d3b8] rounded-2xl p-4">
                    <div className="text-xs text-gray-500">Звёзды</div>
                    <div className="text-lg font-bold text-[#856c45]">{usersStarsLabel}</div>
                  </div>
                  <div className="bg-white border border-[#e3d3b8] rounded-2xl p-4">
                    <div className="text-xs text-gray-500">Генерации (посл. 100 событий)</div>
                    <div className="text-sm font-bold text-[#856c45]">
                      start {data?.totals?.generationStarts ?? 0} · ok {data?.totals?.generationSuccess ?? 0} · err{" "}
                      {data?.totals?.generationErrors ?? 0}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Success rate: {successRate} · Avg:{" "}
                      {typeof data?.totals?.avgDurationSec === "number" ? `${Math.round(data.totals.avgDurationSec)}s` : "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-white border border-[#e3d3b8] rounded-2xl p-5">
                  <div className="text-sm font-bold text-[#856c45] mb-3">Ручное изменение звёзд</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input
                      value={adjustTelegramId}
                      onChange={e => setAdjustTelegramId(e.target.value)}
                      placeholder="telegram_id"
                      className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#856c45]/30 font-mono"
                    />
                    <input
                      value={adjustDelta}
                      onChange={e => setAdjustDelta(e.target.value)}
                      placeholder="delta (например 10 или -3)"
                      className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#856c45]/30"
                    />
                    <input
                      value={adjustReason}
                      onChange={e => setAdjustReason(e.target.value)}
                      placeholder="причина (необязательно)"
                      className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#856c45]/30"
                    />
                    <button
                      type="button"
                      onClick={() => void handleAdjust()}
                      className="px-4 py-2 rounded-xl bg-[#856c45] text-white font-bold"
                    >
                      Применить
                    </button>
                  </div>
                  {adjustError && <div className="mt-2 text-xs text-red-600">{adjustError}</div>}
                  {adjustOk && <div className="mt-2 text-xs text-green-700">{adjustOk}</div>}
                </div>

                <div className="mt-6 bg-white border border-[#e3d3b8] rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#e3d3b8]">
                    <div className="text-sm font-bold text-[#856c45]">Транзакции (последние 50)</div>
                  </div>
                  <div className="max-h-[360px] overflow-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="sticky top-0 bg-white">
                        <tr className="text-xs text-gray-500 border-b border-gray-100">
                          <th className="p-3">Время</th>
                          <th className="p-3">Kind</th>
                          <th className="p-3">User</th>
                          <th className="p-3">Δ⭐</th>
                          <th className="p-3">Статус</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(data?.transactions || []).map(tx => (
                          <tr key={tx.id}>
                            <td className="p-3 text-[12px] text-gray-600 whitespace-nowrap">
                              {new Date(tx.created_at).toLocaleString()}
                            </td>
                            <td className="p-3 font-medium">{tx.kind}</td>
                            <td className="p-3 font-mono text-[12px]">{tx.telegram_id}</td>
                            <td className="p-3 font-bold text-[#856c45]">{tx.stars_delta}</td>
                            <td className="p-3 text-[12px] text-gray-600">{tx.status || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === "users" && (
              <div className="mt-6 bg-white border border-[#e3d3b8] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#e3d3b8] flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="text-sm font-bold text-[#856c45]">Пользователи (последние 50)</div>
                  <input
                    value={userFilter}
                    onChange={e => setUserFilter(e.target.value)}
                    placeholder="Поиск: id / имя / username"
                    className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#856c45]/30 text-sm"
                  />
                </div>
                <div className="max-h-[520px] overflow-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-white">
                      <tr className="text-xs text-gray-500 border-b border-gray-100">
                        <th className="p-3">Telegram</th>
                        <th className="p-3">Имя</th>
                        <th className="p-3">⭐</th>
                        <th className="p-3">Создан</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map(row => (
                        <tr key={row.telegram_id}>
                          <td className="p-3 font-mono text-[12px]">{row.telegram_id}</td>
                          <td className="p-3">
                            <div className="font-medium">{row.first_name || "—"}</div>
                            <div className="text-[12px] text-gray-500">{row.username ? `@${row.username}` : "—"}</div>
                          </td>
                          <td className="p-3 font-bold text-[#856c45]">{row.stars ?? 0}</td>
                          <td className="p-3 text-[12px] text-gray-600 whitespace-nowrap">
                            {new Date(row.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "events" && (
              <div className="mt-6 bg-white border border-[#e3d3b8] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#e3d3b8] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                  <div className="text-sm font-bold text-[#856c45]">События (последние 100)</div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={eventUserFilter}
                      onChange={e => setEventUserFilter(e.target.value)}
                      placeholder="telegram_id"
                      className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#856c45]/30 text-sm font-mono"
                    />
                    <input
                      value={eventFilter}
                      onChange={e => setEventFilter(e.target.value)}
                      placeholder="Фильтр по событию (например generation_)"
                      className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#856c45]/30 text-sm"
                    />
                  </div>
                </div>
                <div className="max-h-[520px] overflow-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-white">
                      <tr className="text-xs text-gray-500 border-b border-gray-100">
                        <th className="p-3">Время</th>
                        <th className="p-3">Событие</th>
                        <th className="p-3">User</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredEvents.map(row => (
                        <tr key={row.id}>
                          <td className="p-3 text-[12px] text-gray-600 whitespace-nowrap">
                            {new Date(row.created_at).toLocaleString()}
                          </td>
                          <td className="p-3">
                            <div className="font-medium">{row.event}</div>
                            {row.payload ? (
                              <div className="text-[12px] text-gray-500 break-words">
                                {JSON.stringify(row.payload).slice(0, 180)}
                              </div>
                            ) : (
                              <div className="text-[12px] text-gray-400">—</div>
                            )}
                          </td>
                          <td className="p-3 font-mono text-[12px]">{row.telegram_id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="mt-6 bg-white border border-[#e3d3b8] rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#e3d3b8] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                  <div className="text-sm font-bold text-[#856c45]">Транзакции</div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={txUserFilter}
                      onChange={e => setTxUserFilter(e.target.value)}
                      placeholder="telegram_id"
                      className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#856c45]/30 text-sm font-mono"
                    />
                    <input
                      value={txKindFilter}
                      onChange={e => setTxKindFilter(e.target.value)}
                      placeholder="kind (например purchase)"
                      className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#856c45]/30 text-sm"
                    />
                  </div>
                </div>
                <div className="max-h-[520px] overflow-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-white">
                      <tr className="text-xs text-gray-500 border-b border-gray-100">
                        <th className="p-3">Время</th>
                        <th className="p-3">Kind</th>
                        <th className="p-3">User</th>
                        <th className="p-3">Δ⭐</th>
                        <th className="p-3">Provider</th>
                        <th className="p-3">Ref</th>
                        <th className="p-3">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(transactions || []).map(tx => (
                        <tr key={tx.id}>
                          <td className="p-3 text-[12px] text-gray-600 whitespace-nowrap">
                            {new Date(tx.created_at).toLocaleString()}
                          </td>
                          <td className="p-3 font-medium">{tx.kind}</td>
                          <td className="p-3 font-mono text-[12px]">{tx.telegram_id}</td>
                          <td className="p-3 font-bold text-[#856c45]">{tx.stars_delta}</td>
                          <td className="p-3 text-[12px] text-gray-600">{tx.provider || "—"}</td>
                          <td className="p-3 text-[12px] text-gray-600">{tx.provider_ref || "—"}</td>
                          <td className="p-3 text-[12px] text-gray-600">{tx.status || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "health" && (
              <div className="mt-6 bg-white border border-[#e3d3b8] rounded-2xl p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#856c45]">
                  <ShieldAlert className="w-4 h-4" />
                  Состояние сервиса
                </div>
                <div className="mt-3 text-sm">
                  <div className="text-xs text-gray-500 mb-1">ComfyUI</div>
                  <div className="font-mono text-[12px] text-gray-700">
                    {health?.comfy?.url || "—"} · status {health?.comfy?.status ?? "—"}
                  </div>
                  {health?.comfy?.error && <div className="mt-2 text-xs text-red-600">{health.comfy.error}</div>}
                  {health?.comfy?.body && (
                    <pre className="mt-2 text-[11px] bg-[#f8f1e6] border border-[#e3d3b8] rounded-xl p-3 overflow-auto max-h-[320px]">
                      {JSON.stringify(health.comfy.body, null, 2)}
                    </pre>
                  )}

                  <div className="mt-4 text-sm">
                    <div className="text-xs text-gray-500 mb-1">GPU (первая карта)</div>
                    <div className="font-mono text-[12px] text-gray-700">
                      VRAM: {gpuVramUsed} / {gpuVramTotal} MB
                    </div>
                    <div className="text-xs text-gray-500 mb-1 mt-2">Очередь</div>
                    <div className="font-mono text-[12px] text-gray-700">
                      Выполняется: {queueRunning} · Ожидает: {queuePending}
                    </div>
                  </div>


                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
