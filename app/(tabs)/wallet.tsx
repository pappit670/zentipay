import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WalletDeck } from '../../components/wallet/WalletDeck';
import { radius, space, type } from '../../constants/theme';
import { useStore } from '../../lib/store';
import { useTheme } from '../../lib/theme-context';

export default function Wallet() {
  const { colors } = useTheme();
  const store = useStore();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.head}>
          <Text style={[type.h1, { color: colors.t1 }]}>Wallet</Text>
          <Pressable onPress={() => router.push('/add-card')} style={[styles.add, { backgroundColor: colors.s2 }]}>
            <Plus color={colors.t1} size={22} />
          </Pressable>
        </View>

        <Text style={[styles.hint, { color: colors.t2 }]}>Drag to fan the deck · tap a card to open</Text>

        <View style={styles.deckWrap}>
          <WalletDeck cards={store.cards} onSelect={(c) => router.push({ pathname: '/card/[id]', params: { id: c.id } })} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.px, paddingTop: 12 },
  add: { width: 40, height: 40, borderRadius: radius.full, justifyContent: 'center', alignItems: 'center' },
  hint: { fontSize: 13, paddingHorizontal: space.px, marginTop: 6, marginBottom: 18 },
  deckWrap: { paddingHorizontal: space.px },
});
