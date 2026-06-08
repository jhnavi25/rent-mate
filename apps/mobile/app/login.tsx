import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '../src/components/Button';
import { useAuth } from '../src/context/AuthContext';
import { colors, radius, spacing } from '../src/theme';

const FEATURES = [
  { emoji: '🔐', title: 'OTP login', sub: 'Secure dev auth built-in' },
  { emoji: '💰', title: 'Deposits', sub: 'Held until return inspection' },
  { emoji: '⚖️', title: 'Disputes', sub: '72h owner review window' },
];

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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>RM</Text>
          </View>
          <Text style={styles.title}>Rent Mate</Text>
          <Text style={styles.subtitle}>India's peer-to-peer rental marketplace</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <Text style={styles.cardSub}>Sign in with your phone number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 43210"
            placeholderTextColor={colors.textDim}
            keyboardType="phone-pad"
          />
          <Button label="Continue" onPress={handleLogin} />
          <Text style={styles.hint}>
            Dev mode uses /auth/dev/login when Razorpay keys aren't configured
          </Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.feature}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSub}>{f.sub}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, padding: spacing.xl, justifyContent: 'center' },
  brand: { alignItems: 'center', marginBottom: spacing.xxxl },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: spacing.lg,
  },
  logoText: { color: colors.primary, fontSize: 28, fontWeight: '900' },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: colors.textMuted, fontSize: 15, marginTop: spacing.sm, textAlign: 'center' },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { color: colors.text, fontSize: 22, fontWeight: '800' },
  cardSub: { color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hint: { color: colors.textDim, fontSize: 12, marginTop: spacing.md, textAlign: 'center', lineHeight: 18 },
  features: { marginTop: spacing.xxxl, gap: spacing.md },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureEmoji: { fontSize: 24 },
  featureTitle: { color: colors.text, fontWeight: '700', fontSize: 15 },
  featureSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});
