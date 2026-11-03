"use client";

import { useMemo, useState } from "react";

type Mode = "sip" | "lumpsum" | "stepup";

type YearRow = {
  year: number;
  invested: number;
  endBalance: number;
  gains: number;
};

type Projection = {
  invested: number;
  futureValue: number;
  gains: number;
  byYear: YearRow[];
};

function monthlyRate(annualPct: number) {
  return Math.pow(1 + annualPct / 100, 1 / 12) - 1;
}

function computeSIP(
  monthly: number,
  annualPct: number,
  years: number,
): Projection {
  const i = monthlyRate(annualPct);
  const n = years * 12;
  const byYear: YearRow[] = [];
  let balance = 0;
  let invested = 0;
  for (let m = 1; m <= n; m++) {
    balance = (balance + monthly) * (1 + i);
    invested += monthly;
    if (m % 12 === 0) {
      byYear.push({
        year: m / 12,
        invested,
        endBalance: balance,
        gains: balance - invested,
      });
    }
  }
  return { invested, futureValue: balance, gains: balance - invested, byYear };
}

function computeLumpsum(
  amount: number,
  annualPct: number,
  years: number,
): Projection {
  const r = annualPct / 100;
  const byYear: YearRow[] = [];
  for (let y = 1; y <= years; y++) {
    const bal = amount * Math.pow(1 + r, y);
    byYear.push({
      year: y,
      invested: amount,
      endBalance: bal,
      gains: bal - amount,
    });
  }
  const fv = amount * Math.pow(1 + r, years);
  return { invested: amount, futureValue: fv, gains: fv - amount, byYear };
}

function computeStepUp(
  monthly: number,
  annualPct: number,
  years: number,
  stepPct: number,
): Projection {
  const i = monthlyRate(annualPct);
  const step = stepPct / 100;
  const byYear: YearRow[] = [];
  let balance = 0;
  let invested = 0;
  let currentMonthly = monthly;
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = (balance + currentMonthly) * (1 + i);
      invested += currentMonthly;
    }
    byYear.push({
      year: y,
      invested,
      endBalance: balance,
      gains: balance - invested,
    });
    currentMonthly = currentMonthly * (1 + step);
  }
  return { invested, futureValue: balance, gains: balance - invested, byYear };
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrCompact = (n: number) => {
  if (!Number.isFinite(n)) return "₹0";
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
  return inrFormatter.format(n);
};

export default function SipPage() {
  const [mode, setMode] = useState<Mode>("sip");
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [stepUp, setStepUp] = useState(10);
  const [showTable, setShowTable] = useState(false);

  const projection = useMemo<Projection>(() => {
    if (mode === "lumpsum") return computeLumpsum(amount, rate, years);
    if (mode === "stepup") return computeStepUp(amount, rate, years, stepUp);
    return computeSIP(amount, rate, years);
  }, [mode, amount, rate, years, stepUp]);

  const investedPct =
    projection.futureValue > 0
      ? (projection.invested / projection.futureValue) * 100
      : 0;
  const gainsPct = 100 - investedPct;

  const amountLabel =
    mode === "lumpsum" ? "One-time investment" : "Monthly investment";
  const amountMax = mode === "lumpsum" ? 10_000_000 : 200_000;
  const amountStep = mode === "lumpsum" ? 1000 : 500;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            SIP Calculator
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Project your mutual-fund returns across SIP, Lumpsum, and Step-up
            scenarios.
          </p>
        </header>

        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-xl border border-neutral-800 bg-neutral-900/60 p-1">
            {(
              [
                { k: "sip", label: "SIP" },
                { k: "stepup", label: "Step-up SIP" },
                { k: "lumpsum", label: "Lumpsum" },
              ] as { k: Mode; label: string }[]
            ).map((t) => (
              <button
                key={t.k}
                onClick={() => setMode(t.k)}
                className={`px-4 py-1.5 text-sm rounded-lg transition ${
                  mode === t.k
                    ? "bg-emerald-500 text-neutral-950 font-semibold"
                    : "text-neutral-400 hover:text-neutral-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-3 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-6">
            <Field
              label={amountLabel}
              value={amount}
              onChange={setAmount}
              min={500}
              max={amountMax}
              step={amountStep}
              formatValue={(v) => inrFormatter.format(v)}
              suffix=""
            />
            <Field
              label="Expected return rate (p.a.)"
              value={rate}
              onChange={setRate}
              min={1}
              max={30}
              step={0.1}
              formatValue={(v) => `${v.toFixed(1)}`}
              suffix="%"
            />
            <Field
              label="Time period"
              value={years}
              onChange={setYears}
              min={1}
              max={40}
              step={1}
              formatValue={(v) => String(v)}
              suffix=" yr"
            />
            {mode === "stepup" && (
              <Field
                label="Annual step-up"
                value={stepUp}
                onChange={setStepUp}
                min={0}
                max={25}
                step={0.5}
                formatValue={(v) => `${v.toFixed(1)}`}
                suffix="%"
              />
            )}
          </section>

          <section className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 flex flex-col items-center">
            <Donut invested={investedPct} gains={gainsPct} />
            <div className="mt-6 w-full space-y-3">
              <Stat
                color="bg-neutral-500"
                label="Invested amount"
                value={inrFormatter.format(projection.invested)}
              />
              <Stat
                color="bg-emerald-500"
                label="Est. returns"
                value={inrFormatter.format(projection.gains)}
              />
              <div className="border-t border-neutral-800 pt-3">
                <Stat
                  color="bg-emerald-400"
                  label="Total value"
                  value={inrFormatter.format(projection.futureValue)}
                  bold
                />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/70 overflow-hidden">
          <button
            onClick={() => setShowTable((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium hover:bg-neutral-900/40 transition"
          >
            <span>Year-wise breakdown</span>
            <span className="text-neutral-500">{showTable ? "−" : "+"}</span>
          </button>
          {showTable && (
            <div className="overflow-x-auto border-t border-neutral-800">
              <table className="w-full text-sm">
                <thead className="bg-neutral-900/60 text-neutral-400">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Year</th>
                    <th className="px-4 py-2 text-right font-medium">
                      Invested
                    </th>
                    <th className="px-4 py-2 text-right font-medium">Gains</th>
                    <th className="px-4 py-2 text-right font-medium">
                      End balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projection.byYear.map((row) => (
                    <tr
                      key={row.year}
                      className="border-t border-neutral-800/60 font-mono"
                    >
                      <td className="px-4 py-2">{row.year}</td>
                      <td className="px-4 py-2 text-right text-neutral-400">
                        {inrCompact(row.invested)}
                      </td>
                      <td className="px-4 py-2 text-right text-emerald-400">
                        {inrCompact(row.gains)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {inrCompact(row.endBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="mt-10 text-center text-xs text-neutral-600">
          Projections are estimates. Actual mutual-fund returns vary with
          market conditions.
        </footer>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  formatValue: (n: number) => string;
  suffix: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-neutral-400">{label}</label>
        <div className="flex items-center gap-1 rounded-lg bg-neutral-950/80 border border-neutral-800 px-3 py-1.5">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isFinite(v)) onChange(Math.min(max, Math.max(min, v)));
            }}
            min={min}
            max={max}
            step={step}
            className="w-28 bg-transparent text-right font-mono text-emerald-400 font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && (
            <span className="text-emerald-400 font-semibold text-sm">
              {suffix}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-500"
      />
      <div className="mt-1 flex justify-between text-[11px] font-mono text-neutral-600">
        <span>{formatValue(min)}{suffix}</span>
        <span>{formatValue(max)}{suffix}</span>
      </div>
    </div>
  );
}

function Donut({ invested, gains }: { invested: number; gains: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const investedLen = (invested / 100) * c;
  const gainsLen = (gains / 100) * c;

  return (
    <div className="relative">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="#262626"
          strokeWidth="22"
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="#737373"
          strokeWidth="22"
          strokeDasharray={`${investedLen} ${c}`}
          transform="rotate(-90 100 100)"
          strokeLinecap="butt"
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="#10b981"
          strokeWidth="22"
          strokeDasharray={`${gainsLen} ${c}`}
          strokeDashoffset={-investedLen}
          transform="rotate(-90 100 100)"
          strokeLinecap="butt"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-neutral-500">Returns</span>
        <span className="font-mono text-xl font-semibold text-emerald-400">
          {gains.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

function Stat({
  color,
  label,
  value,
  bold = false,
}: {
  color: string;
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
        {label}
      </div>
      <span
        className={`font-mono ${
          bold ? "text-lg font-semibold text-neutral-50" : "text-neutral-200"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
