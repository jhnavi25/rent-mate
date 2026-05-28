import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api } from '../../src/api/client';
import { useAuth } from '../../src/context/AuthContext';

interface Listing {
  id: string;
  title: string;
  description?: string;
  dailyPricePaise: number;
  depositPaise: number;
  city?: string;
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    api<Listing>(`/listings/${id}`).then(setListing).catch(() => setListing(null));
  }, [id]);

  const book = async () => {
    if (user?.kycStatus !== 'verified') {
      Alert.alert('KYC required', 'Complete KYC in Profile before booking');
      return;
    }
    const start = new Date();
    start.setDate(start.getDate() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 3);
    try {
      const rental = await api<{ id: string }>('/rentals', {
        method: 'POST',
        body: JSON.stringify({
          listingId: id,
          startDate: start.toISOString().slice(0, 10),
          endDate: end.toISOString().slice(0, 10),
        }),
      });
      await api(`/rentals/${rental.id}/confirm`, { method: 'POST' });
      router.push(`/rental/${rental.id}/pay`);
    } catch (e) {
      Alert.alert('Booking failed', (e as Error).message);
    }
  };

  if (!listing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#e94560" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{listing.title}</Text>
      {listing.description && <Text style={styles.desc}>{listing.description}</Text>}
      <Text style={styles.price}>₹{(listing.dailyPricePaise / 100).toFixed(0)}/day</Text>
      <Text style={styles.deposit}>
        Security deposit: ₹{(listing.depositPaise / 100).toFixed(0)}
      </Text>
      {listing.city && <Text style={styles.city}>{listing.city}</Text>}
      <Pressable style={styles.button} onPress={book}>
        <Text style={styles.buttonText}>Book (3 days)</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#16213e' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#16213e' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  desc: { color: '#aaa', marginTop: 12, lineHeight: 22 },
  price: { color: '#e94560', fontSize: 20, marginTop: 20, fontWeight: '600' },
  deposit: { color: '#888', marginTop: 8 },
  city: { color: '#666', marginTop: 8 },
  button: {
    backgroundColor: '#e94560',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
