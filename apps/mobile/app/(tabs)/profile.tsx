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
import { api } from '../../src/api/client';
import { useAuth } from '../../src/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [pan, setPan] = useState('ABCDE1234F');
  const router = useRouter();

  const submitKyc = async () => {
    try {
      await api('/kyc/submit', {
        method: 'POST',
        body: JSON.stringify({ panNumber: pan }),
      });
      await refreshUser();
      Alert.alert('KYC', 'Verification complete');
    } catch (e) {
      Alert.alert('KYC failed', (e as Error).message);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Phone</Text>
      <Text style={styles.value}>{user?.phone}</Text>
      <Text style={styles.label}>KYC Status</Text>
      <Text style={[styles.value, user?.kycStatus === 'verified' && styles.verified]}>
        {user?.kycStatus ?? 'none'}
      </Text>
      {user?.kycStatus !== 'verified' && (
        <>
          <TextInput
            style={styles.input}
            value={pan}
            onChangeText={setPan}
            placeholder="PAN (ABCDE1234F)"
            placeholderTextColor="#666"
            autoCapitalize="characters"
          />
          <Pressable style={styles.button} onPress={submitKyc}>
            <Text style={styles.buttonText}>Submit KYC</Text>
          </Pressable>
        </>
      )}
      <Pressable style={[styles.button, styles.logout]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#16213e' },
  label: { color: '#888', fontSize: 12, marginTop: 16 },
  value: { color: '#fff', fontSize: 18, marginTop: 4 },
  verified: { color: '#4ecca3' },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
  },
  button: {
    backgroundColor: '#e94560',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  logout: { backgroundColor: '#333', marginTop: 32 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
