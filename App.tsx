import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { TapCoin } from './src/components/TapCoin';
import { useClickerGame } from './src/game/useClickerGame';
import { colors } from './src/theme/colors';

export default function App() {
  const game = useClickerGame();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>✦ COIN<Text style={styles.titleGold}> QUEST</Text></Text>
          <Text style={styles.subtitle}>THE ULTIMATE TAP CHALLENGE</Text>
        </View>

        <View style={styles.levelPill}>
          <Text style={styles.levelText}>⭐ LEVEL {game.level} / 5</Text>
        </View>

        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>POINTS IN THE LAST 10 SECONDS</Text>
          <Text style={styles.goalValue}>{game.recent}<Text style={styles.goalOutOf}> / {game.target}</Text></Text>
          <View style={styles.track}><View style={[styles.fill, { width: `${game.progress * 100}%` }]} /></View>
          <Text style={styles.goalPercent}>{Math.round(game.progress * 100)}% OF TARGET {game.completed ? ' • UNLOCKED! 🎉' : ''}</Text>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>🪙  YOUR COINS</Text>
            <Text style={styles.statValue}>{game.balance}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>⚡  PER TAP</Text>
            <Text style={styles.statValue}>+{game.power}</Text>
          </View>
        </View>

        <TapCoin onTap={game.tap} power={game.power} disabled={game.won} />

        <Pressable
          onPress={game.upgrade}
          disabled={game.balance < game.upgradeCost || game.won}
          style={({ pressed }) => [styles.upgrade, (game.balance < game.upgradeCost || game.won) && styles.upgradeDisabled, pressed && styles.pressed]}
        >
          <Text style={styles.upgradeIcon}>⬆️</Text>
          <View style={styles.upgradeCopy}>
            <Text style={styles.upgradeTitle}>POWER UP YOUR TAP</Text>
            <Text style={styles.upgradeCost}>Upgrade +1  •  🪙 {game.upgradeCost} coins</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        {game.completed && !game.won ? (
          <Pressable onPress={game.nextLevel} style={styles.nextButton}>
            <Text style={styles.nextText}>{game.level === 5 ? '🏆 CLAIM VICTORY' : '🚀 NEXT LEVEL →'}</Text>
          </Pressable>
        ) : game.won ? (
          <View style={styles.victory}><Text style={styles.victoryTitle}>🏆 YOU WON!</Text><Text style={styles.victoryText}>Total earned: {game.lifetime} coins</Text></View>
        ) : (
          <Text style={styles.hint}>Reach the 10-second target to unlock the next level!</Text>
        )}

        {game.won && <Pressable onPress={game.restart} style={styles.restart}><Text style={styles.restartText}>PLAY AGAIN ↻</Text></Pressable>}
        <Text style={styles.footer}>✦ KEEP TAPPING. KEEP GROWING. ✦</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 38, alignItems: 'stretch', maxWidth: 560, width: '100%', alignSelf: 'center' },
  titleRow: { alignItems: 'center', marginBottom: 16 },
  title: { color: colors.text, fontSize: 35, fontWeight: '900', letterSpacing: -1.5, textShadowColor: '#5646a0', textShadowRadius: 20 },
  titleGold: { color: colors.gold },
  subtitle: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 2.2, marginTop: 3 },
  levelPill: { backgroundColor: '#65422f', borderColor: '#b67a45', borderWidth: 2, borderRadius: 13, paddingVertical: 11, alignItems: 'center', marginBottom: 15 },
  levelText: { fontSize: 18, color: '#ffedbe', fontWeight: '900', letterSpacing: 2 },
  goalCard: { backgroundColor: colors.panel, borderRadius: 22, borderWidth: 2, borderColor: colors.border, padding: 19, alignItems: 'center', marginBottom: 12 },
  goalLabel: { color: colors.muted, fontWeight: '800', fontSize: 11, letterSpacing: 1.2, textAlign: 'center' },
  goalValue: { fontSize: 44, color: colors.text, fontWeight: '900', marginVertical: 7 },
  goalOutOf: { color: '#b7aadd', fontSize: 30 },
  track: { width: '100%', height: 17, backgroundColor: '#11102d', borderRadius: 10, overflow: 'hidden', borderColor: '#655894', borderWidth: 1 },
  fill: { height: '100%', borderRadius: 10, backgroundColor: colors.green },
  goalPercent: { color: colors.muted, fontWeight: '800', fontSize: 11, marginTop: 11 },
  statRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, borderRadius: 17, padding: 16, alignItems: 'center', backgroundColor: colors.panelLight, borderWidth: 1.5, borderColor: colors.border },
  statLabel: { color: colors.muted, fontSize: 11, fontWeight: '900', letterSpacing: 0.4 },
  statValue: { color: colors.gold, fontSize: 31, fontWeight: '900', marginTop: 4 },
  upgrade: { backgroundColor: '#513b8c', borderColor: '#a18aff', borderWidth: 2, borderRadius: 18, padding: 15, flexDirection: 'row', alignItems: 'center' },
  upgradeDisabled: { opacity: 0.58 },
  pressed: { transform: [{ scale: 0.98 }] },
  upgradeIcon: { fontSize: 31, marginRight: 12 },
  upgradeCopy: { flex: 1 },
  upgradeTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
  upgradeCost: { color: '#eee0ff', fontSize: 13, marginTop: 5 },
  chevron: { fontSize: 34, color: colors.gold },
  nextButton: { backgroundColor: '#279c67', borderColor: '#71ffc0', borderWidth: 2, borderRadius: 18, marginTop: 13, padding: 16, alignItems: 'center' },
  nextText: { color: colors.text, fontSize: 19, fontWeight: '900' },
  hint: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 18 },
  victory: { alignItems: 'center', padding: 20 },
  victoryTitle: { color: colors.gold, fontSize: 28, fontWeight: '900' },
  victoryText: { color: colors.text, fontSize: 16, marginTop: 8 },
  restart: { alignItems: 'center', padding: 14, borderColor: colors.border, borderWidth: 1, borderRadius: 14 },
  restartText: { color: colors.text, fontWeight: '800' },
  footer: { color: '#776eae', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, textAlign: 'center', marginTop: 26 },
});
