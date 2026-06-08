import { StyleSheet, Text, View } from 'react-native';
import { rentalSteps } from '../utils/format';
import { colors, radius, spacing } from '../theme';

export function StatusTimeline({ status }: { status: string }) {
  const steps = rentalSteps(status);

  return (
    <View style={styles.wrap}>
      {steps.map((step, i) => (
        <View key={step.label} style={styles.stepRow}>
          <View style={styles.rail}>
            <View
              style={[
                styles.node,
                step.done && styles.nodeDone,
                step.active && styles.nodeActive,
              ]}
            />
            {i < steps.length - 1 && (
              <View style={[styles.line, step.done && styles.lineDone]} />
            )}
          </View>
          <Text
            style={[
              styles.label,
              step.done && styles.labelDone,
              step.active && styles.labelActive,
            ]}
          >
            {step.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 36 },
  rail: { width: 24, alignItems: 'center' },
  node: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.borderLight,
    borderWidth: 2,
    borderColor: colors.bgElevated,
  },
  nodeDone: { backgroundColor: colors.accent },
  nodeActive: { backgroundColor: colors.primary, transform: [{ scale: 1.15 }] },
  line: {
    width: 2,
    flex: 1,
    minHeight: 18,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  lineDone: { backgroundColor: colors.accent },
  label: {
    flex: 1,
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '600',
    paddingTop: 0,
    marginLeft: spacing.sm,
  },
  labelDone: { color: colors.textMuted },
  labelActive: { color: colors.text },
});
