import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack >
        <Stack.Screen options={{headerShown:false}} name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="profile" options={{ title: "Profil", headerShown: false }}/>
        <Stack.Screen name="editProfile" options={{ title: "Modifier le profil" }}/>
        <Stack.Screen name="settings" options={{ title: "Paramètres" }}/>
        <Stack.Screen name="+not-found" />
      </Stack>
    </GestureHandlerRootView>
  );
}
