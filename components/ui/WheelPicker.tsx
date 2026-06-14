import { useEffect, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import { haptic } from '../../lib/haptics';
import { useTheme } from '../../lib/theme-context';

const ITEM_H = 44;
const VISIBLE = 5;
const PAD = ITEM_H * Math.floor(VISIBLE / 2);

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/**
 * iOS-style scroll wheel — Zenti's signature input (Inspo 14). Haptic tick per
 * row, center row locks bold/green. Used x3 for the date-of-birth picker.
 */
export function WheelPicker({
  items,
  index,
  onChange,
  width,
}: {
  items: string[];
  index: number;
  onChange: (i: number) => void;
  width?: number;
}) {
  const { colors } = useTheme();
  const ref = useRef<ScrollView>(null);
  const last = useRef(index);

  useEffect(() => {
    const t = setTimeout(() => ref.current?.scrollTo({ y: index * ITEM_H, animated: false }), 0);
    return () => clearTimeout(t);
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = clamp(Math.round(e.nativeEvent.contentOffset.y / ITEM_H), 0, items.length - 1);
    if (i !== last.current) {
      last.current = i;
      haptic.select();
    }
  };

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = clamp(Math.round(e.nativeEvent.contentOffset.y / ITEM_H), 0, items.length - 1);
    onChange(i);
  };

  return (
    <View style={[{ height: ITEM_H * VISIBLE, width }]}>
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScroll}
        onMomentumScrollEnd={onEnd}
        contentContainerStyle={{ paddingVertical: PAD }}
      >
        {items.map((it, i) => (
          <View key={i} style={styles.item}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: i === index ? '700' : '400',
                color: i === index ? colors.t1 : colors.t3,
              }}
            >
              {it}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View
        pointerEvents="none"
        style={[
          styles.highlight,
          { top: PAD, borderColor: colors.sep2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { height: ITEM_H, justifyContent: 'center', alignItems: 'center' },
  highlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_H,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});
