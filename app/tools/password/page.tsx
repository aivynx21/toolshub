"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Mode = "password" | "passphrase" | "pin";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>/?~";
const SIMILAR = /[O0Il1]/g;
const AMBIGUOUS = /[{}\[\]()\/\\'"`~,;:.<>]/g;

const WORDS = [
  "apple","amber","anchor","arrow","atlas","aurora","basil","beacon","berry","blossom",
  "boulder","breeze","bronze","cactus","canyon","castle","cedar","cherry","cliff","cloud",
  "comet","copper","coral","cosmic","crimson","crystal","dagger","dawn","delta","desert",
  "diamond","dolphin","dragon","dusk","eagle","ember","emerald","falcon","feather","fern",
  "fiber","flame","forest","fossil","galaxy","garden","glacier","granite","harbor","harvest",
  "hazel","heron","honey","horizon","indigo","island","ivory","jaguar","jasper","jungle",
  "juniper","knight","lantern","lava","lemon","lilac","lotus","lunar","maple","marble",
  "meadow","mesa","meteor","mint","mist","moss","moth","mountain","nebula","nest",
  "nickel","nova","oak","ocean","olive","opal","orchid","otter","owl","oyster",
  "panda","pebble","pepper","petal","phoenix","pine","plum","prairie","quartz","quill",
  "rain","raven","reef","river","robin","ruby","rust","sage","sapphire","shadow",
  "silver","sky","slate","sparrow","spring","star","stone","storm","sugar","summit",
  "sunset","tango","thistle","thunder","tiger","timber","topaz","trail","tulip","tundra",
  "valley","velvet","violet","vortex","walnut","wave","willow","winter","wolf","zephyr",
];

function randomInt(max: number): number {
  const arr = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let n: number;
  do {
    crypto.getRandomValues(arr);
    n = arr[0];
  } while (n >= limit);
  return n % max;
}

function pick<T>(arr: readonly T[] | string): T | string {
  return arr[randomInt(arr.length)] as T;
}

function buildCharset(opts: {
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  custom: string;
}): string {
  if (opts.custom.trim()) return Array.from(new Set(opts.custom)).join("");
  let s = "";
  if (opts.upper) s += UPPER;
  if (opts.lower) s += LOWER;
  if (opts.digits) s += DIGITS;
  if (opts.symbols) s += SYMBOLS;
  if (opts.excludeSimilar) s = s.replace(SIMILAR, "");
  if (opts.excludeAmbiguous) s = s.replace(AMBIGUOUS, "");
  return s;
}

function generatePassword(length: number, charset: string): string {
  if (!charset) return "";
  let out = "";
  for (let i = 0; i < length; i++) out += pick(charset);
  return out;
}

function generatePassphrase(words: number, separator: string): string {
  const parts: string[] = [];
  for (let i = 0; i < words; i++) parts.push(String(pick(WORDS)));
  return parts.join(separator);
}

function generatePin(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) out += DIGITS[randomInt(10)];
  return out;
}

function estimateEntropy(password: string, charsetSize: number): number {
  if (!password || charsetSize <= 1) return 0;
  return password.length * Math.log2(charsetSize);
}

function strengthLabel(entropy: number): {
  label: string;
  pct: number;
  color: string;
  text: string;
} {
  const pct = Math.min(100, Math.round((entropy / 128) * 100));
  if (entropy < 28)
    return { label: "Very Weak", pct, color: "bg-red-500", text: "text-red-400" };
  if (entropy < 50)
    return { label: "Weak", pct, color: "bg-orange-500", text: "text-orange-400" };
  if (entropy < 80)
    return { label: "Fair", pct, color: "bg-amber-500", text: "text-amber-400" };
  if (entropy < 100)
    return { label: "Strong", pct, color: "bg-emerald-500", text: "text-emerald-400" };
  return { label: "Very Strong", pct, color: "bg-cyan-500", text: "text-cyan-400" };
}

export default function PasswordPage() {
  const [mode, setMode] = useState<Mode>("password");

  // password
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [custom, setCustom] = useState("");
  const [batch, setBatch] = useState(1);

  // passphrase
  const [words, setWords] = useState(5);
  const [separator, setSeparator] = useState("-");

  // pin
  const [pinLength, setPinLength] = useState(6);

  const [output, setOutput] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const charset = useMemo(
    () =>
      buildCharset({
        upper,
        lower,
        digits,
        symbols,
        excludeSimilar,
        excludeAmbiguous,
        custom,
      }),
    [upper, lower, digits, symbols, excludeSimilar, excludeAmbiguous, custom],
  );

  const effectiveCharsetSize = useMemo(() => {
    if (mode === "pin") return 10;
    if (mode === "passphrase") return WORDS.length;
    return charset.length;
  }, [mode, charset]);

  const strength = useMemo(() => {
    const firstLine = output.split("\n")[0] ?? "";
    if (!firstLine) return strengthLabel(0);
    if (mode === "passphrase")
      return strengthLabel(words * Math.log2(WORDS.length));
    return strengthLabel(estimateEntropy(firstLine, effectiveCharsetSize));
  }, [output, mode, words, effectiveCharsetSize]);

  const generate = useCallback(() => {
    const count = Math.max(1, Math.min(20, Math.floor(batch) || 1));
    const items: string[] = [];
    for (let i = 0; i < count; i++) {
      if (mode === "password") items.push(generatePassword(length, charset));
      else if (mode === "passphrase")
        items.push(generatePassphrase(words, separator));
      else items.push(generatePin(pinLength));
    }
    const joined = items.join("\n");
    setOutput(joined);
    setHistory((h) => [...items, ...h].slice(0, 10));
  }, [mode, length, charset, words, separator, pinLength, batch]);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Password Generator
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Generate passwords, passphrases, and PINs — fully offline in your
            browser.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400">
            <LockIcon /> Nothing leaves your browser
          </div>
        </header>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6">
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-neutral-800 bg-neutral-950/60 p-1">
            {(["password", "passphrase", "pin"] as Mode[]).map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium capitalize transition ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "text-neutral-400 hover:text-neutral-100"
                  }`}
                >
                  {m === "pin" ? "PIN" : m}
                </button>
              );
            })}
          </div>

          {mode === "password" && (
            <PasswordControls
              length={length}
              setLength={setLength}
              upper={upper}
              setUpper={setUpper}
              lower={lower}
              setLower={setLower}
              digits={digits}
              setDigits={setDigits}
              symbols={symbols}
              setSymbols={setSymbols}
              excludeSimilar={excludeSimilar}
              setExcludeSimilar={setExcludeSimilar}
              excludeAmbiguous={excludeAmbiguous}
              setExcludeAmbiguous={setExcludeAmbiguous}
              custom={custom}
              setCustom={setCustom}
              batch={batch}
              setBatch={setBatch}
            />
          )}

          {mode === "passphrase" && (
            <PassphraseControls
              words={words}
              setWords={setWords}
              separator={separator}
              setSeparator={setSeparator}
              batch={batch}
              setBatch={setBatch}
            />
          )}

          {mode === "pin" && (
            <PinControls
              pinLength={pinLength}
              setPinLength={setPinLength}
              batch={batch}
              setBatch={setBatch}
            />
          )}

          <div className="mt-6">
            <div className="relative">
              <textarea
                readOnly
                value={output}
                rows={Math.min(6, Math.max(1, output.split("\n").length))}
                className="w-full resize-y rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 pr-12 font-mono text-base text-neutral-100 outline-none"
              />
              <button
                type="button"
                onClick={() => copy(output)}
                className="absolute right-2 top-2 rounded-lg border border-neutral-800 bg-neutral-900 p-2 text-neutral-400 transition hover:text-neutral-100"
                aria-label="Copy"
              >
                <CopyIcon />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-neutral-200">Strength</span>
              <span className={`font-semibold ${strength.text}`}>
                {strength.label}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className={`h-full transition-all ${strength.color}`}
                style={{ width: `${strength.pct}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={generate}
            className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Generate {mode === "pin" ? "PIN" : mode === "passphrase" ? "Passphrase" : "Password"}
          </button>

          {history.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-neutral-200">
                  Session history
                </h2>
                <button
                  type="button"
                  onClick={() => setHistory([])}
                  className="text-xs text-neutral-400 underline-offset-2 hover:underline"
                >
                  Clear
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {history.map((h, i) => (
                  <li
                    key={`${i}-${h}`}
                    className="flex items-center justify-between gap-2 rounded-lg border border-neutral-800 bg-neutral-950/60 px-3 py-2"
                  >
                    <code className="truncate font-mono text-sm text-neutral-300">
                      {h}
                    </code>
                    <button
                      type="button"
                      onClick={() => copy(h)}
                      className="shrink-0 rounded-md p-1.5 text-neutral-500 transition hover:text-neutral-100"
                      aria-label="Copy"
                    >
                      <CopyIcon />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function PasswordControls(props: {
  length: number;
  setLength: (n: number) => void;
  upper: boolean;
  setUpper: (b: boolean) => void;
  lower: boolean;
  setLower: (b: boolean) => void;
  digits: boolean;
  setDigits: (b: boolean) => void;
  symbols: boolean;
  setSymbols: (b: boolean) => void;
  excludeSimilar: boolean;
  setExcludeSimilar: (b: boolean) => void;
  excludeAmbiguous: boolean;
  setExcludeAmbiguous: (b: boolean) => void;
  custom: string;
  setCustom: (s: string) => void;
  batch: number;
  setBatch: (n: number) => void;
}) {
  return (
    <div className="mt-6 space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="pw-length" className="text-sm font-medium text-neutral-200">
            Password length
          </label>
          <span className="font-mono text-sm text-emerald-400">
            {props.length}
          </span>
        </div>
        <input
          id="pw-length"
          type="range"
          min={8}
          max={128}
          value={props.length}
          onChange={(e) => props.setLength(Number(e.target.value))}
          className="mt-3 w-full accent-emerald-500"
        />
        <div className="mt-1 flex justify-between text-xs text-neutral-500">
          <span>8</span>
          <span>128</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Toggle label="A-Z" checked={props.upper} onChange={props.setUpper} />
        <Toggle label="a-z" checked={props.lower} onChange={props.setLower} />
        <Toggle label="0-9" checked={props.digits} onChange={props.setDigits} />
        <Toggle label="!@#$%" checked={props.symbols} onChange={props.setSymbols} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          label="Exclude similar (O0, 1lI)"
          checked={props.excludeSimilar}
          onChange={props.setExcludeSimilar}
        />
        <Toggle
          label="Exclude ambiguous symbols"
          checked={props.excludeAmbiguous}
          onChange={props.setExcludeAmbiguous}
        />
      </div>

      <div>
        <label
          htmlFor="pw-custom"
          className="text-sm font-medium text-neutral-200"
        >
          Custom character set{" "}
          <span className="font-normal text-neutral-500">
            (overrides checkboxes when non-empty)
          </span>
        </label>
        <input
          id="pw-custom"
          type="text"
          value={props.custom}
          onChange={(e) => props.setCustom(e.target.value)}
          placeholder="e.g. abc123!@#"
          className="mt-3 w-full rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5 font-mono text-sm text-neutral-100 placeholder:text-neutral-600 outline-none ring-emerald-500/40 transition focus:border-emerald-500/60 focus:ring-2"
        />
      </div>

      <BatchInput value={props.batch} onChange={props.setBatch} />
    </div>
  );
}

function PassphraseControls(props: {
  words: number;
  setWords: (n: number) => void;
  separator: string;
  setSeparator: (s: string) => void;
  batch: number;
  setBatch: (n: number) => void;
}) {
  return (
    <div className="mt-6 space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="pp-words" className="text-sm font-medium text-neutral-200">
            Words
          </label>
          <span className="font-mono text-sm text-emerald-400">
            {props.words}
          </span>
        </div>
        <input
          id="pp-words"
          type="range"
          min={3}
          max={12}
          value={props.words}
          onChange={(e) => props.setWords(Number(e.target.value))}
          className="mt-3 w-full accent-emerald-500"
        />
        <div className="mt-1 flex justify-between text-xs text-neutral-500">
          <span>3</span>
          <span>12</span>
        </div>
      </div>

      <div>
        <label htmlFor="pp-sep" className="text-sm font-medium text-neutral-200">
          Separator
        </label>
        <input
          id="pp-sep"
          type="text"
          value={props.separator}
          onChange={(e) => props.setSeparator(e.target.value)}
          maxLength={3}
          className="mt-3 w-full rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5 font-mono text-sm text-neutral-100 outline-none ring-emerald-500/40 transition focus:border-emerald-500/60 focus:ring-2"
        />
      </div>

      <BatchInput value={props.batch} onChange={props.setBatch} />
    </div>
  );
}

function PinControls(props: {
  pinLength: number;
  setPinLength: (n: number) => void;
  batch: number;
  setBatch: (n: number) => void;
}) {
  return (
    <div className="mt-6 space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="pin-length" className="text-sm font-medium text-neutral-200">
            PIN length
          </label>
          <span className="font-mono text-sm text-emerald-400">
            {props.pinLength}
          </span>
        </div>
        <input
          id="pin-length"
          type="range"
          min={4}
          max={12}
          value={props.pinLength}
          onChange={(e) => props.setPinLength(Number(e.target.value))}
          className="mt-3 w-full accent-emerald-500"
        />
        <div className="mt-1 flex justify-between text-xs text-neutral-500">
          <span>4</span>
          <span>12</span>
        </div>
      </div>

      <BatchInput value={props.batch} onChange={props.setBatch} />
    </div>
  );
}

function BatchInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="pw-batch" className="text-sm font-medium text-neutral-200">
        Batch generate
      </label>
      <input
        id="pw-batch"
        type="number"
        min={1}
        max={20}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 rounded-lg border border-neutral-800 bg-neutral-950/60 px-3 py-1.5 font-mono text-sm text-neutral-100 outline-none ring-emerald-500/40 transition focus:border-emerald-500/60 focus:ring-2"
      />
      <span className="text-xs text-neutral-500">1 = single, 2-20 = batch</span>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (b: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5 text-sm text-neutral-200 transition hover:border-neutral-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-emerald-500"
      />
      {label}
    </label>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
