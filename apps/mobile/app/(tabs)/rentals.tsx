import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api } from '../../src/api/client';

interface Rental {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  rentalFeePaise: number;
  listing: { title: string };
}

export default function RentalsScreen() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      const data = await api<Rental[]>('/rentals/mine');
      setRentals(data);
    } catch {
      setRentals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#e94560" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={rentals}
      keyExtractor={(item) => item.id}
      contentContainerStyle={rentals.length === 0 ? styles.centered : undefined}
      ListEmptyComponent={<Text style={styles.empty}>No rentals yet</Text>}
      onRefresh={load}
      refreshing={loading}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() => router.push(`/rental/${item.id}`)}
        >
          <Text style={styles.title}>{item.listing.title}</Text>
          <Text style={styles.status}>{item.status.replace(/_/g, ' ')}</Text>
          <Text style={styles.meta}>
            ₹{(item.rentalFeePaise / 100).toFixed(0)} · {item.startDate.slice(0, 10)}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e' },
  centered: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#888' },
  card: {
    backgroundColor: '#1a1a2e',
    margin: 12,
    padding: 16,
    borderRadius: 12,
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
  status: { color: '#e94560', marginTop: 4, textTransform: 'capitalize' },
  meta: { color: '#888', marginTop: 4 },
});
