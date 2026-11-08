import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, View } from 'react-native';

/**
 * LEVEL IMAGES (levels 1-5)
 *
 * 1. Put your own images in the assets/ folder.
 * 2. Change the require(...) path on the matching level below.
 * 3. Use PNG, JPG or WebP. Transparent PNG is recommended.
 *
 * Each path must be written literally for Expo / Metro to bundle the image.
 * The original tap-coin.png is used for every level until you replace it.
 * If you add extra levels in config.ts, add images to this array too.
 */
const LEVEL_IMAGES = [
  require('../../assets/tap-coin.png'), // Level 1
  require('../../assets/tap-coin.png'), // Level 2
  require('../../assets/tap-coin.png'), // Level 3
  require('../../assets/tap-coin.png'), // Level 4
  require('../../assets/tap-coin.png'), // Level 5
];

type ClickCoinProps = {
  size: number;
  level: number; // 1-based level number, e.g. 1 for Level 1
  onPress: () => void;
  disabled?: boolean;
};

export function ClickCoin({ size, level, onPress, disabled = false }: ClickCoinProps) {
  const image = LEVEL_IMAGES[level - 1] ?? LEVEL_IMAGES[LEVEL_IMAGES.length - 1];
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
          source={image}
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
