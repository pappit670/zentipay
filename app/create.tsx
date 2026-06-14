import { router, useLocalSearchParams } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Numpad, type NumKey } from '../components/pay/Numpad';
import { Button } from '../components/ui/Button';
import { radius, space } from '../constants/theme';
import { kes } from '../lib/format';
import { useIsland } from '../lib/island-context';
import { useStore, type Contact } from '../lib/store';
import { useTheme } from '../lib/theme-context';

type Mode = 'goal' | 'pool' | 'split';
const EMOJIS = ['🎯', '🏖️', '📱', '🚗', '🏠', '💍', '🎓', '✈️', '🎁', '💰'];

const COPY: Record<Mode, { title: string; amountLabel: string; cta: string }> = {
  goal: { title: 'New goal', amountLabel: 'Savings target', cta: 'Create goal' },
  pool: { title: 'New pool', amountLabel: 'Pool goal', cta: 'Start pool' },
  split: { title: 'Split a bill', amountLabel: 'Bill total', cta: 'Send requests' },
};

export default function Create() {
  const { colors } = useTheme();
  const store = useStore();
  const island = useIsland();
  const { mode = 'goal' } = useLocalSearchParams<{ mode: Mode }>();
  const copy = COPY[mode];

  const [step, setStep] = useState<'amount' | 'details'>('amount');
  const [expr, setExpr] = useState('');
  const amount = parseInt(expr || '0', 10);

  // details
  const [emoji, setEmoji] = useState(0);
  const [name, setName] = useState('');
  const [picked, setPicked] = useState<Contact[]>([]);
  const [includeMe, setIncludeMe] = useState(true);

  const onKey = (k: NumKey) => {
    if (k === 'del') return setExpr((e) => e.slice(0, -1));
    if (k === '.' || ['+', '−', '×', '÷'].includes(k)) return;
    if (expr.length >= 9) return;
    setExpr((e) => e + k);
  };

  const togglePick = (c: Contact) =>
    setPicked((p) => (p.find((x) => x.ztag === c.ztag) ? p.filter((x) => x.ztag !== c.ztag) : [...p, c]));

  const heads = picked.length + (includeMe ? 1 : 0);
  const share = heads ? Math.round(amount / heads) : amount;

  const finish = () => {
    if (mode === 'goal') {
      store.addGoal({ name: name.trim() || 'New goal', emoji: EMOJIS[emoji], target: amount });
      island.set('success', { text: 'Goal created' });
      setTimeout(() => island.set('idle'), 1500);
      router.back();
    } else if (mode === 'pool') {
      store.addPool({ name: name.trim() || 'New pool', emoji: EMOJIS[emoji], target: amount });
      island.set('success', { text: 'Pool created' });
      setTimeout(() => island.set('idle'), 1500);
      router.back();
    } else {
      store.splitRequest({ amount, contacts: picked, includeMe });
      island.process(`Requesting ${kes(share)} each…`, 'Requests sent');
      router.replace({ pathname: '/success', params: { type: 'requested', amount: String(share), name: `${picked.length} people` } });
    }
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.close, { backgroundColor: colors.s3 }]} hitSlop={10}>
          <X color={colors.t1} size={20} />
        </Pressable>
        <Text style={[styles.title, { color: colors.t1 }]}>{copy.title}</Text>
        <View style={{ width: 36 }} />
      </View>

      {step === 'amount' ? (
        <View style={styles.amountStep}>
          <View style={styles.amountWrap}>
            <Text style={[styles.amountLabel, { color: colors.t2 }]}>{copy.amountLabel}</Text>
            <Text style={[styles.amount, { color: amount ? colors.t1 : colors.t3 }]}>{kes(amount)}</Text>
          </View>
          <Numpad onPress={onKey} />
          <Button label="Next" variant="green" disabled={amount <= 0} onPress={() => setStep('details')} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.details}>
          {mode !== 'split' ? (
            <>
              <Pressable style={[styles.emojiBtn, { backgroundColor: colors.s2 }]} onPress={() => setEmoji((e) => (e + 1) % EMOJIS.length)}>
                <Text style={styles.emoji}>{EMOJIS[emoji]}</Text>
              </Pressable>
              <Text style={[styles.tapHint, { color: colors.t3 }]}>Tap to change</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={mode === 'goal' ? 'Goal name' : 'Pool name'}
                placeholderTextColor={colors.t3}
                style={[styles.input, { backgroundColor: colors.s2, color: colors.t1 }]}
              />
              <View style={[styles.preview, { backgroundColor: colors.s1, borderColor: colors.sep }]}>
                <Text style={[styles.previewLabel, { color: colors.t2 }]}>Target</Text>
                <Text style={[styles.previewVal, { color: colors.t1 }]}>{kes(amount)}</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.splitHead, { color: colors.t1 }]}>Split {kes(amount)} with</Text>
              <Pressable style={styles.includeRow} onPress={() => setIncludeMe((v) => !v)}>
                <View style={[styles.checkbox, { borderColor: colors.sep, backgroundColor: includeMe ? colors.green : 'transparent' }]}>
                  {includeMe && <Check color="#000" size={14} strokeWidth={3} />}
                </View>
                <Text style={[styles.includeTxt, { color: colors.t1 }]}>Include myself</Text>
              </Pressable>
              <View style={styles.contactsList}>
                {store.contacts.map((c) => {
                  const sel = !!picked.find((x) => x.ztag === c.ztag);
                  return (
                    <Pressable key={c.ztag} style={styles.cRow} onPress={() => togglePick(c)}>
                      <View style={[styles.cAv, { backgroundColor: c.bg }]}>
                        <Text style={[styles.cAvTxt, { color: c.color }]}>{c.initials}</Text>
                      </View>
                      <Text style={[styles.cName, { color: colors.t1 }]}>{c.name}</Text>
                      <View style={[styles.checkbox, { borderColor: colors.sep, backgroundColor: sel ? colors.green : 'transparent' }]}>
                        {sel && <Check color="#000" size={14} strokeWidth={3} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              {heads > 0 && (
                <View style={[styles.preview, { backgroundColor: colors.gdim, borderColor: 'transparent' }]}>
                  <Text style={[styles.previewLabel, { color: colors.t2 }]}>Each pays</Text>
                  <Text style={[styles.previewVal, { color: colors.green }]}>{kes(share)}</Text>
                </View>
              )}
            </>
          )}

          <Button
            label={copy.cta}
            variant="green"
            disabled={mode === 'split' && picked.length === 0}
            onPress={finish}
            style={{ marginTop: 20 }}
          />
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
  amountStep: { flex: 1, paddingHorizontal: space.px, paddingBottom: 20, gap: 16, justifyContent: 'flex-end' },
  amountWrap: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  amountLabel: { fontSize: 14 },
  amount: { fontSize: 46, fontWeight: '800', letterSpacing: -1, marginTop: 8 },
  details: { paddingHorizontal: space.px, paddingTop: 16, paddingBottom: 24, alignItems: 'stretch' },
  emojiBtn: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
  emoji: { fontSize: 44 },
  tapHint: { fontSize: 12, textAlign: 'center', marginTop: 8, marginBottom: 16 },
  input: { height: 56, borderRadius: 14, paddingHorizontal: 16, fontSize: 17 },
  preview: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: radius.card, borderWidth: 1, padding: 18, marginTop: 16 },
  previewLabel: { fontSize: 14 },
  previewVal: { fontSize: 20, fontWeight: '700' },
  splitHead: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  includeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  includeTxt: { fontSize: 15, fontWeight: '600' },
  contactsList: { marginTop: 8 },
  cRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  cAv: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  cAvTxt: { fontSize: 12, fontWeight: '800' },
  cName: { flex: 1, fontSize: 15, fontWeight: '600' },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center' },
});
