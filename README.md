# Coin Quest 🪙

A colorful five-level clicker game made with **Expo SDK 58**, **React Native**, and **TypeScript**, starting from the blank TypeScript template.

## Play

- Tap the animated golden coin to earn points.
- The meter displays points earned during the **last 10 seconds** (rolling window), not lifetime points.
- Spend accumulated coins on tap upgrades. Each upgrade adds +1 point/tap; prices rise by 1.8×.
- Meet the stage goal to unlock the next level (20, 50, 100, 200, 400).
- Clear the fifth level to win.

## Run

```bash
npm ci
npx expo start
```

Launch with Expo Go or an Android/iOS emulator.

## Project structure

- `App.tsx`: game screen, animated coin, upgrades, level transitions.
- `src/game.ts`: pure point/upgrade calculations and game constants.

## Checks

```bash
npx tsc --noEmit
```

No additional runtime dependencies are required beyond the Expo blank TypeScript template.

## Change game settings

Edit **`src/game/config.ts`** to configure level targets, time-window length,
starting coins, starting tap power, upgrade pricing, upgrade strength and score
refresh rate. The running app reads all these values from this single file.
The default targets are 20 / 50 / 100 / 200 / 400 points per 10 seconds.

For example, set `levelTargets: [30, 80, 150, 350, 800]` to make the levels harder.
After changing a setting, save the file and reload Expo. Existing in-memory
progress is not automatically reset by Fast Refresh; restart the game if
needed.

## Changing the clickable coin image

The active coin component is **`src/components/ClickCoin.tsx`**. The default image
is `assets/tap-coin.png`. To change it:

1. Copy your own PNG, JPG or WebP into `assets/` (transparent PNG recommended).
2. In `ClickCoin.tsx`, change the single `COIN_IMAGE` line, for example:

```tsx
const COIN_IMAGE = require('../../assets/my-new-coin.png');
```

The image is displayed with `resizeMode="contain"`, so its aspect ratio is kept.
The animation and press handler are inside ClickCoin, and the gameplay logic
remains in App.tsx. Metro requires a **literal** file path in `require(...)`.
Reload Expo after changing the image. The older `TapCoin.tsx` component is not
used by the current App screen.
