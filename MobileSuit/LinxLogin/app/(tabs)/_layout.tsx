import { Tabs } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Theme from '@/constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  
  const _Theme = Theme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: _Theme.themeIcon.color,
          tabBarStyle: { 
            backgroundColor: _Theme.themeBack.backgroundColor, 
            shadowColor: _Theme.themeShadow.shadowColor, 
            borderColor: _Theme.themeShadow.borderColor,
            borderTopWidth: 1, 
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen 
          name="home"
          options={{
            title: 'Acceuil',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen 
          name="events"
          options={{
            title: 'Evènements',
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons name={focused?"event":"event"} size={24} color={color} />  
            ),
          }}
        />
        <Tabs.Screen 
          name="catalog" 
          options={{
            title: 'Catalogue',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen 
          name="calendar"  
          options={{
            title: 'Calendrier',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
