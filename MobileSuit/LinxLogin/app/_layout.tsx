import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Theme from "@/constants/Theme";
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();//Ignore all log notifications


export default function RootLayout() {
  const _Theme = Theme()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack 
        screenOptions={{
          headerStyle: {
            backgroundColor: _Theme.themeBack.backgroundColor, 
          },
          headerShadowVisible: true,
          contentStyle: {
            shadowColor: _Theme.themeShadow.shadowColor, 
            borderColor: _Theme.themeShadow.borderColor,
            borderBottomWidth: 1, 
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
          },
          headerTitleStyle: {
            color: _Theme.themeText.color
          },
          headerTintColor: _Theme.themeIcon.color
        }}
      >
        <Stack.Screen options={{headerShown:false}} name="index" />
        <Stack.Screen options={{headerShown:false}} name="register" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="profile" options={{ title: "Profil", headerShown: false }}/>
        <Stack.Screen name="editProfile" options={{ title: "Modifier le profil" }}/>
        <Stack.Screen name="settings" options={{ title: "Paramètres" }}/>
        <Stack.Screen name="+not-found" />
      </Stack>
    </GestureHandlerRootView>
  );
}
