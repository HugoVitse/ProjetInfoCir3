import { Link, useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Avatar } from '@rneui/themed';
import { IconButton, MD3Colors } from "react-native-paper";

const HEADER_HEIGHT = 100;

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="cog"
          iconColor={MD3Colors.neutral20}
          onPress={() => router.push("/../settings")}
          style={styles.settings}
        />
        <Text style={styles.headerText}>Logo</Text>
        <Avatar
          size={48}
          rounded
          icon={{ name: "person", type: "material" }}
          containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 15, right: 15 }}
          onPress={() => router.push("/../profile")}
        />
      </View>
      <View style={styles.body}>
        <Text>Edit app/index.tsx to edit this screen.</Text>
        <Link href="@/settings">?</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerText: {
    top: 10,
    color: 'black',
    fontSize: 20,
  },
  body: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  settings: {
    position: 'absolute', 
    bottom: 10, 
    left: 10,
  }
});
