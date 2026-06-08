import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { colors, spacing } from '../src/theme';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.centered}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>RM</Text>
        </View>
        <ActivityIndicator color={colors.primary} size="large" style={styles.spinner} />
        <Text style={styles.loadingText}>Loading Rent Mate...</Text>
      </View>
    );
  }

  if (!user) return <Redirect href="/login" />;
  return <Redirect href="/(tabs)/discover" />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
    padding: spacing.xl,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  logoText: { color: colors.primary, fontSize: 28, fontWeight: '900' },
  spinner: { marginTop: spacing.xl },
  loadingText: { color: colors.textMuted, marginTop: spacing.md },
});
