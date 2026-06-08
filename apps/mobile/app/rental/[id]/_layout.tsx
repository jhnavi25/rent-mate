import { Stack } from 'expo-router';
import { colors } from '../../../src/theme';

export default function RentalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgElevated },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Rental details' }} />
      <Stack.Screen name="pay" options={{ title: 'Checkout' }} />
      <Stack.Screen name="return" options={{ title: 'Return item' }} />
      <Stack.Screen name="dispute" options={{ title: 'Dispute' }} />
    </Stack>
  );
}
