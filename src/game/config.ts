/**
 * COIN QUEST - GAME SETTINGS
 *
 * Edit the values in this file to balance the game.
 * All targets and costs are shared by App.tsx and the game hook.
 */
export const GAME_CONFIG = {
  // Score required within the rolling time window, one number per level.
  levelTargets: [20, 50, 100, 200, 400],

  // Length of the rolling score window in seconds.
  scoreWindowSeconds: 10,

  // Points awarded by the first tap.
  startingPointsPerClick: 1,

  // Coins the player has when starting a new game.
  startingCoins: 0,

  // Price of the first +points-per-tap upgrade.
  initialUpgradeCost: 20,

  // Cost multiplier applied after purchasing an upgrade.
  upgradeCostMultiplier: 1.8,

  // How many extra points an upgrade grants per tap.
  pointsPerUpgrade: 1,

  // How often the rolling score refreshes (milliseconds).
  scoreRefreshIntervalMs: 100,
} as const;

// Legacy named exports are derived from this configuration, never duplicated.
export const LEVEL_TARGETS = GAME_CONFIG.levelTargets;
export const WINDOW_MS = GAME_CONFIG.scoreWindowSeconds * 1000;
export const INITIAL_UPGRADE_COST = GAME_CONFIG.initialUpgradeCost;

export function nextUpgradeCost(price: number): number {
  return Math.ceil(price * GAME_CONFIG.upgradeCostMultiplier);
}
