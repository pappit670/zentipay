import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, space, type } from '../constants/theme';
import { useTheme } from '../lib/theme-context';

/**
 * Pay sheet — quick-launch entry to the core pay engine (Inspo 15).
 * Placeholder for now: the numpad + 3 rails (contact / QR / NFC) land here next.
 */
export default function PayModal() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.close, { backgroundColor: colors.s3 }]}
          hitSlop={10}
        >
          <X color={colors.t1} size={20} />
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text style={[type.h1, { color: colors.t1 }]}>Pay</Text>
        <Text style={[type.body, { color: colors.t2, marginTop: 8 }]}>
          Numpad + 3 rails (contact · QR · NFC) — Inspo 15. Coming next.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: space.px, paddingTop: 8, alignItems: 'flex-end' },
  close: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: { flex: 1, paddingHorizontal: space.px, paddingTop: 24 },
});
