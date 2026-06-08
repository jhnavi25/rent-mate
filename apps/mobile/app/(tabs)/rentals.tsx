import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { DemoBanner } from '../../src/components/DemoBanner';
import { RentalCard } from '../../src/components/RentalCard';
import { SectionHeader } from '../../src/components/SectionHeader';
import { useRentals } from '../../src/hooks/useRentals';
import { colors, radius, spacing } from '../../src/theme';

export default function RentalsScreen() {
  const { rentals, loading, demoMode, refresh } = useRentals();
  const router = useRouter();

  const active = rentals.filter((r) => !['completed', 'cancelled'].includes(r.status));
  const past = rentals.filter((r) => ['completed', 'cancelled'].includes(r.status));

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={[...active, ...past]}
      keyExtractor={(item) => item.id}
      refreshing={loading}
      onRefresh={refresh}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>My rentals</Text>
            <Text style={styles.heroSub}>Track payments, handoffs, returns & deposits</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{active.length}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{past.length}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>72h</Text>
                <Text style={styles.statLabel}>Inspection</Text>
              </View>
            </View>
          </View>
          {demoMode && <DemoBanner />}
          {active.length > 0 && <SectionHeader title="In progress" />}
        </View>
      }
      renderItem={({ item, index }) => {
        const showPastHeader = active.length > 0 && index === active.length;
        return (
          <View>
            {showPastHeader && <SectionHeader title="Past rentals" />}
            <RentalCard item={item} onPress={() => router.push(`/rental/${item.id}`)} />
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>No rentals yet</Text>
          <Text style={styles.emptyText}>Browse Discover to book your first item</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  hero: { padding: spacing.lg, paddingBottom: spacing.md },
  heroTitle: { color: colors.text, fontSize: 28, fontWeight: '800' },
  heroSub: { color: colors.textMuted, marginTop: spacing.xs, fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { color: colors.primary, fontSize: 20, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  empty: { alignItems: 'center', padding: spacing.xxxl },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: spacing.md },
  emptyText: { color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
});
