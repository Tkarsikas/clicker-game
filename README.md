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

## Changing the image for each level

The active coin component is `src/components/ClickCoin.tsx`. It contains a
`LEVEL_IMAGES` list for levels 1-5. All levels initially use
`assets/tap-coin.png`, so the game works immediately.

1. Add your PNG/JPG/WebP files to `assets/` (transparent PNG recommended).
2. In `src/components/ClickCoin.tsx`, edit the corresponding entries:

```tsx
const LEVEL_IMAGES = [
  require('../../assets/level1.png'), // Level 1
  require('../../assets/level2.png'), // Level 2
  require('../../assets/level3.png'), // Level 3
  require('../../assets/level4.png'), // Level 4
  require('../../assets/level5.png'), // Level 5
];
```

**Important:** Only use those example paths after adding the matching files.
`require(...)` must contain a literal path (not a variable) for Metro to
bundle each image. No edits to `App.tsx` are needed: the current level is
passed automatically to `ClickCoin`, and the image changes as you advance.
The existing tap animations are shared by all images. Images keep their aspect
ratio using `resizeMode="contain"`.

If you add more levels to `src/game/config.ts`, add additional image entries.
If the list is shorter than the level count, the final available image is used.

The older `TapCoin.tsx` component is not used by the current App screen.
