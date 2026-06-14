import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { radius } from '../../constants/theme';
import { haptic } from '../../lib/haptics';
import { useTheme } from '../../lib/theme-context';

type Variant = 'green' | 'fill' | 'ghost';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  onPress,
  variant = 'green',
  disabled,
  icon,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));

  const bg = variant === 'green' ? colors.green : variant === 'fill' ? colors.t1 : colors.s3;
  const fg = variant === 'green' ? '#000' : variant === 'fill' ? colors.bg : colors.t1;

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={() => {
        s.value = withTiming(0.97, { duration: 90 });
      }}
      onPressOut={() => {
        s.value = withTiming(1, { duration: 120 });
      }}
      onPress={() => {
        haptic.light();
        onPress?.();
      }}
      style={[styles.btn, { backgroundColor: bg, opacity: disabled ? 0.4 : 1 }, anim, style]}
    >
      <View style={styles.inner}>
        {icon}
        <Text style={[styles.label, { color: fg }]}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: radius.btn,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 16, fontWeight: '700' },
});
