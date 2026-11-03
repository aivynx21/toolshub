"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RatesResponse = {
  result: string;
  base_code: string;
  time_last_update_utc: string;
  rates: Record<string, number>;
};

type Currency = { code: string; name: string; flag: string };

const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭" },
  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩" },
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
  { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳" },
  { code: "PLN", name: "Polish Zloty", flag: "🇵🇱" },
  { code: "DKK", name: "Danish Krone", flag: "🇩🇰" },
  { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
  { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩" },
  { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵" },
  { code: "LKR", name: "Sri Lankan Rupee", flag: "🇱🇰" },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" },
  { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬" },
  { code: "ARS", name: "Argentine Peso", flag: "🇦🇷" },
  { code: "ILS", name: "Israeli Shekel", flag: "🇮🇱" },
  { code: "CZK", name: "Czech Koruna", flag: "🇨🇿" },
  { code: "HUF", name: "Hungarian Forint", flag: "🇭🇺" },
  { code: "RON", name: "Romanian Leu", flag: "🇷🇴" },
];

const CURRENCY_MAP = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c]),
);

function formatAmount(n: number, code: string) {
  if (!Number.isFinite(n)) return "—";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: n >= 100 ? 2 : 4,
    }).format(n);
  } catch {
    return n.toFixed(2);
  }
}

export default function CurrencyPage() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState<string>("1");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [baseCode, setBaseCode] = useState<string>("USD");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<Record<string, RatesResponse>>({});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (cache.current[from]) {
          const cached = cache.current[from];
          setRates(cached.rates);
          setBaseCode(cached.base_code);
          setUpdatedAt(cached.time_last_update_utc);
          setLoading(false);
          return;
        }
        const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: RatesResponse = await res.json();
        if (data.result !== "success")
          throw new Error("Rate provider returned an error");
        if (cancelled) return;
        cache.current[from] = data;
        setRates(data.rates);
        setBaseCode(data.base_code);
        setUpdatedAt(data.time_last_update_utc);
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error
              ? e.message
              : "Could not load exchange rates",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [from]);

  const rate = rates && rates[to] ? rates[to] : null;
  const amountNum = Number(amount);
  const converted =
    rate && Number.isFinite(amountNum) ? amountNum * rate : null;

  const inverseRate = rate ? 1 / rate : null;

  const popular = useMemo(() => {
    const codes = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"].filter(
      (c) => c !== from,
    );
    if (!rates) return [];
    return codes
      .map((code) => ({
        code,
        rate: rates[code],
        meta: CURRENCY_MAP[code],
      }))
      .filter((r) => r.rate && r.meta);
  }, [rates, from]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Currency Converter
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Live exchange rates across 40+ world currencies.
          </p>
        </header>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] items-end">
            <ConverterSide
              label="From"
              amount={amount}
              onAmount={setAmount}
              currency={from}
              onCurrency={setFrom}
              editable
            />
            <button
              onClick={swap}
              className="h-10 w-10 self-end md:self-center md:mt-6 rounded-full border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 transition text-emerald-400 text-lg"
              aria-label="Swap currencies"
              title="Swap"
            >
              ⇄
            </button>
            <ConverterSide
              label="To"
              amount={
                converted !== null
                  ? converted.toLocaleString(undefined, {
                      maximumFractionDigits:
                        converted >= 100 ? 2 : 4,
                    })
                  : loading
                    ? "…"
                    : "—"
              }
              onAmount={() => {}}
              currency={to}
              onCurrency={setTo}
              editable={false}
            />
          </div>

          <div className="mt-6 pt-5 border-t border-neutral-800 text-sm">
            {error ? (
              <div className="text-red-400">⚠ {error}</div>
            ) : loading ? (
              <div className="text-neutral-500">Fetching latest rates…</div>
            ) : rate ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-neutral-300">
                  1 {baseCode} ={" "}
                  <span className="text-emerald-400 font-semibold">
                    {rate.toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                    })}
                  </span>{" "}
                  {to}
                </div>
                <div className="font-mono text-xs text-neutral-500">
                  1 {to} ={" "}
                  {inverseRate?.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}{" "}
                  {baseCode}
                </div>
              </div>
            ) : (
              <div className="text-neutral-500">Rate unavailable for {to}</div>
            )}
            {updatedAt && (
              <div className="mt-2 text-xs text-neutral-600">
                Updated: {updatedAt}
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6">
          <h2 className="text-sm font-semibold text-neutral-300 mb-4">
            1 {from} in popular currencies
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {loading && (
              <div className="col-span-full text-sm text-neutral-500">
                Loading…
              </div>
            )}
            {popular.map((p) => (
              <button
                key={p.code}
                onClick={() => setTo(p.code)}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                  p.code === to
                    ? "border-emerald-500/60 bg-emerald-500/5"
                    : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.meta.flag}</span>
                  <div>
                    <div className="text-sm font-medium">{p.code}</div>
                    <div className="text-[11px] text-neutral-500">
                      {p.meta.name}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-sm text-emerald-400">
                  {p.rate.toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}
                </div>
              </button>
            ))}
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-neutral-600">
          Rates sourced from open.er-api.com — refreshed every ~24 hours.
          Indicative only; not for trading decisions.
        </footer>
      </div>
    </main>
  );
}

function ConverterSide({
  label,
  amount,
  onAmount,
  currency,
  onCurrency,
  editable,
}: {
  label: string;
  amount: string;
  onAmount: (v: string) => void;
  currency: string;
  onCurrency: (c: string) => void;
  editable: boolean;
}) {
  const meta = CURRENCY_MAP[currency];
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">
        {label}
      </label>
      <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-3">
        <div className="flex items-center gap-2">
          <select
            value={currency}
            onChange={(e) => onCurrency(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-sm font-medium outline-none hover:border-neutral-700 cursor-pointer"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <span className="text-xs text-neutral-500 truncate">
            {meta?.name ?? currency}
          </span>
        </div>
        {editable ? (
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmount(e.target.value)}
            className="mt-3 w-full bg-transparent font-mono text-2xl font-semibold text-emerald-400 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        ) : (
          <div className="mt-3 font-mono text-2xl font-semibold text-neutral-100 break-all">
            {amount}
          </div>
        )}
      </div>
    </div>
  );
}
