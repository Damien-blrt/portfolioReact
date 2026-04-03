import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <>
      <Head>
        <title>Damien BALLERAT</title>
      </Head>
      {/* Suppression du zoom global */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "Damien BALLERAT" }} />
        <Stack.Screen
          name="project/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
