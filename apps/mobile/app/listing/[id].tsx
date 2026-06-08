import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api } from '../../src/api/client';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { DemoBanner } from '../../src/components/DemoBanner';
import { DemoListing } from '../../src/data/demo';
import { useAuth } from '../../src/context/AuthContext';
import { fetchListing } from '../../src/hooks/useListings';
import { formatINR } from '../../src/utils/format';
import { colors, radius, spacing } from '../../src/theme';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<DemoListing | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [booking, setBooking] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchListing(id).then(({ listing: l, demoMode: d }) => {
      setListing(l);
      setDemoMode(d);
    });
  }, [id]);

  const book = async () => {
    if (user?.kycStatus !== 'verified') {
      Alert.alert('KYC required', 'Complete identity verification in Profile before booking.');
      return;
    }

    if (demoMode || id.startsWith('demo-')) {
      router.push(`/rental/demo-rental-1/pay`);
      return;
    }

    setBooking(true);
    const start = new Date();
    start.setDate(start.getDate() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 3);
    try {
      const rental = await api<{ id: string }>('/rentals', {
        method: 'POST',
        body: JSON.stringify({
          listingId: id,
          startDate: start.toISOString().slice(0, 10),
          endDate: end.toISOString().slice(0, 10),
        }),
      });
      await api(`/rentals/${rental.id}/confirm`, { method: 'POST' });
      router.push(`/rental/${rental.id}/pay`);
    } catch (e) {
      Alert.alert('Booking failed', (e as Error).message);
    } finally {
      setBooking(false);
    }
  };

  if (!listing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const total = listing.dailyPricePaise * 3;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Image source={{ uri: listing.imageUrl }} style={styles.heroImage} />
        <View style={[styles.heroAccent, { backgroundColor: listing.accent }]} />
      </View>

      {demoMode && <DemoBanner />}

      <View style={styles.body}>
        <View style={styles.badges}>
          <Badge label={listing.category} tone="info" />
          {listing.verified && <Badge label="Verified owner" tone="success" />}
        </View>

        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.location}>
          📍 {listing.city} · {listing.distanceKm} km away · ★ {listing.rating} ({listing.reviews})
        </Text>

        <View style={styles.ownerCard}>
          <View style={styles.ownerAvatar}>
            <Text style={styles.ownerInitial}>{listing.ownerName[0]}</Text>
          </View>
          <View>
            <Text style={styles.ownerName}>Hosted by {listing.ownerName}</Text>
            <Text style={styles.ownerMeta}>Responds within 1 hour · KYC verified</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>About this item</Text>
        <Text style={styles.description}>{listing.description}</Text>

        <View style={styles.tags}>
          {listing.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Daily rate</Text>
            <Text style={styles.priceValue}>{formatINR(listing.dailyPricePaise)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Security deposit</Text>
            <Text style={styles.priceValueMuted}>{formatINR(listing.depositPaise)}</Text>
          </View>
          <View style={[styles.priceRow, styles.priceTotal]}>
            <Text style={styles.priceLabel}>3-day rental</Text>
            <Text style={styles.priceTotalValue}>{formatINR(total)}</Text>
          </View>
        </View>

        <Button
          label={booking ? 'Booking...' : 'Book for 3 days'}
          onPress={book}
          loading={booking}
        />
        <Text style={styles.policy}>
          Deposit is refunded after return unless owner files a claim within 72 hours.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg },
  hero: { height: 280, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroAccent: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 6 },
  body: { padding: spacing.lg },
  badges: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', lineHeight: 32 },
  location: { color: colors.textMuted, marginTop: spacing.sm, fontSize: 14 },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerInitial: { color: colors.primary, fontSize: 20, fontWeight: '800' },
  ownerName: { color: colors.text, fontWeight: '700', fontSize: 15 },
  ownerMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: spacing.xl },
  description: { color: colors.textMuted, marginTop: spacing.sm, lineHeight: 22, fontSize: 15 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  tag: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  priceCard: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { color: colors.textMuted, fontSize: 14 },
  priceValue: { color: colors.primary, fontSize: 18, fontWeight: '800' },
  priceValueMuted: { color: colors.text, fontSize: 16, fontWeight: '600' },
  priceTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  priceTotalValue: { color: colors.text, fontSize: 20, fontWeight: '800' },
  policy: { color: colors.textDim, fontSize: 12, textAlign: 'center', marginTop: spacing.md, lineHeight: 18 },
});
