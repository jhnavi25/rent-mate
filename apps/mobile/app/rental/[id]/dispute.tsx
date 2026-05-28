import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api } from '../../../src/api/client';

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
  const [evidenceUrl, setEvidenceUrl] = useState('https://example.com/damage.jpg');

  const load = async () => {
    const d = await api<Dispute | null>(`/disputes/rentals/${rentalId}`);
    setDispute(d);
  };

  useEffect(() => {
    load().catch(() => setDispute(null));
  }, [rentalId]);

  const fileClaim = async () => {
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
        <ActivityIndicator color="#e94560" />
      </View>
    );
  }

  if (!dispute) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>File damage claim (owner)</Text>
        <Text style={styles.label}>Claim amount (paise)</Text>
        <TextInput
          style={styles.input}
          value={claimAmount}
          onChangeText={setClaimAmount}
          keyboardType="number-pad"
        />
        <Text style={styles.label}>Evidence URL</Text>
        <TextInput style={styles.input} value={evidenceUrl} onChangeText={setEvidenceUrl} />
        <Pressable style={styles.button} onPress={fileClaim}>
          <Text style={styles.buttonText}>File dispute</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispute status</Text>
      <Text style={styles.status}>{dispute.status}</Text>
      <Text style={styles.meta}>
        Claimed: ₹{(dispute.claimedAmountPaise / 100).toFixed(0)}
      </Text>
      {dispute.resolution && (
        <Text style={styles.meta}>Resolution: {dispute.resolution}</Text>
      )}
      {dispute.evidence.map((e, i) => (
        <Text key={i} style={styles.evidence}>
          Evidence: {e.url}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#16213e' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#16213e' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  status: { color: '#e94560', marginTop: 12, fontSize: 18 },
  meta: { color: '#888', marginTop: 8 },
  evidence: { color: '#666', marginTop: 8, fontSize: 12 },
  label: { color: '#888', marginTop: 16 },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#e94560',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
