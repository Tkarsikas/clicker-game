import { WINDOW_MS, nextUpgradeCost } from './game/config';

// Re-export so older modules importing from src/game.ts keep working.
export { LEVEL_TARGETS, WINDOW_MS } from './game/config';

export type Tap = { id: number; timestamp: number; points: number };

export function rollingScore(taps: Tap[], now: number): number {
  return taps.reduce(
    (total, tap) => total + (now - tap.timestamp < WINDOW_MS ? tap.points : 0),
    0,
  );
}

export const nextUpgradePrice = nextUpgradeCost;
