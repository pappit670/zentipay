import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

type Pt = { x: number; y: number };

function Blob({ color, size, from, to, duration }: { color: string; size: number; from: Pt; to: Pt; duration: number }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const st = useAnimatedStyle(() => ({
    transform: [
      { translateX: from.x + (to.x - from.x) * p.value },
      { translateY: from.y + (to.y - from.y) * p.value },
    ],
  }));
  return (
    <Animated.View
      style={[
        { position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: 0.55 },
        st,
      ]}
    />
  );
}

/**
 * Drifting, blurred green/blue blobs over black → a living mesh gradient.
 * The front door of onboarding (Inspo 14). Children render on top.
 */
export function MeshGradient({ children }: { children?: React.ReactNode }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]} />
      <Blob color="#32d74b" size={width * 1.0} from={{ x: -60, y: height * 0.05 }} to={{ x: width * 0.25, y: -20 }} duration={9000} />
      <Blob color="#1f8a3b" size={width * 0.9} from={{ x: width * 0.3, y: height * 0.55 }} to={{ x: width * 0.05, y: height * 0.68 }} duration={11000} />
      <Blob color="#0a84ff" size={width * 0.7} from={{ x: width * 0.45, y: height * 0.35 }} to={{ x: width * 0.2, y: height * 0.45 }} duration={13000} />
      <BlurView intensity={90} tint="dark" experimentalBlurMethod="dimezisBlurView" style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}
