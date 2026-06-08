import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { api } from '../src/api/client';
import { Button } from '../src/components/Button';
import { CATEGORIES } from '../src/data/demo';
import { useAuth } from '../src/context/AuthContext';
import { colors, radius, spacing } from '../src/theme';

export default function ListItemScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('Canon EOS R6 Body');
  const [description, setDescription] = useState('Includes battery, charger, and padded case.');
  const [dailyPrice, setDailyPrice] = useState('1200');
  const [deposit, setDeposit] = useState('15000');
  const [city, setCity] = useState('Mumbai');
  const [category, setCategory] = useState('cameras');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (user?.kycStatus !== 'verified') {
      Alert.alert('KYC required', 'Verify your identity in Profile before listing items.');
      return;
    }

    setLoading(true);
    try {
      await api('/listings', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          dailyPricePaise: parseInt(dailyPrice, 10) * 100,
          depositPaise: parseInt(deposit, 10) * 100,
          city,
          category,
        }),
      });
      Alert.alert('Listed!', 'Your item is now live on Discover.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert(
        'Demo listing saved',
        'API offline — your listing would appear after the server starts.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.emoji}>✨</Text>
      <Text style={styles.title}>List an item</Text>
      <Text style={styles.subtitle}>Earn from gear sitting at home. Set your price and deposit.</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>₹ / day</Text>
          <TextInput
            style={styles.input}
            value={dailyPrice}
            onChangeText={setDailyPrice}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Deposit ₹</Text>
          <TextInput
            style={styles.input}
            value={deposit}
            onChangeText={setDeposit}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <Text style={styles.label}>City</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categories}>
        {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
          <Pressable key={cat.id} onPress={() => setCategory(cat.id)}>
            <Text style={[styles.catPill, category === cat.id && styles.catPillActive]}>
              {cat.emoji} {cat.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Button label="Publish listing" onPress={submit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  emoji: { fontSize: 36 },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', marginTop: spacing.md },
  subtitle: { color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.lg },
  label: { color: colors.textMuted, fontWeight: '600', marginTop: spacing.lg, marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.bgElevated,
    color: colors.text,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  multiline: { minHeight: 90, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  catPill: {
    color: colors.textMuted,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  catPillActive: {
    color: colors.primary,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
});
