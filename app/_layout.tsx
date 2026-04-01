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
      {Platform.OS === 'web' && (
        <style type="text/css">{`
          body {
            zoom: 0.8;
          }
          /* Fallback pour Firefox qui ne supporte pas zoom */
          @-moz-document url-prefix() {
            body {
              transform: scale(0.8);
              transform-origin: top left;
              width: 125vw;
              min-height: 125vh;
            }
          }
        `}</style>
      )}
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
