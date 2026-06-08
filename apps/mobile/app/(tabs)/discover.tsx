import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CategoryPill } from '../../src/components/CategoryPill';
import { DemoBanner } from '../../src/components/DemoBanner';
import { ListingCard } from '../../src/components/ListingCard';
import { SearchBar } from '../../src/components/SearchBar';
import { SectionHeader } from '../../src/components/SectionHeader';
import { CATEGORIES } from '../../src/data/demo';
import { useListings } from '../../src/hooks/useListings';
import { colors, spacing } from '../../src/theme';

export default function DiscoverScreen() {
  const { listings, loading, demoMode } = useListings();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const router = useRouter();

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [listings, query, category]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              <Text style={styles.greeting}>Good evening 👋</Text>
              <Text style={styles.heroTitle}>Rent smarter,{'\n'}near you</Text>
              <Text style={styles.heroSub}>
                Cameras, gear, tools & more — with deposits and disputes built in.
              </Text>
            </View>

            {demoMode && <DemoBanner />}

            <SearchBar value={query} onChangeText={setQuery} />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categories}
            >
              {CATEGORIES.map((cat) => (
                <CategoryPill
                  key={cat.id}
                  label={cat.label}
                  emoji={cat.emoji}
                  active={category === cat.id}
                  onPress={() => setCategory(cat.id)}
                />
              ))}
            </ScrollView>

            {featured && (
              <>
                <SectionHeader title="Featured near you" />
                <ListingCard
                  item={featured}
                  featured
                  onPress={() => router.push(`/listing/${featured.id}`)}
                />
                <SectionHeader title="More to explore" />
              </>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No matches</Text>
            <Text style={styles.emptyText}>Try another category or search term</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ListingCard item={item} onPress={() => router.push(`/listing/${item.id}`)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  greeting: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  heroTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    marginTop: spacing.sm,
    letterSpacing: -0.5,
  },
  heroSub: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: spacing.sm },
  categories: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  empty: { alignItems: 'center', padding: spacing.xxxl },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: spacing.md },
  emptyText: { color: colors.textMuted, marginTop: spacing.xs },
});
