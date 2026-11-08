import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GAME_CONFIG, INITIAL_UPGRADE_COST, LEVEL_TARGETS, nextUpgradeCost, WINDOW_MS } from './config';

type Click = { at: number; earned: number };

export function useClickerGame() {
  const [level, setLevel] = useState(0);
  const [balance, setBalance] = useState(GAME_CONFIG.startingCoins);
  const [lifetime, setLifetime] = useState(0);
  const [power, setPower] = useState(GAME_CONFIG.startingPointsPerClick);
  const [upgradeCost, setUpgradeCost] = useState(INITIAL_UPGRADE_COST);
  const [now, setNow] = useState(Date.now());
  const [completed, setCompleted] = useState(false);
  const [won, setWon] = useState(false);
  const clicks = useRef<Click[]>([]);
  const [recent, setRecent] = useState(0);

  const refresh = useCallback((time: number) => {
    clicks.current = clicks.current.filter((click) => time - click.at < WINDOW_MS);
    setRecent(clicks.current.reduce((sum, click) => sum + click.earned, 0));
    setNow(time);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => refresh(Date.now()), 100);
    return () => clearInterval(timer);
  }, [refresh]);

  const target = LEVEL_TARGETS[level];
  useEffect(() => {
    if (recent >= target) setCompleted(true);
  }, [recent, target]);

  const tap = useCallback(() => {
    if (won) return;
    const time = Date.now();
    clicks.current.push({ at: time, earned: power });
    refresh(time);
    setBalance((value) => value + power);
    setLifetime((value) => value + power);
  }, [power, refresh, won]);

  const upgrade = useCallback(() => {
    if (won || balance < upgradeCost) return;
    setBalance((value) => value - upgradeCost);
    setPower((value) => value + GAME_CONFIG.pointsPerUpgrade);
    setUpgradeCost(nextUpgradeCost(upgradeCost));
  }, [balance, upgradeCost, won]);

  const nextLevel = useCallback(() => {
    if (!completed || won) return;
    if (level === LEVEL_TARGETS.length - 1) {
      setWon(true);
      return;
    }
    clicks.current = [];
    setRecent(0);
    setCompleted(false);
    setLevel((value) => value + 1);
  }, [completed, level, won]);

  const restart = useCallback(() => {
    clicks.current = [];
    setLevel(0);
    setBalance(GAME_CONFIG.startingCoins);
    setLifetime(0);
    setPower(GAME_CONFIG.startingPointsPerClick);
    setUpgradeCost(INITIAL_UPGRADE_COST);
    setRecent(0);
    setCompleted(false);
    setWon(false);
  }, []);

  return useMemo(() => ({
    level: level + 1, target, balance, lifetime, power, upgradeCost,
    recent, completed, won, progress: Math.min(recent / target, 1),
    tap, upgrade, nextLevel, restart,
  }), [level, target, balance, lifetime, power, upgradeCost, recent, completed, won, tap, upgrade, nextLevel, restart]);
}
