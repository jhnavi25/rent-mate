import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export function Badge({
  label,
  tone = 'default',
}: {
  label: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}) {
  const toneStyle = {
    default: styles.default,
    success: styles.success,
    warning: styles.warning,
    danger: styles.danger,
    info: styles.info,
  }[tone];

  return (
    <View style={[styles.base, toneStyle]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  default: { backgroundColor: colors.surface },
  success: { backgroundColor: colors.accentSoft },
  warning: { backgroundColor: colors.warningSoft },
  danger: { backgroundColor: colors.dangerSoft },
  info: { backgroundColor: 'rgba(56, 189, 248, 0.15)' },
  label: { color: colors.text, fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
});
