import { Stack } from 'expo-router';

export default function RootLayout() {

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
      <Stack.Screen name="profile" options={{ title: "Profil", headerShown: false }}/>
      <Stack.Screen name="editProfile" options={{ title: "Modifier le profil" }}/>
      <Stack.Screen name="settings" options={{ title: "Paramètres" }}/>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
