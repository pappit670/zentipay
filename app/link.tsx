import { router } from 'expo-router';
import { Copy, Eye, Share2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Numpad, type NumKey } from '../components/pay/Numpad';
import { Button } from '../components/ui/Button';
import { radius, space } from '../constants/theme';
import { kes } from '../lib/format';
import { useIsland } from '../lib/island-context';
import { draft } from '../lib/onboarding-store';
import { useTheme } from '../lib/theme-context';

type LinkType = 'request' | 'send';

export default function MoneyLink() {
  const { colors } = useTheme();
  const island = useIsland();
  const [type, setType] = useState<LinkType>('request');
  const [expr, setExpr] = useState('');
  const [note, setNote] = useState('');
  const [created, setCreated] = useState(false);
  const amount = parseInt(expr || '0', 10);
  const me = draft.ztag ?? 'you';

  const onKey = (k: NumKey) => {
    if (k === 'del') return setExpr((e) => e.slice(0, -1));
    if (k === '.' || ['+', '−', '×', '÷'].includes(k)) return;
    if (expr.length >= 9) return;
    setExpr((e) => e + k);
  };

  const share = () => {
    island.set('success', { text: 'Link copied' });
    setTimeout(() => island.set('idle'), 1500);
  };

  const preview = () =>
    router.push({ pathname: '/claim', params: { type, amount: String(amount), note, from: draft.name ?? 'You' } });

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.close, { backgroundColor: colors.s3 }]} hitSlop={10}>
          <X color={colors.t1} size={20} />
        </Pressable>
        <Text style={[styles.title, { color: colors.t1 }]}>Money link</Text>
        <View style={{ width: 36 }} />
      </View>

      {!created ? (
        <View style={styles.compose}>
          <View style={[styles.toggle, { backgroundColor: colors.s2 }]}>
            {(['request', 'send'] as LinkType[]).map((t) => (
              <Pressable key={t} onPress={() => setType(t)} style={[styles.tog, type === t && { backgroundColor: colors.t1 }]}>
                <Text style={[styles.togTxt, { color: type === t ? colors.bg : colors.t2 }]}>
                  {t === 'request' ? 'Request' : 'Send'}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.amountWrap}>
            <Text style={[styles.amount, { color: amount ? colors.t1 : colors.t3 }]}>{kes(amount)}</Text>
          </View>

          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add a note"
            placeholderTextColor={colors.t3}
            maxLength={40}
            style={[styles.note, { backgroundColor: colors.s2, color: colors.t1 }]}
          />

          <Numpad onPress={onKey} />
          <Button label="Create link" variant="green" disabled={amount <= 0} onPress={() => setCreated(true)} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.previewWrap}>
          <Text style={[styles.previewHint, { color: colors.t2 }]}>This is what they'll see</Text>

          {/* preview card */}
          <View style={[styles.card, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
            <View style={[styles.cardAv, { backgroundColor: colors.green }]}>
              <Text style={styles.cardAvTxt}>{(draft.name?.[0] ?? 'Z').toUpperCase()}</Text>
            </View>
            <Text style={[styles.cardFrom, { color: colors.t2 }]}>
              {type === 'request' ? `$${me} requests` : `$${me} sent you`}
            </Text>
            <Text style={[styles.cardAmt, { color: colors.t1 }]}>{kes(amount)}</Text>
            {!!note && <Text style={[styles.cardNote, { color: colors.t2 }]}>"{note}"</Text>}
          </View>

          <View style={styles.actions}>
            <Button label="Copy link" variant="ghost" icon={<Copy color={colors.t1} size={18} />} style={{ flex: 1 }} onPress={share} />
            <Button label="Share" variant="green" icon={<Share2 color="#000" size={18} />} style={{ flex: 1 }} onPress={share} />
          </View>
          <Button label="Preview claim page" variant="ghost" icon={<Eye color={colors.t1} size={18} />} onPress={preview} style={{ marginTop: 12 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.px, paddingTop: 6 },
  close: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700' },
  compose: { flex: 1, paddingHorizontal: space.px, paddingBottom: 20, gap: 14 },
  toggle: { flexDirection: 'row', borderRadius: radius.pill, padding: 3, marginTop: 12, alignSelf: 'center' },
  tog: { paddingHorizontal: 22, paddingVertical: 8, borderRadius: radius.pill },
  togTxt: { fontSize: 14, fontWeight: '700' },
  amountWrap: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  amount: { fontSize: 46, fontWeight: '800', letterSpacing: -1 },
  note: { height: 48, borderRadius: 12, paddingHorizontal: 14, fontSize: 15, textAlign: 'center' },
  previewWrap: { paddingHorizontal: space.px, paddingTop: 16, paddingBottom: 24 },
  previewHint: { fontSize: 13, textAlign: 'center', marginBottom: 16 },
  card: { borderRadius: radius.card, borderWidth: 1, padding: 28, alignItems: 'center' },
  cardAv: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  cardAvTxt: { fontSize: 22, fontWeight: '800', color: '#000' },
  cardFrom: { fontSize: 14, marginTop: 14 },
  cardAmt: { fontSize: 40, fontWeight: '800', letterSpacing: -1, marginTop: 6 },
  cardNote: { fontSize: 15, marginTop: 10, fontStyle: 'italic' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
});
