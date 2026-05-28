import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api } from '../../../src/api/client';

interface Rental {
  id: string;
  status: string;
  rentalFeePaise: number;
  depositPaise: number;
  depositHoldUntil?: string;
  listing: { title: string; ownerId: string };
  dispute?: { status: string; claimedAmountPaise: number } | null;
}

export default function RentalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rental, setRental] = useState<Rental | null>(null);
  const router = useRouter();

  const load = useCallback(async () => {
    const data = await api<Rental>(`/rentals/${id}`);
    setRental(data);
  }, [id]);

  useEffect(() => {
    load().catch(() => setRental(null));
  }, [load]);

  const handoff = async () => {
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
        <ActivityIndicator color="#e94560" />
      </View>
    );
  }

  const status = rental.status;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{rental.listing.title}</Text>
      <Text style={styles.status}>Status: {status.replace(/_/g, ' ')}</Text>
      <Text style={styles.meta}>
        Fee ₹{(rental.rentalFeePaise / 100).toFixed(0)} · Deposit ₹
        {(rental.depositPaise / 100).toFixed(0)}
      </Text>

      {status === 'payment_pending' && (
        <Pressable
          style={styles.button}
          onPress={() => router.push(`/rental/${id}/pay`)}
        >
          <Text style={styles.buttonText}>Pay now</Text>
        </Pressable>
      )}

      {status === 'active' && (
        <Pressable style={styles.button} onPress={handoff}>
          <Text style={styles.buttonText}>Confirm handoff</Text>
        </Pressable>
      )}

      {status === 'in_use' && (
        <Pressable
          style={styles.button}
          onPress={() => router.push(`/rental/${id}/return`)}
        >
          <Text style={styles.buttonText}>Mark returned</Text>
        </Pressable>
      )}

      {(status === 'deposit_hold' || status === 'dispute_open') && (
        <>
          {rental.depositHoldUntil && (
            <Text style={styles.hint}>
              Inspection until {new Date(rental.depositHoldUntil).toLocaleString()}
            </Text>
          )}
          <Pressable
            style={[styles.button, styles.secondary]}
            onPress={() => router.push(`/rental/${id}/dispute`)}
          >
            <Text style={styles.buttonText}>View dispute</Text>
          </Pressable>
        </>
      )}

      {rental.dispute && (
        <View style={styles.disputeBox}>
          <Text style={styles.disputeTitle}>Dispute: {rental.dispute.status}</Text>
          <Text style={styles.hint}>
            Claimed ₹{(rental.dispute.claimedAmountPaise / 100).toFixed(0)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#16213e' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#16213e' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  status: { color: '#e94560', marginTop: 8, textTransform: 'capitalize' },
  meta: { color: '#888', marginTop: 8 },
  button: {
    backgroundColor: '#e94560',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  secondary: { backgroundColor: '#333' },
  buttonText: { color: '#fff', fontWeight: '600' },
  hint: { color: '#666', marginTop: 12 },
  disputeBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
  },
  disputeTitle: { color: '#fff', fontWeight: '600' },
});
