import { Avatar } from "@rneui/themed";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton, MD3Colors, Card, Button } from "react-native-paper";

const HEADER_HEIGHT = 100;
const { width } = Dimensions.get('window');

export default function CatalogScreen() {
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
          containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 8, right: 15 }}
          onPress={() => router.push("/../profile")}
        />
      </View>
      <ScrollView 
        style={{ paddingBottom: 40 }}
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Card style={{ width: width - 40, marginVertical: 20 }}>
          <Card.Cover source={{ uri: 'https://picsum.photos/600' }} />
          <Card.Title title="Card Title" subtitle="Card Subtitle" />
          <Card.Content>
            <Text>Card title</Text>
            <Text>Card content</Text>
          </Card.Content>
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>
        <Card style={{ width: width - 40, marginVertical: 20 }}>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
          <Card.Title title="Graines de café" subtitle="Ch'ti café" />
          <Card.Content>
            <Text>Excellent café recommandé à tous les buveurs de café qui aiment le café moulu. Personnellement je n'aime pas le café mais l'ayant gouté je peux vous affirmer que ce café est délicieux même si en vrai de vrai je n'aime pas le café</Text>
          </Card.Content>
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>
        <Card style={{ width: width - 40, marginVertical: 20 }}>
          <Card.Cover source={{ uri: 'https://picsum.photos/800' }} />
          <Card.Title title="Card Title" subtitle="Card Subtitle" />
          <Card.Content>
            <Text>Card title</Text>
            <Text>Card content</Text>
          </Card.Content>
          <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
          </Card.Actions>
        </Card>
      </ScrollView>
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
    top: 15,
    color: 'black',
    fontSize: 20,
  },
  settings: {
    position: 'absolute', 
    bottom: 5, 
    left: 10,
  }
});
