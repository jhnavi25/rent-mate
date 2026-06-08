import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { DemoRental } from '../data/demo';
import { formatINR, formatStatus, statusColor } from '../utils/format';
import { colors, radius, shadows, spacing } from '../theme';

export function RentalCard({ item, onPress }: { item: DemoRental; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.listing.imageUrl }} style={styles.thumb} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item.listing.title}
        </Text>
        <View style={[styles.statusPill, { backgroundColor: `${statusColor(item.status)}22` }]}>
          <View style={[styles.dot, { backgroundColor: statusColor(item.status) }]} />
          <Text style={[styles.status, { color: statusColor(item.status) }]}>
            {formatStatus(item.status)}
          </Text>
        </View>
        <Text style={styles.meta}>
          {item.startDate.slice(5)} → {item.endDate.slice(5)} · {item.listing.city}
        </Text>
        <Text style={styles.fee}>{formatINR(item.rentalFeePaise)} total</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  body: { flex: 1, marginLeft: spacing.md },
  title: { color: colors.text, fontSize: 15, fontWeight: '700' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  status: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  meta: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm },
  fee: { color: colors.primary, fontSize: 14, fontWeight: '700', marginTop: 4 },
  chevron: { color: colors.textDim, fontSize: 28, marginLeft: spacing.sm },
});
