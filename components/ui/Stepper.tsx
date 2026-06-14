import { Minus, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { haptic } from '../../lib/haptics';
import { useTheme } from '../../lib/theme-context';

/** Apple-Cash-style ± stepper (Inspo 12) — used for quick tips. */
export function Stepper({
  value,
  onChange,
  step = 50,
  min = 0,
  format,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  format: (v: number) => string;
}) {
  const { colors } = useTheme();
  const bump = (dir: number) => {
    haptic.light();
    onChange(Math.max(min, value + dir * step));
  };
  return (
    <View style={styles.row}>
      <Pressable onPress={() => bump(-1)} style={[styles.btn, { backgroundColor: colors.s3 }]}>
        <Minus color={colors.t1} size={20} />
      </Pressable>
      <Text style={[styles.val, { color: colors.t1 }]}>{format(value)}</Text>
      <Pressable onPress={() => bump(1)} style={[styles.btn, { backgroundColor: colors.s3 }]}>
        <Plus color={colors.t1} size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  btn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  val: { fontSize: 22, fontWeight: '800', minWidth: 120, textAlign: 'center' },
});
