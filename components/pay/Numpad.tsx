import { Delete } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { haptic } from '../../lib/haptics';
import { useTheme } from '../../lib/theme-context';

export type NumKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.' | 'del' | '+' | '−' | '×' | '÷';

const ROWS: NumKey[][] = [
  ['1', '2', '3', '÷'],
  ['4', '5', '6', '×'],
  ['7', '8', '9', '−'],
  ['.', '0', 'del', '+'],
];

const OPS = new Set(['+', '−', '×', '÷']);

/**
 * The numpad with arithmetic ops (v34 signature). Presentational — the pay
 * screen owns the expression/eval logic. Ops are de-emphasized per friction FIX 2.
 */
export function Numpad({ onPress, activeOp }: { onPress: (k: NumKey) => void; activeOp?: string | null }) {
  const { colors } = useTheme();
  return (
    <View style={styles.grid}>
      {ROWS.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((k) => {
            const isOp = OPS.has(k);
            const active = activeOp === k;
            return (
              <Pressable
                key={k}
                onPress={() => {
                  haptic.light();
                  onPress(k);
                }}
                style={({ pressed }) => [
                  styles.key,
                  isOp && { backgroundColor: active ? colors.green : colors.s2 },
                  pressed && { opacity: 0.6 },
                ]}
              >
                {k === 'del' ? (
                  <Delete color={colors.t1} size={24} />
                ) : (
                  <Text
                    style={[
                      styles.keyTxt,
                      { color: isOp ? (active ? '#000' : colors.t2) : colors.t1, fontSize: isOp ? 26 : 30 },
                    ]}
                  >
                    {k}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 6 },
  row: { flexDirection: 'row', gap: 6 },
  key: { flex: 1, height: 58, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  keyTxt: { fontWeight: '500' },
});
