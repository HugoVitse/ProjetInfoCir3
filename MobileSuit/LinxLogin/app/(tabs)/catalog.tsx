import { Avatar } from "@rneui/themed";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton, MD3Colors, Card, Button, ActivityIndicator } from "react-native-paper";
import { useState , useEffect } from "react";
import axios from 'axios'
import Config from '../../config.json'
import {activitie} from '../../constants/activities'
import AsyncStorage from '@react-native-async-storage/async-storage';

const HEADER_HEIGHT = 100;
const { width } = Dimensions.get('window');

export default function CatalogScreen() {
  const router = useRouter();
  const [activities,setActivities] = useState<activitie[]>([])
  const [componentActivities,setComponentActivities] = useState<JSX.Element[]>([])
  const [jwt,setJwt] = useState('');
  const [isjwt,setisjwt] = useState(-1)
  const [islogin,setLogin] = useState(-1)
  const [isLoaded,setIsLoaded] = useState(false)


  const _retrieveData = async (key:string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        setJwt(value)
        setisjwt(1)
      }
      else{
        setisjwt(0)
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  useEffect(()=>{
    const getActivities = async() => {
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      console.log(jwt_cookie)
      const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/activities`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setActivities(response.data)
      setIsLoaded(true)
    }
    getActivities()
  } ,[])

  useEffect(()=>{
    if(activities.length >0){
        let tmpComp = []
        for(let i=0; i< activities.length;i++){
            console.log(i)
            console.log(activities[i])
            const newCard = <Card style={{ width: width - 40, marginVertical: 20 }}>
                              <Card.Cover source={{ uri: activities[i].image }} />
                              <Card.Title title={activities[i].name} subtitle={activities[i].date}/>
                              <Card.Content>
                                <Text>{activities[i].adresse}</Text>
                                <Text>{activities[i].description}</Text>
                              </Card.Content>
                              <Card.Actions>
                                <Button>Cancel</Button>
                                <Button>Ok</Button>
                              </Card.Actions>
                            </Card>
            tmpComp.push(newCard)
        }
        setComponentActivities(tmpComp)
    }
  },[activities])
  
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
      {!isLoaded?<View  style={{    flex: 1,      justifyContent: 'center',}} ><ActivityIndicator animating={true} color={colorMain} size='large'></ActivityIndicator></View>:
      <ScrollView 
        style={{ paddingBottom: 40 }}
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
      >
        
        {componentActivities}
      </ScrollView>}
    </View>
  );
}

const colorMain = '#99c3ff'
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
    top: 10,
    color: 'black',
    fontSize: 20,
  },
  settings: {
    position: 'absolute', 
    bottom: 10, 
    left: 10,
  }
});
