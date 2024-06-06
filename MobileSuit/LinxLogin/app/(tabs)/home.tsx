import { Link, useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Avatar } from '@rneui/themed';
import { IconButton, MD3Colors } from "react-native-paper";
import Theme from '@/constants/Theme';

const HEADER_HEIGHT = 100;

export default function HomeScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={[styles.header, Theme().themeBack, Theme().themeShadow]}>
        <IconButton
          icon="cog"
          iconColor={Theme().themeIcon.color}
          onPress={() => router.push("/../settings")}
          style={styles.settings}
        />
        <Text style={[styles.headerText, Theme().themeText]}>Logo</Text>
        <Avatar
          size={48}
          rounded
          icon={{ name: "person", type: "material" }}
          containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 8, right: 15 }}
          onPress={() => router.push("/../profile")}
        />
      </View>
      <View style={[styles.body, Theme().themeBack2]}>
        <Text style={Theme().themeText}>Edit app/index.tsx to edit this screen.</Text>
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
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerText: {
    top: 15,
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
    bottom: 5, 
    left: 10,
  }
});
