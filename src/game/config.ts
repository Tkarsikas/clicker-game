export const LEVEL_TARGETS = [20, 50, 100, 200, 400] as const;
export const WINDOW_MS = 10_000;
export const INITIAL_UPGRADE_COST = 20;
export const nextUpgradeCost = (price: number) => Math.ceil(price * 1.8);
