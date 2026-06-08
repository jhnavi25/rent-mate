import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { DemoListing } from '../data/demo';
import { formatINR } from '../utils/format';
import { colors, radius, shadows, spacing } from '../theme';
import { Badge } from './Badge';

export function ListingCard({
  item,
  onPress,
  featured,
}: {
  item: DemoListing;
  onPress: () => void;
  featured?: boolean;
}) {
  return (
    <Pressable
      style={[styles.card, featured && styles.featured]}
      onPress={onPress}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={[styles.accent, { backgroundColor: item.accent }]} />
        {item.verified && (
          <View style={styles.verified}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        )}
        <View style={styles.rating}>
          <Text style={styles.ratingText}>★ {item.rating}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <Badge label={item.category} tone="info" />
          <Text style={styles.distance}>{item.distanceKm} km</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.meta}>
          {item.city} · by {item.ownerName}
        </Text>
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>{formatINR(item.dailyPricePaise)}</Text>
            <Text style={styles.perDay}>/day</Text>
          </View>
          <Text style={styles.deposit}>Deposit {formatINR(item.depositPaise)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  featured: { borderColor: colors.primary },
  imageWrap: { height: 180, position: 'relative' },
  image: { width: '100%', height: '100%' },
  accent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    opacity: 0.9,
  },
  verified: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(11, 16, 32, 0.75)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  verifiedText: { color: colors.accent, fontSize: 11, fontWeight: '700' },
  rating: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(11, 16, 32, 0.75)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  ratingText: { color: colors.warning, fontSize: 11, fontWeight: '700' },
  body: { padding: spacing.lg },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  distance: { color: colors.textDim, fontSize: 12 },
  title: { color: colors.text, fontSize: 17, fontWeight: '700', lineHeight: 22 },
  meta: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.md,
  },
  price: { color: colors.primary, fontSize: 20, fontWeight: '800' },
  perDay: { color: colors.textDim, fontSize: 12 },
  deposit: { color: colors.textMuted, fontSize: 12 },
});
