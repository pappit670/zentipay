import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { space } from '../../constants/theme';
import { useTheme } from '../../lib/theme-context';
import { SegmentedProgress } from './SegmentedProgress';

/** Onboarding step header: back chevron + story progress bars. */
export function StepHeader({ total, index }: { total: number; index: number }) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
        <ChevronLeft color={colors.t1} size={26} />
      </Pressable>
      <SegmentedProgress total={total} index={index} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16, paddingTop: 4 },
  back: { paddingHorizontal: space.px - 6, alignSelf: 'flex-start' },
});
