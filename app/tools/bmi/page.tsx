"use client";

import { useMemo, useState } from "react";

type HeightUnit = "cm" | "ft";
type WeightUnit = "kg" | "lb";

type Category = {
  label: string;
  min: number;
  max: number;
  color: string;
  text: string;
  advice: string;
};

const CATEGORIES: Category[] = [
  {
    label: "Underweight",
    min: 0,
    max: 18.5,
    color: "bg-sky-500",
    text: "text-sky-400",
    advice: "Consider a nutrient-dense diet and strength training.",
  },
  {
    label: "Normal",
    min: 18.5,
    max: 25,
    color: "bg-emerald-500",
    text: "text-emerald-400",
    advice: "You're in the healthy range — keep it up.",
  },
  {
    label: "Overweight",
    min: 25,
    max: 30,
    color: "bg-amber-500",
    text: "text-amber-400",
    advice: "Small lifestyle adjustments can bring you to a healthy range.",
  },
  {
    label: "Obese I",
    min: 30,
    max: 35,
    color: "bg-orange-500",
    text: "text-orange-400",
    advice: "Consider consulting a doctor and a structured plan.",
  },
  {
    label: "Obese II",
    min: 35,
    max: 40,
    color: "bg-red-500",
    text: "text-red-400",
    advice: "Medical guidance is recommended.",
  },
  {
    label: "Obese III",
    min: 40,
    max: Infinity,
    color: "bg-rose-600",
    text: "text-rose-500",
    advice: "Please consult a healthcare professional.",
  },
];

const GAUGE_MIN = 10;
const GAUGE_MAX = 45;

function classify(bmi: number): Category {
  return (
    CATEGORIES.find((c) => bmi >= c.min && bmi < c.max) ??
    CATEGORIES[CATEGORIES.length - 1]
  );
}

export default function BmiPage() {
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [cm, setCm] = useState(170);
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(7);
  const [kg, setKg] = useState(70);
  const [lb, setLb] = useState(154);
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<"male" | "female">("male");

  const heightMeters = useMemo(() => {
    if (heightUnit === "cm") return cm / 100;
    return (ft * 12 + inch) * 0.0254;
  }, [heightUnit, cm, ft, inch]);

  const weightKg = useMemo(() => {
    return weightUnit === "kg" ? kg : lb * 0.453592;
  }, [weightUnit, kg, lb]);

  const bmi = useMemo(() => {
    if (heightMeters <= 0) return 0;
    return weightKg / (heightMeters * heightMeters);
  }, [weightKg, heightMeters]);

  const category = classify(bmi);

  const healthyRange = useMemo(() => {
    const minKg = 18.5 * heightMeters * heightMeters;
    const maxKg = 24.9 * heightMeters * heightMeters;
    if (weightUnit === "kg")
      return `${minKg.toFixed(1)} – ${maxKg.toFixed(1)} kg`;
    return `${(minKg / 0.453592).toFixed(1)} – ${(maxKg / 0.453592).toFixed(1)} lb`;
  }, [heightMeters, weightUnit]);

  const gaugePct = Math.min(
    100,
    Math.max(0, ((bmi - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100),
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            BMI Calculator
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Body Mass Index — a quick snapshot of weight relative to height.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-3 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 space-y-6">
            <UnitToggle
              label="Gender"
              value={gender}
              options={[
                { k: "male", label: "Male" },
                { k: "female", label: "Female" },
              ]}
              onChange={(v) => setGender(v as "male" | "female")}
            />

            <NumberInput
              label="Age"
              value={age}
              onChange={setAge}
              min={2}
              max={120}
              suffix="yr"
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-neutral-400">Height</label>
                <UnitPill
                  value={heightUnit}
                  options={[
                    { k: "cm", label: "cm" },
                    { k: "ft", label: "ft/in" },
                  ]}
                  onChange={(v) => setHeightUnit(v as HeightUnit)}
                />
              </div>
              {heightUnit === "cm" ? (
                <SliderInput
                  value={cm}
                  onChange={setCm}
                  min={80}
                  max={250}
                  step={1}
                  suffix="cm"
                />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <NumberInput
                    label="Feet"
                    value={ft}
                    onChange={setFt}
                    min={2}
                    max={8}
                    suffix="ft"
                    inline
                  />
                  <NumberInput
                    label="Inches"
                    value={inch}
                    onChange={setInch}
                    min={0}
                    max={11}
                    suffix="in"
                    inline
                  />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-neutral-400">Weight</label>
                <UnitPill
                  value={weightUnit}
                  options={[
                    { k: "kg", label: "kg" },
                    { k: "lb", label: "lb" },
                  ]}
                  onChange={(v) => setWeightUnit(v as WeightUnit)}
                />
              </div>
              {weightUnit === "kg" ? (
                <SliderInput
                  value={kg}
                  onChange={setKg}
                  min={20}
                  max={200}
                  step={0.5}
                  suffix="kg"
                />
              ) : (
                <SliderInput
                  value={lb}
                  onChange={setLb}
                  min={44}
                  max={440}
                  step={1}
                  suffix="lb"
                />
              )}
            </div>
          </section>

          <section className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 flex flex-col">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-neutral-500">
                Your BMI
              </div>
              <div className="mt-2 font-mono text-5xl font-semibold">
                {bmi > 0 ? bmi.toFixed(1) : "—"}
              </div>
              <div
                className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium bg-neutral-950/60 border border-neutral-800 ${category.text}`}
              >
                {category.label}
              </div>
            </div>

            <div className="mt-6">
              <div className="relative h-3 w-full rounded-full overflow-hidden flex">
                {CATEGORIES.slice(0, 5).map((c, idx) => {
                  const span =
                    ((Math.min(c.max, GAUGE_MAX) - c.min) /
                      (GAUGE_MAX - GAUGE_MIN)) *
                    100;
                  return (
                    <div
                      key={idx}
                      className={c.color}
                      style={{ width: `${span}%` }}
                    />
                  );
                })}
                <div
                  className={CATEGORIES[5].color}
                  style={{
                    width: `${((GAUGE_MAX - 40) / (GAUGE_MAX - GAUGE_MIN)) * 100}%`,
                  }}
                />
                {bmi > 0 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${gaugePct}%` }}
                  >
                    <div className="h-5 w-1 rounded bg-white shadow-lg shadow-black/60" />
                  </div>
                )}
              </div>
              <div className="mt-1 flex justify-between text-[10px] font-mono text-neutral-600">
                <span>{GAUGE_MIN}</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>35</span>
                <span>40</span>
              </div>
            </div>

            <p className="mt-6 text-sm text-neutral-400">{category.advice}</p>

            <div className="mt-6 pt-4 border-t border-neutral-800 space-y-2 text-sm">
              <Row label="Healthy weight range" value={healthyRange} />
              <Row
                label="Ideal BMI window"
                value="18.5 – 24.9"
                mono
              />
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6">
          <h2 className="text-sm font-semibold text-neutral-300 mb-4">
            BMI categories (WHO)
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => (
              <div
                key={c.label}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                  c === category
                    ? "border-neutral-600 bg-neutral-800/50"
                    : "border-neutral-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-sm ${c.color}`} />
                  <span className="text-sm">{c.label}</span>
                </div>
                <span className="font-mono text-xs text-neutral-500">
                  {c.min}
                  {c.max === Infinity ? "+" : ` – ${c.max}`}
                </span>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-neutral-600">
          BMI is a screening tool, not a diagnosis. It doesn't distinguish
          muscle from fat — consult a professional for a full assessment.
        </footer>
      </div>
    </main>
  );
}

function SliderInput({
  value,
  onChange,
  min,
  max,
  step,
  suffix,
}: {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
  suffix: string;
}) {
  return (
    <div>
      <div className="flex justify-end mb-2">
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
            className="w-24 bg-transparent text-right font-mono text-emerald-400 font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-emerald-400 font-semibold text-sm">
            {suffix}
          </span>
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
        <span>
          {min} {suffix}
        </span>
        <span>
          {max} {suffix}
        </span>
      </div>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
  inline = false,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  suffix: string;
  inline?: boolean;
}) {
  return (
    <div className={inline ? "" : "flex items-center justify-between"}>
      <label
        className={`text-sm text-neutral-400 ${inline ? "block mb-2" : ""}`}
      >
        {label}
      </label>
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
          className="w-20 bg-transparent text-right font-mono text-emerald-400 font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-emerald-400 font-semibold text-sm">
          {suffix}
        </span>
      </div>
    </div>
  );
}

function UnitPill({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { k: string; label: string }[];
  onChange: (k: string) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-neutral-800 bg-neutral-950/60 p-0.5">
      {options.map((o) => (
        <button
          key={o.k}
          onClick={() => onChange(o.k)}
          className={`px-2.5 py-1 text-xs rounded transition ${
            value === o.k
              ? "bg-emerald-500 text-neutral-950 font-semibold"
              : "text-neutral-400 hover:text-neutral-100"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function UnitToggle({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { k: string; label: string }[];
  onChange: (k: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-neutral-400">{label}</label>
      <UnitPill value={value} options={options} onChange={onChange} />
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-neutral-500">{label}</span>
      <span className={mono ? "font-mono text-neutral-200" : "text-neutral-200"}>
        {value}
      </span>
    </div>
  );
}
