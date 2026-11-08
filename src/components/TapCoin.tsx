import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = { power: number; onTap: () => void; disabled?: boolean };

export function TapCoin({ power, onTap, disabled }: Props) {
  const hover = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(1)).current;
  const [popups, setPopups] = useState<{ id: number; value: number }[]>([]);
  const popupId = useRef(0);

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(hover, { toValue: 1, duration: 1100, useNativeDriver: true }),
      Animated.timing(hover, { toValue: 0, duration: 1100, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [hover]);

  const press = () => {
    if (disabled) return;
    onTap();
    bounce.stopAnimation();
    bounce.setValue(0.84);
    Animated.spring(bounce, { toValue: 1, friction: 3, tension: 180, useNativeDriver: true }).start();
    const id = ++popupId.current;
    setPopups((current) => [...current.slice(-3), { id, value: power }]);
    setTimeout(() => setPopups((current) => current.filter((p) => p.id !== id)), 500);
  };

  const floatY = hover.interpolate({ inputRange: [0, 1], outputRange: [5, -10] });
  const tilt = hover.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '4deg'] });

  return (
    <View style={styles.area}>
      <Text style={styles.hint}>TAP THE MAGIC COIN</Text>
      <View style={styles.glow} />
      <Pressable onPress={press} disabled={disabled} accessibilityRole="button" accessibilityLabel="Kerää pisteitä" style={styles.hitArea}>
        <Animated.View style={{ transform: [{ translateY: floatY }, { rotate: tilt }, { scale: bounce }] }}>
          <Image source={require('../../assets/tap-coin.png')} style={styles.coin} resizeMode="contain" />
        </Animated.View>
      </Pressable>
      {popups.map((popup, i) => (
        <Text key={popup.id} pointerEvents="none" style={[styles.popup, { left: `${39 + i * 7}%` }]}>+{popup.value} ✦</Text>
      ))}
      <Text style={styles.sparkleLeft}>✦</Text>
      <Text style={styles.sparkleRight}>✧</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  area: { height: 275, width: '100%', justifyContent: 'center', alignItems: 'center' },
  hint: { color: colors.muted, fontSize: 11, letterSpacing: 3, fontWeight: '900', marginTop: 7 },
  glow: { position: 'absolute', width: 190, height: 190, borderRadius: 95, backgroundColor: '#fbab4a', opacity: 0.14, top: 62 },
  hitArea: { width: 245, height: 222, justifyContent: 'center', alignItems: 'center' },
  coin: { width: 225, height: 210 },
  popup: { position: 'absolute', top: 16, color: colors.gold, fontSize: 29, fontWeight: '900', textShadowColor: '#aa460d', textShadowRadius: 12 },
  sparkleLeft: { position: 'absolute', left: '12%', top: 98, fontSize: 36, color: colors.gold },
  sparkleRight: { position: 'absolute', right: '10%', bottom: 66, fontSize: 40, color: colors.gold },
});
