import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { space, type } from '../constants/theme';
import { useTheme } from '../lib/theme-context';

/**
 * Themed screen scaffold for the skeleton phase. Real screens (home, wallet,
 * savings, etc.) replace these placeholders as we build out each inspo.
 */
export function Screen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={styles.body}>
        <Text style={[type.h1, { color: colors.t1 }]}>{title}</Text>
        {subtitle ? (
          <Text style={[type.body, { color: colors.t2, marginTop: 8 }]}>{subtitle}</Text>
        ) : null}
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, paddingHorizontal: space.px, paddingTop: 24 },
});
