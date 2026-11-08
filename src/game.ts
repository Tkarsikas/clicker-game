export const LEVEL_TARGETS = [20, 50, 100, 200, 400] as const;
export const WINDOW_MS = 10_000;

export type Tap = { id: number; timestamp: number; points: number };

export function rollingScore(taps: Tap[], now: number): number {
  return taps.reduce(
    (total, tap) => total + (now - tap.timestamp < WINDOW_MS ? tap.points : 0),
    0,
  );
}

export function nextUpgradePrice(current: number): number {
  return Math.ceil(current * 1.8);
}
