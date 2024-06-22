import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, IconButton, List, Modal, PaperProvider, Portal, } from 'react-native-paper';
import { router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import Theme from '@/constants/Theme';
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import Config from '../../config.json'
import { jwtDecode } from 'jwt-decode';
import { user } from '@/constants/user';
import { evenement } from "@/constants/evenement";

const Tab = createMaterialTopTabNavigator();

const { width } = Dimensions.get('window')

const HEADER_HEIGHT = 200;

function Informations(id: any) {

  const _Theme = Theme()

  const [TastesView,setTastesView] = useState<React.JSX.Element[]>([])
  const activities = [
    'Cinéma', 'Attractions', 'Animaux', 'Théâtre', 'Danse',
    'Manga/Anime', 'Séries', 'Échecs', 'Moto', 'Lecture',
    'Jeux vidéos', 'Musique', 'BD/Comics', 'Voyager', 'Musées',
    'Sortir entre amis', 'Sport', 'Nourriture', 'La mode'
  ];

  const [text,setText] = useState("")
  const [checkedState, setCheckedState] = useState(
    activities.reduce((acc:any, activity) => {
      acc[activity] = false;
      return acc;
    }, {})
  );

  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const friendInfosReq = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getFriendInfos`, {email:id.route.params.id}, {headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      
      

      let tmp:any = []
      for(let i = 0; i <activities.length; i++){
        friendInfosReq.data.activities.includes(activities[i])?tmp[activities[i]] = true:tmp[activities[i]] = false
      }
      setCheckedState(tmp)

      setText(friendInfosReq.data.description)
    }
    wrap()
  },[])



  useEffect(() => {
      let tmpview = []
      for(let i=0; i<activities.length; i++){
        if(checkedState[activities[i]] == true) {
          tmpview.push(<View style={[{borderRadius: 20, padding: 10, margin: 5}, _Theme.themeBackMessage]}><Text style={_Theme.themeText}>{activities[i]}</Text></View>)
        }
      }

      setTastesView(tmpview)
    
  }, [checkedState])

  return (
    <View style={[{flex: 1}, _Theme.themeBack2]}>
      <ScrollView contentContainerStyle={{ alignItems: 'center'}}>
        <Text style={[_Theme.themeText, {margin: 10}]}>{text}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 10, justifyContent: 'center'}}>
          {TastesView}
        </View>
      </ScrollView>
    </View>
  );
}


function Evenements(id: any) {
  const _Theme = Theme()
  
  const [events,setEvents] = useState<evenement[]>([])
  const [eventPastComponent, setEventPastComponent] = useState<React.JSX.Element[]>([])
  const [allUsers,setAllUsers] = useState<user[]>([])

  useFocusEffect(
    useCallback(() => {
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const reponseEvents = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getEvents`,{email:id.route.params.id, bol:false},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setEvents(reponseEvents.data)
      const allUsers = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setAllUsers(allUsers.data)
    }
    wrap()
  },[]))

  useEffect(()=>{
    let tmp:React.JSX.Element[] = []
    if(events.length>0 && allUsers.length > 0){
      for(let i = 0; i<events.length;i++){
        const date = new Date(events[i].date)
        const today = new Date()
        const user: any = allUsers.find((re) => re.email = events[i].host)
        if(!(date.getDate() >= today.getDate() && date.getMonth() >= today.getMonth() && date.getFullYear() >= today.getFullYear())){
          tmp.push(
            <List.Item key={i} title={`${events[i].activity.title}` } description={`${events[i].date}`} style={{width: width*0.8}} titleStyle={{textAlign: 'center'}} left={() => <Avatar.Image size={80} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${user.image}`}} />  } />
          )
        }
        setEventPastComponent(tmp)
      }
    }
  },[events, allUsers])

  return (
    <View style={[{flex: 1}, _Theme.themeBack2]}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {eventPastComponent}
      </ScrollView>
    </View>
  );
}

function Friends(id: any) {
  const _Theme = Theme()
  
  const [friendList,setFriendList] = useState<user[]>([])
  const [friendListComp,setFriendListComp] = useState<React.JSX.Element[]>([])

  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const friendListReq = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getFriendList`,{email:id.route.params.id, bol:false}, {headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setFriendList(friendListReq.data)
    }
    wrap()
  },[])

  useEffect(()=>{
    const wrap = async()=>{
      if(friendList.length>0){
        const jwt = await AsyncStorage.getItem("jwt")
        const myEmail: any = jwtDecode(jwt?jwt:"")
        let tmpcomp = []
        for (let i=0; i< friendList.length; i++){
          tmpcomp.push(<List.Item key={i} title={`${friendList[i].firstName} ${friendList[i].lastName}` } style={{width: width*0.8}} titleStyle={{textAlign: 'center'}} onPress={() => {friendList[i].email==myEmail.email ? router.push('profile') : router.push(`friends/${friendList[i].email}`)}}  left={() => <Avatar.Image size={80} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${friendList[i].image}`}} />  } />)
        }
        setFriendListComp(tmpcomp)
      }
    }
    wrap()
  },[friendList])

  return (
    <View style={[{flex: 1}, _Theme.themeBack2]}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <List.Section>
          {friendListComp}
        </List.Section>
      </ScrollView>
    </View>
  );
}

export default function FriendScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [profilePic, setProfilFic] = useState("");
  const [colorBack,setColorBack] = useState("")
  const [realColor, setRealColor] = useState("")
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [iconColor, setIconColor] = useState('#FFFFFF')

  const _Theme = Theme()

  const { id } = useLocalSearchParams();

  const router = useRouter();
  
  const [friendInfos, setFriendInfos] = useState<user>({
    firstName:"",
    lastName:"",
    dateOfBirth:"",
    email:"",
    image:"",
    friends:[],
    friendRequests:[]
  })

  const [myFriends, setMyFriends] = useState<string[]>([])
  const [myEmail, setMyEmail] = useState("")
  const [allUsers,setAllUsers] = useState<user[]>([])

  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const friendInfosReq = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getFriendInfos`, {email:id}, {headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      const reponseColor = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getColor`,{email:id,bol:false},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setColorBack(reponseColor.data)
      setProfilFic(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${friendInfosReq.data.image}`)
      setFriendInfos(friendInfosReq.data)
      const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setMyFriends(reponse.data.friends)
      setMyEmail(reponse.data.email)
      const allUsers = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setAllUsers(allUsers.data)
    }
    wrap()
  },[])

  const sendFriendRequest = async()=>{
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const request = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/friendRequests`,{email:id}, {headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    const allUsers = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    setAllUsers(allUsers.data)
  }

  useEffect(()=>{
    setRealColor(hextoRgb(colorBack,0.5))
    setTextColor(isColorLight(colorBack) ? 'black' : 'white')
    setIconColor(isColorLight(colorBack) ? '#171717' : '#efefef')
  },[colorBack])

  function hextoRgb(color:string,opacity:number){
    let hex = color;
    let r = parseInt(hex[1]+hex[2], 16);
    let g = parseInt(hex[3]+hex[4], 16);
    let b = parseInt(hex[5]+hex[6], 16);
    return `rgba(${r},${g},${b},${opacity})`
  }

  function getBrightness (color: string) {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  };
  
  function isColorLight (color: string) {
    return getBrightness(color) > 0.5;
  };

  return (
    <PaperProvider>
      <View style={[styles.header, {backgroundColor:realColor,shadowColor:realColor,shadowOpacity:0.7, shadowRadius:40}]}>
        <IconButton
            icon="arrow-left"
            iconColor={iconColor}
            onPress={() => router.push('profile')}
            style={styles.buttonBack}
        />
        {(myFriends.includes(typeof(id)=='string'?id:"") || allUsers.find((user:user)=>user.email==id)?.friendRequests.includes(myEmail))
          ? <></>
          : <IconButton 
            icon="account-plus"  
            iconColor={iconColor} 
            onPress={()=>{sendFriendRequest()}} 
            style={styles.buttonFriendRequest} 
          />
        }
        
        <TouchableOpacity onPress={()=>{setModalVisible(true)}}>
          <Avatar.Image size={80} source={{uri:profilePic}} />
        </TouchableOpacity>
      
        <Text style={[styles.headerText, {color: textColor}]}>{`${friendInfos.firstName} ${friendInfos.lastName}`}</Text>
      </View>
      <SafeAreaProvider>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: _Theme.themeText.color,
            tabBarLabelStyle: { fontSize: 12 },
            tabBarStyle: { backgroundColor: _Theme.themeBack.backgroundColor },
            tabBarIndicatorStyle: {backgroundColor: colorBack}
          }}
        >
          <Tab.Screen name="Informations" component={Informations} initialParams={{id: id}} />
          <Tab.Screen name="Evènements" component={Evenements} initialParams={{id: id}} />
          <Tab.Screen name="Amis" component={Friends} initialParams={{id: id}} />
        </Tab.Navigator>
      </SafeAreaProvider>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
          }}
          contentContainerStyle={[styles.popUp, _Theme.themeBack2]}
        >
          <IconButton
            icon="arrow-left"
            iconColor={_Theme.themeIcon.color}
            onPress={() => {setModalVisible(!modalVisible)}}
            style={styles.buttonClose}
          />
          <Avatar.Image size={300}style={{marginVertical:30}} source={{uri:profilePic}} />
        </Modal>
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  buttonBack: {
    position: 'absolute',
    top: 30,
    left: 10,
  },
  buttonFriendRequest: {
    position: 'absolute',
    top: 30,
    right: 10,
  },
  headerText: {
    top: 24,
    color: 'black',
    fontSize: 20,
  },
  popUp: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  buttonClose: {
    position: 'absolute',
    top: 30,
    left: 10,
  },
  body: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonContainer: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'relative',
  },
});