import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export function DemoBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.emoji}>🧪</Text>
      <View style={styles.copy}>
        <Text style={styles.title}>Demo mode</Text>
        <Text style={styles.subtitle}>Showing sample data while API is offline</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.warningSoft,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.35)',
  },
  emoji: { fontSize: 20 },
  copy: { flex: 1 },
  title: { color: colors.warning, fontWeight: '700', fontSize: 13 },
  subtitle: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});
