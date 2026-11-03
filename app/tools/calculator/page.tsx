"use client";

import { useCallback, useEffect, useState } from "react";

type Operator = "+" | "-" | "*" | "/";

const isOperator = (v: string): v is Operator =>
  v === "+" || v === "-" || v === "*" || v === "/";

const operatorSymbol: Record<Operator, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

function compute(a: number, b: number, op: Operator): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
  }
}

function formatDisplay(value: string): string {
  if (value === "" || value === "-") return value || "0";
  if (value === "Error") return value;
  const n = Number(value);
  if (!Number.isFinite(n)) return "Error";
  if (value.endsWith(".") || value.includes("e")) return value;
  const [intPart, decPart] = value.split(".");
  const sign = intPart.startsWith("-") ? "-" : "";
  const absInt = sign ? intPart.slice(1) : intPart;
  const withCommas = absInt.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined
    ? `${sign}${withCommas}.${decPart}`
    : `${sign}${withCommas}`;
}

export default function CalculatorPage() {
  const [current, setCurrent] = useState("0");
  const [previous, setPrevious] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const clearAll = useCallback(() => {
    setCurrent("0");
    setPrevious(null);
    setOperator(null);
    setJustEvaluated(false);
  }, []);

  const inputDigit = useCallback(
    (d: string) => {
      setCurrent((prev) => {
        if (justEvaluated) {
          setJustEvaluated(false);
          return d;
        }
        if (prev === "0" || prev === "Error") return d;
        if (prev.replace(/[-.]/g, "").length >= 15) return prev;
        return prev + d;
      });
    },
    [justEvaluated],
  );

  const inputDecimal = useCallback(() => {
    setCurrent((prev) => {
      if (justEvaluated) {
        setJustEvaluated(false);
        return "0.";
      }
      if (prev === "Error") return "0.";
      if (prev.includes(".")) return prev;
      return prev + ".";
    });
  }, [justEvaluated]);

  const backspace = useCallback(() => {
    setCurrent((prev) => {
      if (justEvaluated || prev === "Error") {
        setJustEvaluated(false);
        return "0";
      }
      if (prev.length <= 1 || (prev.length === 2 && prev.startsWith("-")))
        return "0";
      return prev.slice(0, -1);
    });
  }, [justEvaluated]);

  const toggleSign = useCallback(() => {
    setCurrent((prev) => {
      if (prev === "0" || prev === "Error") return prev;
      return prev.startsWith("-") ? prev.slice(1) : "-" + prev;
    });
    setJustEvaluated(false);
  }, []);

  const percent = useCallback(() => {
    setCurrent((prev) => {
      const n = Number(prev);
      if (!Number.isFinite(n)) return "Error";
      return String(n / 100);
    });
    setJustEvaluated(false);
  }, []);

  const applyOperator = useCallback(
    (op: Operator) => {
      if (current === "Error") return;
      if (previous !== null && operator && !justEvaluated) {
        const result = compute(Number(previous), Number(current), operator);
        if (!Number.isFinite(result)) {
          setCurrent("Error");
          setPrevious(null);
          setOperator(null);
          setJustEvaluated(false);
          return;
        }
        const resultStr = String(result);
        setPrevious(resultStr);
        setCurrent(resultStr);
      } else {
        setPrevious(current);
      }
      setOperator(op);
      setJustEvaluated(true);
    },
    [current, previous, operator, justEvaluated],
  );

  const evaluate = useCallback(() => {
    if (previous === null || operator === null || current === "Error") return;
    const result = compute(Number(previous), Number(current), operator);
    if (!Number.isFinite(result)) {
      setCurrent("Error");
    } else {
      setCurrent(String(result));
    }
    setPrevious(null);
    setOperator(null);
    setJustEvaluated(true);
  }, [previous, operator, current]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { key } = e;
      if (key >= "0" && key <= "9") {
        inputDigit(key);
      } else if (key === ".") {
        inputDecimal();
      } else if (isOperator(key)) {
        applyOperator(key);
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        evaluate();
      } else if (key === "Backspace") {
        backspace();
      } else if (key === "Escape" || key === "c" || key === "C") {
        clearAll();
      } else if (key === "%") {
        percent();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    inputDigit,
    inputDecimal,
    applyOperator,
    evaluate,
    backspace,
    clearAll,
    percent,
  ]);

  const expression =
    previous !== null && operator
      ? `${formatDisplay(previous)} ${operatorSymbol[operator]}`
      : " ";

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Simple Calculator
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Keyboard supported — type to calculate.
        </p>
      </header>

      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="mb-5 rounded-xl bg-neutral-950/80 border border-neutral-800 p-4 text-right">
          <div className="h-5 font-mono text-sm text-neutral-500 truncate">
            {expression}
          </div>
          <div className="mt-1 font-mono text-4xl sm:text-5xl font-semibold tracking-tight break-all">
            {formatDisplay(current)}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <Btn onClick={clearAll} variant="muted">
            AC
          </Btn>
          <Btn onClick={toggleSign} variant="muted">
            +/−
          </Btn>
          <Btn onClick={percent} variant="muted">
            %
          </Btn>
          <Btn onClick={() => applyOperator("/")} variant="accent">
            ÷
          </Btn>

          <Btn onClick={() => inputDigit("7")}>7</Btn>
          <Btn onClick={() => inputDigit("8")}>8</Btn>
          <Btn onClick={() => inputDigit("9")}>9</Btn>
          <Btn onClick={() => applyOperator("*")} variant="accent">
            ×
          </Btn>

          <Btn onClick={() => inputDigit("4")}>4</Btn>
          <Btn onClick={() => inputDigit("5")}>5</Btn>
          <Btn onClick={() => inputDigit("6")}>6</Btn>
          <Btn onClick={() => applyOperator("-")} variant="accent">
            −
          </Btn>

          <Btn onClick={() => inputDigit("1")}>1</Btn>
          <Btn onClick={() => inputDigit("2")}>2</Btn>
          <Btn onClick={() => inputDigit("3")}>3</Btn>
          <Btn onClick={() => applyOperator("+")} variant="accent">
            +
          </Btn>

          <Btn onClick={() => inputDigit("0")} className="col-span-2">
            0
          </Btn>
          <Btn onClick={inputDecimal}>.</Btn>
          <Btn onClick={evaluate} variant="primary">
            =
          </Btn>
        </div>

        <div className="mt-5 flex justify-between text-[11px] font-mono text-neutral-500">
          <span>Enter = evaluate</span>
          <button
            onClick={backspace}
            className="rounded-md border border-neutral-800 px-2 py-1 hover:bg-neutral-800/60 transition"
          >
            ⌫ Backspace
          </button>
        </div>
      </div>

      <footer className="mt-10 text-xs text-neutral-600">
        © {new Date().getFullYear()} aivynx — built with Next.js
      </footer>
    </main>
  );
}

function Btn({
  children,
  onClick,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "muted" | "accent" | "primary";
  className?: string;
}) {
  const base =
    "h-14 rounded-xl font-medium text-lg transition active:scale-[0.97] select-none";
  const styles: Record<string, string> = {
    default:
      "bg-neutral-800 hover:bg-neutral-700 text-neutral-50 border border-neutral-700/60",
    muted:
      "bg-neutral-800/50 hover:bg-neutral-700/70 text-neutral-300 border border-neutral-700/50",
    accent:
      "bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-neutral-700/60",
    primary:
      "bg-emerald-500 hover:bg-emerald-400 text-neutral-950 border border-emerald-400 font-semibold",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
