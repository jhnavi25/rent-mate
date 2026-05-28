import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function LoginScreen() {
  const [phone, setPhone] = useState('+919876543210');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(phone);
      router.replace('/(tabs)/discover');
    } catch (e) {
      Alert.alert('Login failed', (e as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rent Mate</Text>
      <Text style={styles.subtitle}>Peer-to-peer rentals</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Dev Login</Text>
      </Pressable>
      <Text style={styles.hint}>Uses /auth/dev/login when API has no Razorpay keys</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#16213e' },
  title: { fontSize: 32, fontWeight: '700', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#aaa', marginBottom: 32 },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#e94560',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  hint: { color: '#666', fontSize: 12, marginTop: 16, textAlign: 'center' },
});
