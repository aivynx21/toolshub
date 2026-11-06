import type { Tool } from "@/lib/tools";
import {
  Calculator,
  ChartLineUp,
  Coins,
  FilePdf,
  Fingerprint,
  Heartbeat,
  Key,
  QrCode,
} from "@phosphor-icons/react/dist/ssr";

const ICONS = {
  heart: Heartbeat,
  calc: Calculator,
  coins: Coins,
  chart: ChartLineUp,
  qr: QrCode,
  key: Key,
  token: Fingerprint,
  pdf: FilePdf,
} as const;

export function ToolIcon({ name, size = 20 }: { name: Tool["icon"]; size?: number }) {
  const Icon = ICONS[name];
  return <Icon size={size} weight="duotone" aria-hidden />;
}
