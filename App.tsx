import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import {
  Animated,
  Pressable,
  Platform,
  SafeAreaView,
  StatusBar as NativeStatusBar,
  useWindowDimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ClickCoin } from './src/components/ClickCoin';
import { rollingScore, type Tap } from './src/game';
import { GAME_CONFIG, LEVEL_TARGETS, nextUpgradeCost, WINDOW_MS } from './src/game/config';

const C = {
  bg: '#0c1026', panel: '#1b2146', panelEdge: '#39427b',
  gold: '#ffd66b', lavender: '#c3beff', white: '#f9f7ff',
  purple: '#8260fa', green: '#49e3a2', muted: '#a3a9d3',
};

export default function App() {
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  // All content stays in one viewport; the playfield uses remaining space.
  const compact = screenHeight < 820 || screenWidth < 390;
  const veryCompact = screenHeight < 690;
  const coinSize = Math.max(92, Math.min(174, (screenHeight - (Platform.OS === 'android' ? 48 : 20) - 400) * 0.65, screenWidth * 0.43));
  const [level, setLevel] = useState(0);
  const [wallet, setWallet] = useState(GAME_CONFIG.startingCoins);
  const [power, setPower] = useState(GAME_CONFIG.startingPointsPerClick);
  const [upgradePrice, setUpgradePrice] = useState(GAME_CONFIG.initialUpgradeCost);
  const [taps, setTaps] = useState<Tap[]>([]);
  const [now, setNow] = useState(Date.now());
  const [cleared, setCleared] = useState(false);
  const [won, setWon] = useState(false);
  const [flashId, setFlashId] = useState(0);
  const flash = useRef(new Animated.Value(0)).current;
  const id = useRef(0);
  const punchPlayer = useAudioPlayer(require('./assets/sounds/punch-bag.wav'));

  const playPunch = () => {
    // Replay a single short, low impact sound on every coin tap.
    void punchPlayer.seekTo(0).then(() => punchPlayer.play()).catch(() => punchPlayer.play());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now();
      setNow(time);
      setTaps(previous => previous.filter(t => time - t.timestamp < WINDOW_MS));
    }, GAME_CONFIG.scoreRefreshIntervalMs);
    return () => clearInterval(interval);
  }, []);


  const recent = rollingScore(taps, now);
  const goal = LEVEL_TARGETS[level];
  const unlocked = cleared || recent >= goal;
  const percentage = Math.min(100, Math.round((recent / goal) * 100));

  useEffect(() => {
    if (recent >= goal && !cleared) setCleared(true);
  }, [recent, goal, cleared]);

  const click = () => {
    if (won) return;
    const time = Date.now();
    id.current += 1;
    setTaps(previous => [
      ...previous.filter(t => time - t.timestamp < WINDOW_MS),
      { id: id.current, timestamp: time, points: power },
    ]);
    setNow(time);
    setWallet(previous => previous + power);
    playPunch();
    setFlashId(previous => previous + 1);
    flash.stopAnimation();
    flash.setValue(1);
    Animated.timing(flash, { toValue: 0, duration: 650, useNativeDriver: true }).start();
  };

  const upgrade = () => {
    if (won || wallet < upgradePrice) return;
    setWallet(previous => previous - upgradePrice);
    setPower(previous => previous + GAME_CONFIG.pointsPerUpgrade);
    setUpgradePrice(nextUpgradeCost(upgradePrice));
  };

  const advance = () => {
    if (!unlocked || won) return;
    if (level === LEVEL_TARGETS.length - 1) {
      setWon(true);
      return;
    }
    setLevel(previous => previous + 1);
    setCleared(false);
    setTaps([]);
  };

  const reset = () => {
    setLevel(0);
    setWallet(GAME_CONFIG.startingCoins);
    setPower(GAME_CONFIG.startingPointsPerClick);
    setUpgradePrice(GAME_CONFIG.initialUpgradeCost);
    setTaps([]);
    setCleared(false);
    setWon(false);
  };


  return (
    <SafeAreaView style={[styles.root, Platform.OS === 'android' && { paddingTop: NativeStatusBar.currentHeight ?? 24, paddingBottom: 24 }]}>
      <StatusBar style="light" />
      <View style={[styles.screen, compact && styles.compactScreen, veryCompact && styles.tinyScreen]}>
        <View style={[styles.heading, compact && styles.compactHeading, veryCompact && styles.tinyHeading]}>
          {!veryCompact && <Text style={styles.overline}>✦ THE ULTIMATE TAP CHALLENGE ✦</Text>}
          <Text style={styles.title}>COIN <Text style={styles.titleAccent}>QUEST</Text></Text>
          {!compact && <Text style={styles.subtitle}>Tap fast. Power up. Conquer all five levels.</Text>}
        </View>

        <View style={styles.levelRow}>
          <Text style={styles.levelLabel}>⭐ LEVEL {level + 1} / {LEVEL_TARGETS.length}</Text>
          <Text style={styles.levelTag}>{won ? 'CHAMPION' : unlocked ? 'READY!' : 'IN PROGRESS'}</Text>
        </View>

        <View style={[styles.scoreCard, compact && styles.compactScoreCard]}>
          <Text style={styles.statCaption}>POINTS IN THE LAST {GAME_CONFIG.scoreWindowSeconds} SECONDS</Text>
          <Text style={[styles.score, compact && styles.compactScore]}>{recent}<Text style={styles.scoreTarget}> / {goal}</Text></Text>
          <View style={styles.track}>
            <View style={[styles.trackFill, { width: `${percentage}%` }]} />
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{percentage}% of target</Text>
            <Text style={styles.progressLabel}>{GAME_CONFIG.scoreWindowSeconds}s rolling window</Text>
          </View>
        </View>

        <View style={[styles.statsRow, compact && styles.compactStatsRow]}>
          <View style={[styles.miniCard, compact && styles.compactMiniCard]}>
            <Text style={styles.miniIcon}>🪙</Text>
            <View>
              <Text style={styles.miniLabel}>YOUR COINS</Text>
              <Text style={styles.miniValue}>{wallet}</Text>
            </View>
          </View>
          <View style={[styles.miniCard, compact && styles.compactMiniCard]}>
            <Text style={styles.miniIcon}>⚡</Text>
            <View>
              <Text style={styles.miniLabel}>PER TAP</Text>
              <Text style={styles.miniValue}>+{power}</Text>
            </View>
          </View>
        </View>

        <View style={styles.playArea}>
          <View style={[styles.haloOuter, { width: coinSize * 1.38, height: coinSize * 1.38, borderRadius: coinSize }]} />
          <View style={[styles.haloInner, { width: coinSize * 1.16, height: coinSize * 1.16, borderRadius: coinSize }]} />
          <Text style={[styles.sparkle, { top: 28, left: 38 }]}>✦</Text>
          <Text style={[styles.sparkle, { top: 70, right: 28 }]}>✧</Text>
          <Text style={[styles.sparkle, { bottom: 42, left: 26 }]}>✧</Text>
          <ClickCoin size={coinSize} onPress={click} disabled={won} />
          <Animated.Text
            key={flashId}
            pointerEvents="none"
            style={[styles.popText, {
              opacity: flash,
              transform: [{ translateY: flash.interpolate({ inputRange: [0, 1], outputRange: [-65, -20] }) }],
            }]}
          >
            +{power}
          </Animated.Text>
          <Text style={styles.tapHint}>{won ? 'QUEST COMPLETE!' : 'TAP THE MAGIC COIN!'}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Upgrade click for ${upgradePrice} points`}
          onPress={upgrade}
          disabled={wallet < upgradePrice || won}
          style={({ pressed }) => [
            styles.upgradeCard,
            (wallet < upgradePrice || won) && styles.upgradeLocked,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.upgradeIcon}><Text style={styles.upgradeEmoji}>⬆</Text></View>
          <View style={styles.upgradeCopy}>
            <Text style={styles.upgradeTitle}>POWER UP YOUR TAP</Text>
            <Text style={styles.upgradeSubtitle}>+{GAME_CONFIG.pointsPerUpgrade} point(s) per tap  ·  🪙 {upgradePrice} coins</Text>
          </View>
          <Text style={styles.upgradeArrow}>›</Text>
        </Pressable>

        {unlocked && !won ? (
          <Pressable accessibilityRole="button" onPress={advance} style={styles.advanceButton}>
            <Text style={styles.advanceText}>{level === LEVEL_TARGETS.length - 1 ? '🏆 CLAIM VICTORY' : 'NEXT LEVEL  →'}</Text>
          </Pressable>
        ) : won ? (
          <View style={styles.victory}>
            <Text style={styles.victoryTitle}>🏆 YOU WON!</Text>
            <Pressable accessibilityRole="button" onPress={reset}><Text style={styles.reset}>PLAY AGAIN ↻</Text></Pressable>
          </View>
        ) : (
          <View style={styles.footerSlot}><Text style={styles.footerHint}>Reach {goal} points in {GAME_CONFIG.scoreWindowSeconds} seconds to unlock the next level.</Text></View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  screen: { flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  compactScreen: { paddingTop: 6, paddingBottom: 6, paddingHorizontal: 14 },
  tinyScreen: { paddingTop: 2, paddingBottom: 2 },
  compactHeading: { marginBottom: 5 },
  tinyHeading: { marginBottom: 2 },
  compactScoreCard: { paddingVertical: 8, paddingHorizontal: 14 },
  compactScore: { fontSize: 27, marginVertical: 2 },
  compactStatsRow: { marginTop: 6 },
  compactMiniCard: { paddingVertical: 7, paddingHorizontal: 10 },
  footerSlot: { minHeight: 44, justifyContent: 'center' },
  heading: { alignItems: 'center', marginBottom: 12 },
  overline: { color: C.lavender, fontSize: 10, letterSpacing: 2, fontWeight: '800' },
  title: { color: C.gold, fontSize: 39, fontWeight: '900', letterSpacing: -1, marginTop: 6, textShadowColor: '#6840a0', textShadowRadius: 12 },
  titleAccent: { color: C.white },
  subtitle: { color: C.muted, fontSize: 12, marginTop: 2, textAlign: 'center' },
  levelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  levelLabel: { color: C.gold, fontWeight: '900', fontSize: 16 },
  levelTag: { color: C.green, fontWeight: '800', fontSize: 10, letterSpacing: 1 },
  scoreCard: { backgroundColor: C.panel, borderRadius: 20, borderWidth: 1, borderColor: C.panelEdge, padding: 20 },
  statCaption: { color: C.lavender, textAlign: 'center', fontWeight: '800', fontSize: 11, letterSpacing: 1 },
  score: { color: C.white, textAlign: 'center', fontWeight: '900', fontSize: 39, marginVertical: 10 },
  scoreTarget: { color: C.muted, fontSize: 26 },
  track: { height: 13, backgroundColor: '#101633', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#414a81' },
  trackFill: { height: '100%', backgroundColor: C.green, borderRadius: 20 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  progressLabel: { color: C.muted, fontSize: 11 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  miniCard: { flex: 1, flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: C.panel, padding: 14, borderRadius: 16, borderColor: C.panelEdge, borderWidth: 1 },
  miniIcon: { fontSize: 24 },
  miniLabel: { color: C.muted, fontWeight: '800', fontSize: 10 },
  miniValue: { color: C.white, fontSize: 23, fontWeight: '900' },
  playArea: { flex: 1, minHeight: 0, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  haloOuter: { position: 'absolute', width: 245, height: 245, borderRadius: 130, backgroundColor: '#413277', opacity: 0.26 },
  haloInner: { position: 'absolute', width: 203, height: 203, borderRadius: 110, backgroundColor: '#9e6bff', opacity: 0.14 },
  sparkle: { position: 'absolute', color: C.gold, fontSize: 26 },
  popText: { position: 'absolute', color: C.gold, fontSize: 31, fontWeight: '900', top: 27, alignSelf: 'center' },
  tapHint: { position: 'absolute', bottom: 1, color: C.lavender, fontWeight: '900', fontSize: 12, letterSpacing: 2 },
  upgradeCard: { backgroundColor: C.purple, padding: 9, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 5, borderBottomColor: '#5235b5' },
  upgradeLocked: { opacity: 0.55 },
  pressed: { transform: [{ scale: 0.98 }] },
  upgradeIcon: { height: 44, width: 44, borderRadius: 13, backgroundColor: '#a990ff', alignItems: 'center', justifyContent: 'center' },
  upgradeEmoji: { fontSize: 28, fontWeight: '900', color: C.white },
  upgradeCopy: { flex: 1 },
  upgradeTitle: { color: C.white, fontWeight: '900', fontSize: 13 },
  upgradeSubtitle: { color: '#efeaff', fontSize: 11, marginTop: 5 },
  upgradeArrow: { color: C.white, fontSize: 32 },
  advanceButton: { backgroundColor: C.green, padding: 11, borderRadius: 14, marginTop: 6, alignItems: 'center' },
  advanceText: { color: '#092c28', fontWeight: '900', fontSize: 16 },
  footerHint: { color: C.muted, textAlign: 'center', fontSize: 11, lineHeight: 15 },
  victory: { alignItems: 'center', marginTop: 3 },
  victoryTitle: { color: C.gold, fontWeight: '900', fontSize: 25 },
  reset: { color: C.green, fontWeight: '900', padding: 14 },
});
