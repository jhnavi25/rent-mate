import { Stack } from 'expo-router';

export default function RentalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#fff',
        contentStyle: { backgroundColor: '#16213e' },
      }}
    />
  );
}
