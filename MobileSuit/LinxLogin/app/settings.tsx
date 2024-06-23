import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import Theme from '@/constants/Theme';

export default function SettingsScreen() {
  const _Theme = Theme()

  return (
    <View style={[styles.container, _Theme.themeBack2]}>
      <Text style={_Theme.themeText}>Paramètres</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
