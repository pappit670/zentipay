import { ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { radius } from '../../constants/theme';
import { haptic } from '../../lib/haptics';
import { useTheme } from '../../lib/theme-context';

const THUMB = 52;

/** Swipe-to-confirm — v34's anti-accident pay gesture (kept per friction review). */
export function SwipeToConfirm({
  label,
  onConfirm,
  disabled,
}: {
  label: string;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  const [w, setW] = useState(0);
  const x = useSharedValue(0);
  const max = Math.max(0, w - THUMB - 8);

  const fire = () => {
    haptic.success();
    onConfirm();
  };

  const pan = Gesture.Pan()
    .enabled(!disabled && w > 0)
    .onUpdate((e) => {
      x.value = Math.max(0, Math.min(e.translationX, max));
    })
    .onEnd(() => {
      if (x.value >= max - 8) {
        x.value = withTiming(max);
        runOnJS(fire)();
      } else {
        x.value = withTiming(0);
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const fillStyle = useAnimatedStyle(() => ({ width: x.value + THUMB }));
  const labelStyle = useAnimatedStyle(() => ({ opacity: max ? Math.max(0, 1 - (x.value / max) * 2) : 1 }));

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
      style={[styles.track, { backgroundColor: colors.s3, opacity: disabled ? 0.4 : 1 }]}
    >
      <Animated.View style={[styles.fill, { backgroundColor: colors.green }, fillStyle]} />
      <Animated.Text style={[styles.label, { color: colors.t1 }, labelStyle]}>{label}</Animated.Text>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.thumb, { backgroundColor: colors.green }, thumbStyle]}>
          <ChevronRight color="#000" size={24} strokeWidth={2.5} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 60, borderRadius: radius.pill, justifyContent: 'center', overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: radius.pill },
  label: { textAlign: 'center', fontSize: 15, fontWeight: '700' },
  thumb: {
    position: 'absolute',
    left: 4,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    top: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
