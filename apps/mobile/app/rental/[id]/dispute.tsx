import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api } from '../../../src/api/client';
import { Badge } from '../../../src/components/Badge';
import { Button } from '../../../src/components/Button';
import { formatINR } from '../../../src/utils/format';
import { colors, radius, spacing } from '../../../src/theme';

interface Dispute {
  id: string;
  status: string;
  claimedAmountPaise: number;
  resolution?: string;
  evidence: { url: string }[];
}

export default function DisputeScreen() {
  const { id: rentalId } = useLocalSearchParams<{ id: string }>();
  const [dispute, setDispute] = useState<Dispute | null | undefined>(undefined);
  const [claimAmount, setClaimAmount] = useState('50000');
  const [evidenceUrl, setEvidenceUrl] = useState(
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400',
  );

  const load = async () => {
    if (rentalId.startsWith('demo-')) {
      setDispute(null);
      return;
    }
    const d = await api<Dispute | null>(`/disputes/rentals/${rentalId}`);
    setDispute(d);
  };

  useEffect(() => {
    load().catch(() => setDispute(null));
  }, [rentalId]);

  const fileClaim = async () => {
    if (rentalId.startsWith('demo-')) {
      setDispute({
        id: 'demo-dispute',
        status: 'under_review',
        claimedAmountPaise: parseInt(claimAmount, 10),
        evidence: [{ url: evidenceUrl }],
      });
      Alert.alert('Dispute filed', 'Platform ops will review within 48 hours (demo)');
      return;
    }

    try {
      await api(`/disputes/rentals/${rentalId}`, {
        method: 'POST',
        body: JSON.stringify({
          claimedAmountPaise: parseInt(claimAmount, 10),
          evidenceUrls: [evidenceUrl],
        }),
      });
      await load();
      Alert.alert('Dispute filed', 'Under platform review');
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  if (dispute === undefined) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!dispute) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>⚖️</Text>
        <Text style={styles.title}>File damage claim</Text>
        <Text style={styles.subtitle}>
          Owners can claim up to the deposit amount with photo evidence. Rent Mate ops reviews within 48h.
        </Text>

        <Text style={styles.label}>Claim amount (paise)</Text>
        <TextInput
          style={styles.input}
          value={claimAmount}
          onChangeText={setClaimAmount}
          keyboardType="number-pad"
        />
        <Text style={styles.label}>Evidence photo URL</Text>
        <TextInput style={styles.input} value={evidenceUrl} onChangeText={setEvidenceUrl} />

        <Button label="File dispute" onPress={fileClaim} variant="danger" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📋</Text>
      <Text style={styles.title}>Dispute status</Text>
      <Badge
        label={dispute.status.replace(/_/g, ' ')}
        tone={dispute.status === 'resolved' ? 'success' : 'warning'}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Claimed amount</Text>
        <Text style={styles.summaryValue}>{formatINR(dispute.claimedAmountPaise)}</Text>
      </View>
      {dispute.resolution && (
        <View style={styles.resolution}>
          <Text style={styles.resolutionTitle}>Resolution</Text>
          <Text style={styles.resolutionText}>{dispute.resolution}</Text>
        </View>
      )}
      <Text style={styles.evidenceTitle}>Evidence submitted</Text>
      {dispute.evidence.map((e, i) => (
        <View key={i} style={styles.evidenceRow}>
          <Text style={styles.evidenceIcon}>🖼️</Text>
          <Text style={styles.evidenceUrl} numberOfLines={2}>
            {e.url}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, backgroundColor: colors.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  emoji: { fontSize: 40, marginTop: spacing.lg },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: spacing.md },
  subtitle: { color: colors.textMuted, marginTop: spacing.sm, lineHeight: 20, marginBottom: spacing.lg },
  label: { color: colors.textMuted, marginTop: spacing.lg, fontWeight: '600' },
  input: {
    backgroundColor: colors.bgElevated,
    color: colors.text,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summary: {
    marginTop: spacing.xl,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLabel: { color: colors.textMuted, fontSize: 13 },
  summaryValue: { color: colors.danger, fontSize: 24, fontWeight: '800', marginTop: 4 },
  resolution: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
  },
  resolutionTitle: { color: colors.text, fontWeight: '700' },
  resolutionText: { color: colors.textMuted, marginTop: spacing.xs },
  evidenceTitle: { color: colors.text, fontWeight: '700', marginTop: spacing.xl },
  evidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  evidenceIcon: { fontSize: 20 },
  evidenceUrl: { flex: 1, color: colors.textMuted, fontSize: 12 },
});
