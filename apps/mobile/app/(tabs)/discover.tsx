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

interface Listing {
  id: string;
  title: string;
  dailyPricePaise: number;
  depositPaise: number;
  city?: string;
  category?: string;
}

export default function DiscoverScreen() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      const data = await api<Listing[]>('/listings');
      setListings(data);
    } catch {
      setListings([]);
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
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={listings.length === 0 ? styles.centered : undefined}
        ListEmptyComponent={<Text style={styles.empty}>No listings yet</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/listing/${item.id}`)}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              ₹{(item.dailyPricePaise / 100).toFixed(0)}/day · Deposit ₹
              {(item.depositPaise / 100).toFixed(0)}
            </Text>
            {item.city && <Text style={styles.cardCity}>{item.city}</Text>}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213e' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#888', fontSize: 16 },
  card: {
    backgroundColor: '#1a1a2e',
    margin: 12,
    padding: 16,
    borderRadius: 12,
  },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  cardMeta: { color: '#e94560', marginTop: 8 },
  cardCity: { color: '#888', marginTop: 4 },
});
