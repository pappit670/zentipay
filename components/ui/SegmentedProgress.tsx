import { StyleSheet, View } from 'react-native';
import { space } from '../../constants/theme';
import { useTheme } from '../../lib/theme-context';

/** Story-style top progress bars for onboarding (Inspo 14). */
export function SegmentedProgress({ total, index }: { total: number; index: number }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { backgroundColor: i <= index ? colors.green : colors.s3 },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, paddingHorizontal: space.px },
  bar: { flex: 1, height: 4, borderRadius: 2 },
});
