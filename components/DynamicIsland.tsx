import { Check } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP } from '../constants/theme';
import { kes } from '../lib/format';
import { useIsland } from '../lib/island-context';

const WIDTHS: Record<string, number> = {
  idle: 122,
  'pay-active': 260,
  processing: 210,
  success: 168,
};

/** The floating Dynamic Island — mounted once at root, reacts to island state. */
export function DynamicIsland() {
  const { state, data } = useIsland();
  const insets = useSafeAreaInsets();
  const w = useSharedValue(WIDTHS.idle);

  useEffect(() => {
    w.value = withTiming(WIDTHS[state] ?? WIDTHS.idle, { duration: 360 });
  }, [state]);

  const anim = useAnimatedStyle(() => ({ width: w.value }));

  const top = Math.max(insets.top - 2, 8);

  return (
    <View pointerEvents="none" style={[styles.wrap, { top }]}>
      <Animated.View style={[styles.pill, anim]}>
        {state === 'idle' && <View style={styles.idle} />}

        {state === 'pay-active' && (
          <View style={styles.row}>
            <View style={[styles.av, { backgroundColor: data.bg ?? APP.brandGreen }]}>
              <Text style={[styles.avTxt, { color: data.color ?? '#000' }]}>{data.initials ?? ''}</Text>
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {data.name?.split(' ')[0] ?? ''}
            </Text>
            <Text style={styles.amt}>{kes(data.amount ?? 0)}</Text>
          </View>
        )}

        {state === 'processing' && (
          <View style={styles.row}>
            <View style={styles.dots}>
              <Dot d={0} />
              <Dot d={150} />
              <Dot d={300} />
            </View>
            <Text style={styles.proc} numberOfLines={1}>
              {data.text ?? 'Working…'}
            </Text>
          </View>
        )}

        {state === 'success' && (
          <View style={styles.row}>
            <View style={styles.successDot}>
              <Check color="#000" size={11} strokeWidth={3} />
            </View>
            <Text style={styles.proc} numberOfLines={1}>
              {data.text ?? 'Done'}
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

function Dot({ d }: { d: number }) {
  const s = useSharedValue(0.5);
  useEffect(() => {
    const loop = () => {
      s.value = withTiming(1, { duration: 400 }, () => {
        s.value = withTiming(0.5, { duration: 400 });
      });
    };
    const t = setTimeout(loop, d);
    const iv = setInterval(loop, 900);
    return () => {
      clearTimeout(t);
      clearInterval(iv);
    };
  }, []);
  const a = useAnimatedStyle(() => ({ opacity: s.value, transform: [{ scale: s.value }] }));
  return <Animated.View style={[styles.dot, a]} />;
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 999 },
  pill: {
    height: 36,
    backgroundColor: '#000',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  idle: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
  av: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  avTxt: { fontSize: 8, fontWeight: '800' },
  name: { color: '#fff', fontSize: 13, fontWeight: '600', flex: 1 },
  amt: { color: '#32d74b', fontSize: 13, fontWeight: '700' },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)' },
  proc: { color: '#fff', fontSize: 13, fontWeight: '600', flex: 1 },
  successDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#32d74b', justifyContent: 'center', alignItems: 'center' },
});
