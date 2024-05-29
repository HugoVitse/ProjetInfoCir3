import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function EditScreen() {
  return (
    <View style={styles.container}>
      <Text>Modifier le profil</Text>
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
