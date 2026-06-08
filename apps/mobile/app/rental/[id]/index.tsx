import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api } from '../../../src/api/client';
import { Badge } from '../../../src/components/Badge';
import { Button } from '../../../src/components/Button';
import { DemoBanner } from '../../../src/components/DemoBanner';
import { StatusTimeline } from '../../../src/components/StatusTimeline';
import { fetchRental } from '../../../src/hooks/useRentals';
import { formatINR, formatStatus, statusColor } from '../../../src/utils/format';
import { colors, radius, spacing } from '../../../src/theme';

type RentalDetail = Awaited<ReturnType<typeof fetchRental>>['rental'];

export default function RentalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rental, setRental] = useState<RentalDetail | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const router = useRouter();

  const load = useCallback(async () => {
    const { rental: r, demoMode: d } = await fetchRental(id);
    setRental(r);
    setDemoMode(d);
  }, [id]);

  useEffect(() => {
    load().catch(() => setRental(null));
  }, [load]);

  const handoff = async () => {
    if (demoMode) {
      Alert.alert('Handoff confirmed', 'Item marked in use (demo)');
      setRental((r) => (r ? { ...r, status: 'in_use' } : r));
      return;
    }
    try {
      await api(`/rentals/${id}/handoff`, { method: 'POST' });
      await load();
      Alert.alert('Handoff', 'Item marked in use');
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  if (!rental) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const status = rental.status;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {demoMode && <DemoBanner />}

      <View style={styles.heroCard}>
        <Image source={{ uri: rental.listing.imageUrl }} style={styles.thumb} />
        <View style={styles.heroCopy}>
          <Text style={styles.title}>{rental.listing.title}</Text>
          <Text style={styles.meta}>{rental.listing.city} · {rental.listing.category}</Text>
          <View style={[styles.statusPill, { backgroundColor: `${statusColor(status)}22` }]}>
            <Text style={[styles.statusText, { color: statusColor(status) }]}>
              {formatStatus(status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.amounts}>
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Rental fee</Text>
          <Text style={styles.amountValue}>{formatINR(rental.rentalFeePaise)}</Text>
        </View>
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Deposit</Text>
          <Text style={styles.amountValue}>{formatINR(rental.depositPaise)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Rental progress</Text>
      <StatusTimeline status={status} />

      {status === 'payment_pending' && (
        <Button label="Pay now" onPress={() => router.push(`/rental/${id}/pay`)} style={styles.action} />
      )}

      {status === 'active' && (
        <Button label="Confirm handoff" onPress={handoff} style={styles.action} />
      )}

      {status === 'in_use' && (
        <Button
          label="Mark returned"
          onPress={() => router.push(`/rental/${id}/return`)}
          style={styles.action}
        />
      )}

      {(status === 'deposit_hold' || status === 'dispute_open') && (
        <View style={styles.inspectionCard}>
          {rental.depositHoldUntil && (
            <Text style={styles.inspectionText}>
              Inspection window ends {new Date(rental.depositHoldUntil).toLocaleString()}
            </Text>
          )}
          <Button
            label="View dispute"
            variant="secondary"
            onPress={() => router.push(`/rental/${id}/dispute`)}
          />
        </View>
      )}

      {status === 'completed' && (
        <View style={styles.completedCard}>
          <Badge label="Completed" tone="success" />
          <Text style={styles.completedText}>Deposit released. Thanks for using Rent Mate!</Text>
        </View>
      )}

      {rental.dispute && (
        <View style={styles.disputeBox}>
          <Text style={styles.disputeTitle}>Dispute: {rental.dispute.status}</Text>
          <Text style={styles.disputeMeta}>
            Claimed {formatINR(rental.dispute.claimedAmountPaise)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  heroCard: {
    flexDirection: 'row',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: { width: 88, height: 88, borderRadius: radius.lg },
  heroCopy: { flex: 1, marginLeft: spacing.md },
  title: { color: colors.text, fontSize: 17, fontWeight: '800' },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  statusPill: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  amounts: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  amountBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountLabel: { color: colors.textMuted, fontSize: 12 },
  amountValue: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 4 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: spacing.xl, marginBottom: spacing.md },
  action: { marginTop: spacing.lg },
  inspectionCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.warningSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    gap: spacing.md,
  },
  inspectionText: { color: colors.textMuted, fontSize: 13 },
  completedCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  completedText: { color: colors.textMuted, fontSize: 14 },
  disputeBox: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.lg,
  },
  disputeTitle: { color: colors.text, fontWeight: '700' },
  disputeMeta: { color: colors.textMuted, marginTop: 4 },
});
