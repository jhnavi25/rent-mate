import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api } from '../../../src/api/client';

export default function PayScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const checkout = async () => {
    setLoading(true);
    try {
      const result = await api<{ mock?: boolean; message?: string; status?: string }>(
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
        Alert.alert(
          'Razorpay',
          'Complete payment in Razorpay checkout with the returned order IDs',
          [{ text: 'OK', onPress: () => router.replace(`/rental/${id}`) }],
        );
      }
    } catch (e) {
      Alert.alert('Checkout failed', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.subtitle}>
        Pays rental fee + security deposit (two Razorpay orders when configured)
      </Text>
      <Pressable style={styles.button} onPress={checkout} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay with Razorpay</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#16213e', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#888', marginTop: 12, lineHeight: 22 },
  button: {
    backgroundColor: '#e94560',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
