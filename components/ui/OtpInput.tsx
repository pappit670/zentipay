import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { radius } from '../../constants/theme';
import { haptic } from '../../lib/haptics';
import { useTheme } from '../../lib/theme-context';

/** Boxed OTP entry that auto-submits when full (Inspo 14 — no Next tap needed). */
export function OtpInput({
  length = 6,
  onComplete,
}: {
  length?: number;
  onComplete: (code: string) => void;
}) {
  const { colors } = useTheme();
  const [val, setVal] = useState('');
  const ref = useRef<TextInput>(null);

  useEffect(() => {
    const t = setTimeout(() => ref.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (val.length === length) {
      haptic.success();
      onComplete(val);
    }
  }, [val, length]);

  return (
    <Pressable style={styles.row} onPress={() => ref.current?.focus()}>
      {Array.from({ length }).map((_, i) => {
        const active = i === val.length;
        return (
          <View
            key={i}
            style={[
              styles.box,
              {
                backgroundColor: colors.s2,
                borderColor: active ? colors.green : colors.sep,
                borderWidth: active ? 2 : 1,
              },
            ]}
          >
            <Text style={[styles.digit, { color: colors.t1 }]}>{val[i] ?? ''}</Text>
          </View>
        );
      })}
      <TextInput
        ref={ref}
        value={val}
        onChangeText={(t) => setVal(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hidden}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  box: { flex: 1, height: 60, borderRadius: radius.btn, justifyContent: 'center', alignItems: 'center' },
  digit: { fontSize: 24, fontWeight: '700' },
  hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
});
