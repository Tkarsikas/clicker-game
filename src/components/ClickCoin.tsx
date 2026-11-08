import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, View } from 'react-native';

/**
 * CHANGE THE COIN IMAGE HERE:
 * 1. Add your PNG/JPG/WebP to the assets/ folder.
 * 2. Replace only the path inside require(...) below.
 *    Example: require('../../assets/my-new-coin.png')
 *
 * Metro requires a literal path; do not use a variable or template string.
 */
const COIN_IMAGE = require('../../assets/Testi.jpeg');

type ClickCoinProps = {
  size: number;
  onPress: () => void;
  disabled?: boolean;
};

export function ClickCoin({ size, onPress, disabled = false }: ClickCoinProps) {
  const bounce = useRef(new Animated.Value(1)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [float]);

  const handlePress = () => {
    if (disabled) return;
    onPress();
    bounce.stopAnimation();
    bounce.setValue(0.87);
    Animated.spring(bounce, {
      toValue: 1,
      friction: 4,
      tension: 240,
      useNativeDriver: true,
    }).start();
  };

  const floatingY = float.interpolate({ inputRange: [0, 1], outputRange: [8, -12] });
  const tilt = float.interpolate({ inputRange: [0, 1], outputRange: ['-6deg', '6deg'] });

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Tap the magic coin"
      style={[styles.touchArea, { width: size, height: size }]}
    >
      <Animated.View
        style={[styles.coinContainer, {
          transform: [{ translateY: floatingY }, { rotate: tilt }, { scale: bounce }],
        }]}
      >
        <Image
          source={COIN_IMAGE}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touchArea: { alignItems: 'center', justifyContent: 'center' },
  coinContainer: { width: '100%', height: '100%' },
  image: { width: '100%', height: '100%' },
});
