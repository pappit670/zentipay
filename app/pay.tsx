import { router } from 'expo-router';
import { Nfc, QrCode, Users, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Numpad, type NumKey } from '../components/pay/Numpad';
import { Button } from '../components/ui/Button';
import { Stepper } from '../components/ui/Stepper';
import { SwipeToConfirm } from '../components/ui/SwipeToConfirm';
import { radius, space } from '../constants/theme';
import { kes } from '../lib/format';
import { useIsland } from '../lib/island-context';
import { useStore, type Contact } from '../lib/store';
import { useTheme } from '../lib/theme-context';

type Mode = 'pay' | 'request';
type Method = 'contact' | 'qr' | 'nfc';
const OPS = new Set(['+', '−', '×', '÷']);

function evalExpr(expr: string, op: string | null): number {
  if (!op) return parseInt(expr, 10) || 0;
  const [a, b] = expr.split(op);
  const x = parseInt(a, 10) || 0;
  const y = parseInt(b, 10) || 0;
  if (op === '+') return x + y;
  if (op === '−') return Math.max(0, x - y);
  if (op === '×') return x * y;
  if (op === '÷') return y ? Math.round(x / y) : x;
  return x;
}

export default function PayModal() {
  const { colors } = useTheme();
  const store = useStore();
  const island = useIsland();

  const [expr, setExpr] = useState('');
  const [op, setOp] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('pay');
  const [method, setMethod] = useState<Method>('contact');
  const [rec, setRec] = useState<Contact | null>(null);
  const [note, setNote] = useState('');
  const [tip, setTip] = useState(0);

  const amount = evalExpr(expr, op);
  const total = mode === 'pay' ? amount + tip : amount;
  const showExpr = op && expr.includes(op) && expr.split(op)[1];

  const onKey = (k: NumKey) => {
    if (k === 'del') {
      if (op && expr.endsWith(op)) {
        setExpr((e) => e.slice(0, -1));
        setOp(null);
      } else {
        setExpr((e) => e.slice(0, -1));
      }
      return;
    }
    if (k === '.') return; // KES uses whole numbers
    if (OPS.has(k)) {
      const v = evalExpr(expr, op);
      if (!v) return;
      setExpr(String(v) + k);
      setOp(k);
      return;
    }
    // digit
    const seg = op ? expr.split(op)[1] ?? '' : expr;
    if (seg.length >= 7) return;
    setExpr((e) => e + k);
  };

  const canConfirm = amount > 0 && method === 'contact' && !!rec;

  const confirm = () => {
    if (!rec) return;
    if (mode === 'pay') store.send({ amount: total, contact: rec, note });
    else store.request({ amount: total, contact: rec, note });
    island.process(
      mode === 'pay' ? `Sending ${kes(total)}…` : `Requesting ${kes(total)}…`,
      mode === 'pay' ? 'Sent' : 'Request sent',
    );
    router.replace({
      pathname: '/success',
      params: { type: mode === 'pay' ? 'sent' : 'requested', amount: String(total), name: rec.name },
    });
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.close, { backgroundColor: colors.s3 }]} hitSlop={10}>
          <X color={colors.t1} size={20} />
        </Pressable>
        <View style={[styles.modeToggle, { backgroundColor: colors.s2 }]}>
          {(['pay', 'request'] as Mode[]).map((m) => (
            <Pressable key={m} onPress={() => setMode(m)} style={[styles.modeBtn, mode === m && { backgroundColor: colors.t1 }]}>
              <Text style={[styles.modeTxt, { color: mode === m ? colors.bg : colors.t2 }]}>
                {m === 'pay' ? 'Pay' : 'Request'}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {/* amount */}
        <View style={styles.amountWrap}>
          {showExpr ? (
            <>
              <Text style={[styles.expr, { color: colors.t2 }]}>{expr.replace(op!, ` ${op} `)}</Text>
              <Text style={[styles.amount, { color: colors.t1 }]}>{kes(amount)}</Text>
            </>
          ) : (
            <Text style={[styles.amount, { color: amount ? colors.t1 : colors.t3 }]}>{kes(amount)}</Text>
          )}
          {mode === 'pay' && tip > 0 && (
            <Text style={[styles.tipHint, { color: colors.t2 }]}>incl. {kes(tip)} tip · total {kes(total)}</Text>
          )}
        </View>

        {/* method rails */}
        <View style={styles.rails}>
          {([
            { k: 'contact', Icon: Users, label: 'Contact' },
            { k: 'qr', Icon: QrCode, label: 'QR' },
            { k: 'nfc', Icon: Nfc, label: 'Tap' },
          ] as const).map(({ k, Icon, label }) => (
            <Pressable
              key={k}
              onPress={() => setMethod(k)}
              style={[styles.rail, { backgroundColor: method === k ? colors.gdim : colors.s2, borderColor: method === k ? colors.green : 'transparent' }]}
            >
              <Icon color={method === k ? colors.green : colors.t2} size={18} />
              <Text style={[styles.railTxt, { color: method === k ? colors.green : colors.t2 }]}>{label}</Text>
            </Pressable>
          ))}
        </View>

        {method === 'contact' ? (
          <>
            {/* quick contacts */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contacts}>
              {store.contacts.map((c) => {
                const sel = rec?.ztag === c.ztag;
                return (
                  <Pressable key={c.ztag} onPress={() => setRec(sel ? null : c)} style={styles.contact}>
                    <View style={[styles.cav, { backgroundColor: c.bg, borderWidth: sel ? 2 : 0, borderColor: colors.green }]}>
                      <Text style={[styles.cavTxt, { color: c.color }]}>{c.initials}</Text>
                    </View>
                    <Text style={[styles.cName, { color: sel ? colors.t1 : colors.t2 }]} numberOfLines={1}>
                      {c.name.split(' ')[0]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* note */}
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="What's it for?"
              placeholderTextColor={colors.t3}
              maxLength={30}
              style={[styles.note, { backgroundColor: colors.s2, color: colors.t1 }]}
            />

            {/* quick tip (Inspo 12) */}
            {mode === 'pay' && rec && (
              <View style={[styles.tipRow, { backgroundColor: colors.s2 }]}>
                <Text style={[styles.tipLabel, { color: colors.t2 }]}>Add a tip</Text>
                <Stepper value={tip} onChange={setTip} step={50} format={(v) => kes(v)} />
              </View>
            )}
          </>
        ) : method === 'qr' ? (
          <View style={{ gap: 10 }}>
            <Button
              label="Show my QR to get paid"
              variant="green"
              onPress={() => router.push({ pathname: '/qr', params: { mode: 'mycode', amount: String(amount) } })}
            />
            <Button label="Scan a code to pay" variant="ghost" onPress={() => router.push({ pathname: '/qr', params: { mode: 'scan' } })} />
          </View>
        ) : (
          <View style={[styles.soon, { backgroundColor: colors.s2 }]}>
            <Text style={[styles.soonTxt, { color: colors.t2 }]}>NFC tap-to-pay — Android-first, coming soon.</Text>
          </View>
        )}

        <Numpad onPress={onKey} activeOp={op} />

        <SwipeToConfirm
          label={mode === 'pay' ? 'Swipe to pay' : 'Swipe to request'}
          disabled={!canConfirm}
          onConfirm={confirm}
        />

        <Pressable onPress={() => router.push('/link')} style={styles.linkBtn}>
          <Text style={[styles.linkTxt, { color: colors.green }]}>or share a money link</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.px, paddingTop: 6 },
  close: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  modeToggle: { flexDirection: 'row', borderRadius: radius.pill, padding: 3 },
  modeBtn: { paddingHorizontal: 18, paddingVertical: 7, borderRadius: radius.pill },
  modeTxt: { fontSize: 14, fontWeight: '700' },
  body: { paddingHorizontal: space.px, paddingBottom: 24, gap: 14 },
  amountWrap: { alignItems: 'center', paddingVertical: 12 },
  expr: { fontSize: 16, marginBottom: 4 },
  amount: { fontSize: 44, fontWeight: '800', letterSpacing: -1 },
  rails: { flexDirection: 'row', gap: 8 },
  rail: { flex: 1, height: 44, borderRadius: 12, borderWidth: 1, flexDirection: 'row', gap: 6, justifyContent: 'center', alignItems: 'center' },
  railTxt: { fontSize: 13, fontWeight: '600' },
  contacts: { gap: 14, paddingVertical: 2 },
  contact: { alignItems: 'center', gap: 6, width: 56 },
  cav: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  cavTxt: { fontSize: 14, fontWeight: '800' },
  cName: { fontSize: 11, fontWeight: '500' },
  note: { height: 48, borderRadius: 12, paddingHorizontal: 14, fontSize: 15, textAlign: 'center' },
  soon: { borderRadius: 12, padding: 18, alignItems: 'center' },
  soonTxt: { fontSize: 14, textAlign: 'center' },
  linkBtn: { alignItems: 'center', paddingVertical: 6 },
  linkTxt: { fontSize: 14, fontWeight: '600' },
  tipHint: { fontSize: 13, marginTop: 6 },
  tipRow: { borderRadius: 14, padding: 14, gap: 12 },
  tipLabel: { fontSize: 13, textAlign: 'center' },
});
