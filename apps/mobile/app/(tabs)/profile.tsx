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
import { api } from '../../src/api/client';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { useAuth } from '../../src/context/AuthContext';
import { colors, radius, spacing } from '../../src/theme';

function MenuRow({
  emoji,
  title,
  subtitle,
  onPress,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <Text style={styles.menuEmoji}>{emoji}</Text>
      <View style={styles.menuCopy}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.menuChevron}>›</Text>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [pan, setPan] = useState('ABCDE1234F');
  const router = useRouter();

  const submitKyc = async () => {
    try {
      await api('/kyc/submit', {
        method: 'POST',
        body: JSON.stringify({ panNumber: pan }),
      });
      await refreshUser();
      Alert.alert('KYC', 'Verification complete — you can now book and list items.');
    } catch (e) {
      Alert.alert('KYC failed', (e as Error).message);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const kycTone =
    user?.kycStatus === 'verified' ? 'success' : user?.kycStatus === 'pending' ? 'warning' : 'default';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.phone?.slice(-2) ?? 'RM'}</Text>
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.name}>{user?.name ?? 'Rent Mate user'}</Text>
          <Text style={styles.phone}>{user?.phone}</Text>
          <View style={styles.badges}>
            <Badge label={user?.role ?? 'renter'} tone="info" />
            <Badge label={`KYC ${user?.kycStatus ?? 'none'}`} tone={kycTone} />
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Rentals</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>4.9</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Listings</Text>
        </View>
      </View>

      {user?.kycStatus !== 'verified' && (
        <View style={styles.kycCard}>
          <Text style={styles.kycTitle}>Complete KYC to unlock booking</Text>
          <Text style={styles.kycSub}>
            Required for checkout and creating listings. Uses stub provider in dev.
          </Text>
          <TextInput
            style={styles.input}
            value={pan}
            onChangeText={setPan}
            placeholder="PAN (ABCDE1234F)"
            placeholderTextColor={colors.textDim}
            autoCapitalize="characters"
          />
          <Button label="Verify identity" onPress={submitKyc} />
        </View>
      )}

      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.menu}>
        <MenuRow
          emoji="➕"
          title="List an item"
          subtitle="Earn from gear you already own"
          onPress={() => router.push('/list-item')}
        />
        <MenuRow emoji="💳" title="Payments" subtitle="Razorpay · deposits & refunds" />
        <MenuRow emoji="🛡️" title="Trust & safety" subtitle="KYC, disputes, deposit policy" />
        <MenuRow emoji="🔔" title="Notifications" subtitle="Handoff reminders & return alerts" />
      </View>

      <Button label="Sign out" variant="secondary" onPress={handleLogout} style={styles.logout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: { color: colors.primary, fontSize: 22, fontWeight: '800' },
  headerCopy: { flex: 1, marginLeft: spacing.lg },
  name: { color: colors.text, fontSize: 20, fontWeight: '800' },
  phone: { color: colors.textMuted, marginTop: 2 },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  kycCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.warningSoft,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  kycTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  kycSub: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs, lineHeight: 18 },
  input: {
    backgroundColor: colors.bgElevated,
    color: colors.text,
    padding: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  menu: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuEmoji: { fontSize: 22, width: 36 },
  menuCopy: { flex: 1 },
  menuTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  menuSubtitle: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  menuChevron: { color: colors.textDim, fontSize: 24 },
  logout: { marginTop: spacing.xl },
});
