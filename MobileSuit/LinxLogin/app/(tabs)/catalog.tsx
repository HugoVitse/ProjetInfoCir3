import { Avatar } from "@rneui/themed";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Dimensions,Modal,Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton,MD3Colors, Card, Button, ActivityIndicator, PaperProvider, Portal ,TextInput} from "react-native-paper";
import React, { useState , useEffect } from "react";
import axios from 'axios'
import Config from '../../config.json'
import {activitie} from '../../constants/activities'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Theme from "../../constants/Theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
  const [visible, setVisible] = useState(false);
  const [actualIndex, setActualIndex] = useState(0);
  const [date, setDate] = useState(new Date());

  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");


  const onChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const _Theme = Theme();

  const createEvent = async() => {
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const data = {
      activity:{
        title:activities[actualIndex].name,
        description:activities[actualIndex].description,
        image:activities[actualIndex].image,
        adresse:activities[actualIndex].adresse,
      },
      date:date,
      nbinvities:text,
    }

    console.log(data)

    const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/createEvenement`,data, {headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    console.log(response)
    setModalVisible(!modalVisible)
  }

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
            const newCard = <Card style={[{ width: width - 40, marginVertical: 20 },_Theme.themeCard]}>
                              <Card.Cover source={{ uri: activities[i].image }} />
                              <Card.Title titleStyle={{color:_Theme.themeText.color}} subtitleStyle={{color:_Theme.themeText.color}} title={activities[i].name} subtitle={activities[i].date}/>
                              <Card.Content>
                                <Text style={_Theme.themeText}>{activities[i].adresse}</Text>
                                <Text style={_Theme.themeText}>{activities[i].description}</Text>
                              </Card.Content>
                              <Card.Actions>
                                <Button style={_Theme.themeBouton} onPress={()=>{setModalVisible(!modalVisible);setActualIndex(i)}} >Créer un évènement</Button>
                              </Card.Actions>
                            </Card>
            tmpComp.push(newCard)
        }
        setComponentActivities(tmpComp)
    }
  },[activities])
  
  return (

      
    <View style={styles.container}>
      <Modal

        animationType="slide"
        transparent={true}
        visible={modalVisible}
       >
        <KeyboardAwareScrollView contentContainerStyle={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{activities[actualIndex]?activities[actualIndex].name:""}</Text>
            <Text style={styles.modalText}>{activities[actualIndex]?activities[actualIndex].description:""}</Text>
            <Image source={{uri:activities[actualIndex]?activities[actualIndex].image:""}} style={{width:"80%",height:"40%"}}></Image>
            <View style={styles.horizontal}>
              <Text style={{justifyContent:'center',alignItems:'center',flex:1}}>Nombre d'invités</Text>
              <TextInput
                label="Invités"
                mode="outlined"
                value={text}
                keyboardType = 'numeric'
                onChangeText={text => setText(text)}
              />
            </View>
            <View style={styles.horizontal}>
              <Text style={{justifyContent:'center',alignItems:'center',flex:1}}>Date de l'évènement</Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
             
            </View>
            <View style={styles.horizontal}>
              <Button onPress={()=>{setModalVisible(!modalVisible)}} mode="contained" style={[_Theme.themeBouton]}>
                Annuler
              </Button>
              <Button mode="contained" style={[_Theme.themeBouton]} onPress={createEvent}>
                Creer
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
      <View style={[styles.header,_Theme.themeBack,_Theme.themeShadow]}>
        <IconButton
          icon="cog"
          iconColor={_Theme.themeIcon.color}
          onPress={() => router.push("/../settings")}
          style={styles.settings}
        />
        <Text style={[styles.headerText,_Theme.themeText]}>Logo</Text>
        <Avatar
          size={48}
          rounded
          icon={{ name: "person", type: "material" }}
          containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 15, right: 15 }}
          onPress={() => router.push("/../profile")}
        />
      </View>
      {!isLoaded?<View   style={[{    flex: 1,      justifyContent: 'center',},_Theme.themeBack2]} ><ActivityIndicator style={_Theme.themeBack2} animating={true} color={_Theme.themeBouton.backgroundColor} size='large'></ActivityIndicator></View>:
      <ScrollView 
        
        style={[{ paddingBottom: 40 },_Theme.themeBack2]}
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
    top: 10,
    color: 'black',
    fontSize: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  settings: {
    position: 'absolute', 
    bottom: 10, 
    left: 10,
  },
  centeredView: {
    width:"100%",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  horizontal: {
    alignItems:'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,

  },
  modalView: {
    width:"80%",
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});