import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { api } from '../../../src/api/client';
import { Button } from '../../../src/components/Button';
import { colors, radius, spacing } from '../../../src/theme';

const DEMO_PHOTOS = ['📷 Front view', '📷 Serial number', '📷 Accessories'];

export default function ReturnScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1606144042614-b2417e99c4e9?w=400');
  const [selected, setSelected] = useState<number[]>([0, 1]);
  const router = useRouter();

  const togglePhoto = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const submit = async () => {
    if (id.startsWith('demo-')) {
      Alert.alert('Returned', 'Owner has 72h inspection window (demo)', [
        { text: 'OK', onPress: () => router.replace(`/rental/${id}`) },
      ]);
      return;
    }

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
      <Text style={styles.emoji}>📦</Text>
      <Text style={styles.title}>Mark item returned</Text>
      <Text style={styles.subtitle}>
        Add return photos so the owner can inspect condition during the 72-hour window.
      </Text>

      <Text style={styles.label}>Return checklist</Text>
      <View style={styles.checklist}>
        {DEMO_PHOTOS.map((label, i) => (
          <Pressable
            key={label}
            style={[styles.checkItem, selected.includes(i) && styles.checkItemActive]}
            onPress={() => togglePhoto(i)}
          >
            <Text style={styles.checkEmoji}>{selected.includes(i) ? '✅' : '⬜'}</Text>
            <Text style={styles.checkLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Primary photo URL</Text>
      <TextInput
        style={styles.input}
        value={photoUrl}
        onChangeText={setPhotoUrl}
        placeholder="Photo URL"
        placeholderTextColor={colors.textDim}
      />

      <Button label="Submit return" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, backgroundColor: colors.bg },
  emoji: { fontSize: 40, marginTop: spacing.lg },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: spacing.md },
  subtitle: { color: colors.textMuted, marginTop: spacing.sm, lineHeight: 20 },
  label: { color: colors.textMuted, marginTop: spacing.xl, fontWeight: '600' },
  checklist: { gap: spacing.sm, marginTop: spacing.md },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkItemActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  checkEmoji: { fontSize: 18 },
  checkLabel: { color: colors.text, fontWeight: '600' },
  input: {
    backgroundColor: colors.bgElevated,
    color: colors.text,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
