import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { radius, space } from '../constants/theme';
import { kes } from '../lib/format';
import { draft } from '../lib/onboarding-store';
import { useTheme } from '../lib/theme-context';

export default function QrScreen() {
  const { colors } = useTheme();
  const { mode = 'mycode', amount } = useLocalSearchParams<{ mode: 'mycode' | 'scan'; amount?: string }>();
  const [tab, setTab] = useState<'mycode' | 'scan'>(mode);
  const ztag = draft.ztag ?? 'you';
  const amt = Number(amount) || 0;
  const value = `zenti://pay?to=${ztag}${amt ? `&amount=${amt}` : ''}`;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.close, { backgroundColor: colors.s3 }]} hitSlop={10}>
          <X color={colors.t1} size={20} />
        </Pressable>
        <View style={[styles.toggle, { backgroundColor: colors.s2 }]}>
          {(['mycode', 'scan'] as const).map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={[styles.tog, tab === t && { backgroundColor: colors.t1 }]}>
              <Text style={[styles.togTxt, { color: tab === t ? colors.bg : colors.t2 }]}>{t === 'mycode' ? 'My code' : 'Scan'}</Text>
            </Pressable>
          ))}
        </View>
        <View style={{ width: 36 }} />
      </View>

      {tab === 'mycode' ? (
        <View style={styles.body}>
          <View style={styles.qrCard}>
            <QRCode value={value} size={220} color="#000" backgroundColor="#fff" />
          </View>
          <Text style={[styles.tag, { color: colors.t1 }]}>${ztag}</Text>
          {amt > 0 ? (
            <Text style={[styles.sub, { color: colors.green }]}>Requesting {kes(amt)}</Text>
          ) : (
            <Text style={[styles.sub, { color: colors.t2 }]}>Scan to pay me on Zenti</Text>
          )}
        </View>
      ) : (
        <View style={styles.body}>
          <View style={[styles.scanFrame, { borderColor: colors.green }]}>
            <View style={[styles.corner, styles.tl, { borderColor: colors.green }]} />
            <View style={[styles.corner, styles.tr, { borderColor: colors.green }]} />
            <View style={[styles.corner, styles.bl, { borderColor: colors.green }]} />
            <View style={[styles.corner, styles.br, { borderColor: colors.green }]} />
          </View>
          <Text style={[styles.scanHint, { color: colors.t2 }]}>Point at a Zenti QR to pay</Text>
          <View style={styles.simWrap}>
            <Button label="Simulate a scan" variant="green" onPress={() => router.replace('/pay')} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const FRAME = 240;
const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.px, paddingTop: 6 },
  close: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  toggle: { flexDirection: 'row', borderRadius: radius.pill, padding: 3 },
  tog: { paddingHorizontal: 18, paddingVertical: 7, borderRadius: radius.pill },
  togTxt: { fontSize: 14, fontWeight: '700' },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: space.px, gap: 16 },
  qrCard: { backgroundColor: '#fff', padding: 24, borderRadius: 24 },
  tag: { fontSize: 22, fontWeight: '800', marginTop: 8 },
  sub: { fontSize: 15 },
  scanFrame: { width: FRAME, height: FRAME, borderRadius: 28 },
  corner: { position: 'absolute', width: 36, height: 36 },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 28 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 28 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 28 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 28 },
  scanHint: { fontSize: 15 },
  simWrap: { alignSelf: 'stretch', marginTop: 20 },
});
