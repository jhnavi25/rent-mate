import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api } from '../../../src/api/client';

export default function ReturnScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [photoUrl, setPhotoUrl] = useState('https://example.com/return-photo.jpg');
  const router = useRouter();

  const submit = async () => {
    try {
      await api(`/rentals/${id}/return`, {
        method: 'POST',
        body: JSON.stringify({ photos: [photoUrl] }),
      });
      Alert.alert('Returned', 'Owner has 72h inspection window', [
        { text: 'OK', onPress: () => router.replace(`/rental/${id}`) },
      ]);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark item returned</Text>
      <Text style={styles.label}>Return photo URL</Text>
      <TextInput
        style={styles.input}
        value={photoUrl}
        onChangeText={setPhotoUrl}
        placeholder="Photo URL"
        placeholderTextColor="#666"
      />
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Submit return</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#16213e' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  label: { color: '#888', marginTop: 24 },
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
