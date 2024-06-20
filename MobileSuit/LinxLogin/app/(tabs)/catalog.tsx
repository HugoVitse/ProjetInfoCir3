import { Avatar } from "@rneui/themed";
import { useFocusEffect, useRouter } from "expo-router";
import { Text, View, StyleSheet, Dimensions,Modal,Image, Platform, useColorScheme } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton,MD3Colors, Card, Button, ActivityIndicator, PaperProvider, Portal ,TextInput} from "react-native-paper";
import React, { useState , useEffect, useCallback } from "react";
import axios from 'axios'
import Config from '../../config.json'
import {activitie} from '../../constants/activities'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Theme from "../../constants/Theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {Picker} from '@react-native-picker/picker';

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
  const [picture,setPicture] = useState("")
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState();
  const [notif,setNotif] = useState(false)
  const [showAndroid, setshowAndroid] = useState(false)
  const [dol,setTheme] = useState(useColorScheme())


  const onChange = (event:any, selectedDate:any) => {
    setshowAndroid(false)
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const _Theme = Theme();

  const types = [
    'Cinéma', 'Attractions', 'Animaux', 'Théâtre', 'Danse',
    'Manga/Anime', 'Séries', 'Échecs', 'Moto', 'Lecture',
    'Jeux vidéos', 'Musique', 'BD/Comics', 'Voyager', 'Musées',
    'Sortir entre amis', 'Sport', 'Nourriture', 'La mode'
  ];

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
      type:type,
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

  useFocusEffect(
    useCallback(()=>{
      const getActivities = async() => {
        const jwt_cookie = await AsyncStorage.getItem("jwt")
        const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
        setPicture("")
        setPicture(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${reponse.data.image}`)
        setNotif(reponse.data.friendRequests.length>0)
        const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/activities`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
        setActivities(response.data)
        setIsLoaded(true)
        
      }
      getActivities()
  } ,[]))

  useEffect(()=>{
    console.log(modalVisible)
  },[modalVisible])

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
                                <Button mode={'contained'} style={_Theme.themeBouton} textColor={_Theme.themeBouton.color} onPress={()=>{setModalVisible(!modalVisible);setActualIndex(i)}} >Créer un évènement</Button>
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
        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
          <View style={[styles.modalView, _Theme.themeBack2]}>
            <KeyboardAwareScrollView contentContainerStyle={styles.centeredView}>
          
            <Text style={[{fontWeight: 'bold', fontSize: 20}, styles.modalText, _Theme.themeText]}>{activities[actualIndex]?activities[actualIndex].name:""}</Text>
            <Text style={[styles.modalText, _Theme.themeText]}>{activities[actualIndex]?activities[actualIndex].description:""}</Text>
            <Image source={{uri:activities[actualIndex]?activities[actualIndex].image:""}} style={{width:"80%",height:"40%"}}></Image>
            <View style={[styles.horizontal, _Theme.themeBack2]}>
              <Text style={[{justifyContent:'center',alignItems:'center',flex:1},  _Theme.themeText]}>Nombre d'invités</Text>
              <TextInput
                outlineColor={_Theme.themeBouton.backgroundColor}
                activeOutlineColor={_Theme.themeBouton.backgroundColor}
                style={_Theme.themeBack2}
                label="Invités"
                mode="outlined"
                value={text}
                keyboardType = 'numeric'
                onChangeText={text => setText(text)}
              />
            </View>
            <View style={[_Theme.themeBack2,styles.horizontal]}>
              <Text style={[{justifyContent:'center',alignItems:'center',flex:1}, _Theme.themeText]}>Date de l'évènement</Text>
              {Platform.OS === 'ios' && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    onChange={onChange}
                  />)}
                  {Platform.OS === 'android' && (<>
                    <Button mode={'text'} onPress={()=>setshowAndroid(!showAndroid)} textColor={_Theme.themeText.color}>{date.toDateString()}</Button>
                    {showAndroid && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        onChange={onChange}
                      />
                    )}
                    </>
                  )}
             
            </View>
            <Text style={[{left:0,width:"100%",padding:10}, _Theme.themeText]}>Catégorie</Text>
            <Picker
              style={[{width:"100%",justifyContent:"center",height:Platform.OS=='ios'?200:40}, _Theme.themeBack2]}
              selectionColor={_Theme.themeText.color}
              itemStyle={_Theme.themeBack2}
              dropdownIconColor={_Theme.themeIcon.color}
              selectedValue={type}
              onValueChange={(itemValue, itemIndex) =>
                setType(itemValue)
              }>
              {types.map((type,index) => {
                return(
                  <Picker.Item key={index} label={type} value={type} color={_Theme.themeText.color} style={_Theme.themeBack2}/>
                )
              })}
            </Picker>
            <View style={{ width:'100%', justifyContent:'space-between',   padding:10,    flexDirection: 'row',}}>
              <Button onPress={()=>{setModalVisible(!modalVisible)}} mode="outlined" style={_Theme.themeBouton2} textColor={_Theme.themeBouton2.color}>
                Annuler
              </Button>
              <Button  mode="contained" style={_Theme.themeBouton} textColor={_Theme.themeBouton.color} onPress={createEvent}>
                Creer
              </Button>
            </View>

            </KeyboardAwareScrollView>
          </View>
        </View>
      </Modal>
      <View style={[styles.header,_Theme.themeBack,_Theme.themeShadow]}>
        <IconButton
          icon={notif?"bell-badge":"bell"}
          iconColor={_Theme.themeIcon.color}
          onPress={() => router.push("/../settings")}
          style={styles.settings}
        />
        <Image style={styles.logo} source={dol==='light'?require("../../assets/images/logo.png"):require("../../assets/images/logoWhite.png")}/>
        <Avatar
          size={48}
          rounded
          source={{ uri: picture }}
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
    paddingHorizontal:40,
    paddingVertical:70,
    height:"120%",
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
    width:"90%",
    maxHeight:"80%",
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0,
    justifyContent:'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    marginBottom:50,
    width: 150,
    transform:'scale(0.6)',
    top:40,
    height: 115,
  },
});