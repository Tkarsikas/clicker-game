# Coin Quest — Expo Clicker Game

A colorful five-level clicker built with React Native, Expo SDK 58 and TypeScript.

## Run

```bash
npm install
npx expo start
```

## Gameplay

Tap the floating golden coin to earn points. Each level has a target for points earned over a *rolling* 10-second window: 20, 50, 100, 200 and 400. Buy upgrades with your available coins to increase points per tap. Upgrades and available coins carry across levels. Passing a level unlocks the Next Level button; the unlock remains available after the rolling window expires.

## Source layout

- `App.tsx` — layout and game screen
- `src/components/TapCoin.tsx` — animated tappable coin and popups
- `src/game/useClickerGame.ts` — game logic and rolling-window score
- `src/game/config.ts` — level targets and upgrade price formula
- `src/theme/colors.ts` — design tokens
- `assets/tap-coin.png` — in-game illustrated coin

No additional dependencies are required beyond the blank TypeScript template.
