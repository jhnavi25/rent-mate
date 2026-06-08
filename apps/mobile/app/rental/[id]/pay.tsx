import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { api } from '../../../src/api/client';
import { Button } from '../../../src/components/Button';
import { colors, radius, spacing } from '../../../src/theme';

const LINE_ITEMS = [
  { label: 'Rental fee (3 days)', amount: '₹2,397' },
  { label: 'Security deposit', amount: '₹12,000' },
  { label: 'Platform fee (10%)', amount: '₹240' },
];

export default function PayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const checkout = async () => {
    if (id.startsWith('demo-')) {
      Alert.alert('Payment simulated', 'Rental fee + deposit captured (demo)', [
        { text: 'View rental', onPress: () => router.replace(`/rental/${id}`) },
      ]);
      return;
    }

    setLoading(true);
    try {
      const result = await api<{ mock?: boolean; message?: string }>(
        `/rentals/${id}/checkout`,
        {
          method: 'POST',
          headers: { 'Idempotency-Key': `checkout-${id}-${Date.now()}` },
        },
      );
      if (result.mock) {
        Alert.alert('Payment', result.message ?? 'Payment simulated', [
          { text: 'OK', onPress: () => router.replace(`/rental/${id}`) },
        ]);
      } else {
        Alert.alert('Razorpay', 'Complete payment in Razorpay checkout', [
          { text: 'OK', onPress: () => router.replace(`/rental/${id}`) },
        ]);
      }
    } catch (e) {
      Alert.alert('Checkout failed', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>💳</Text>
        <Text style={styles.title}>Secure checkout</Text>
        <Text style={styles.subtitle}>
          Two Razorpay orders — rental fee and refundable deposit
        </Text>
      </View>

      <View style={styles.card}>
        {LINE_ITEMS.map((item) => (
          <View key={item.label} style={styles.row}>
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={styles.rowValue}>{item.amount}</Text>
          </View>
        ))}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total due now</Text>
          <Text style={styles.totalValue}>₹14,637</Text>
        </View>
      </View>

      <View style={styles.trust}>
        <Text style={styles.trustItem}>🔒 256-bit encrypted payment</Text>
        <Text style={styles.trustItem}>↩️ Deposit refunded after inspection</Text>
        <Text style={styles.trustItem}>📧 Receipt sent to your phone</Text>
      </View>

      <Button label="Pay with Razorpay" onPress={checkout} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, backgroundColor: colors.bg, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  emoji: { fontSize: 48 },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', marginTop: spacing.md },
  subtitle: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  rowLabel: { color: colors.textMuted, fontSize: 14 },
  rowValue: { color: colors.text, fontWeight: '600' },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  totalLabel: { color: colors.text, fontWeight: '700', fontSize: 16 },
  totalValue: { color: colors.primary, fontWeight: '800', fontSize: 20 },
  trust: { gap: spacing.sm, marginBottom: spacing.xl },
  trustItem: { color: colors.textMuted, fontSize: 13 },
});
