import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, IconButton, List, Modal, PaperProvider, Portal, } from 'react-native-paper';
import { Stack, router, useLocalSearchParams, useRouter } from 'expo-router';
import Theme from '@/constants/Theme';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import Config from '../../config.json'
import { jwtDecode } from 'jwt-decode';
import { user } from '@/constants/user';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import { View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, TouchableOpacity, Animated, Keyboard, SafeAreaView } from 'react-native';

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
    if(friendList.length>0){
      let tmpcomp = []
      for (let i=0; i< friendList.length; i++){
        tmpcomp.push(<List.Item key={i} title={`${friendList[i].firstName} ${friendList[i].lastName}` } onPress={() => {router.push(`friends/${friendList[i].email}`)}}  left={() => <Avatar.Image size={80} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${friendList[i].email}.png`}} />  } />)
      }
      setFriendListComp(tmpcomp)
    }
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

  return (
    <PaperProvider>
      <View style={[styles.header,_Theme.themeBack,_Theme.themeShadow]}>
        <IconButton
            icon="arrow-left"
            iconColor={_Theme.themeIcon.color}
            onPress={router.back}
            style={styles.buttonBack}
        />
        {(myFriends.includes(typeof(id)=='string'?id:"") || allUsers.find((user:user)=>user.email==id)?.friendRequests.includes(myEmail))
          ? <></>
          : <IconButton 
            icon="account-plus"  
            iconColor={_Theme.themeIcon.color} 
            onPress={()=>{sendFriendRequest()}} 
            style={styles.buttonFriendRequest} 
          />
        }
        
        <TouchableOpacity onPress={()=>{setModalVisible(true)}}>
          <Avatar.Image size={80} source={{uri:profilePic}} />
        </TouchableOpacity>
      
        <Text style={[styles.headerText, _Theme.themeText]}>{`${friendInfos.firstName} ${friendInfos.lastName}`}</Text>
      </View>
      <SafeAreaProvider>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: _Theme.themeText.color,
            tabBarLabelStyle: { fontSize: 12 },
            tabBarStyle: { backgroundColor: _Theme.themeBack.backgroundColor },
            tabBarIndicatorStyle: {backgroundColor: _Theme.themeBouton.backgroundColor}
          }}
        >
          <Tab.Screen name="Informations" component={Informations} initialParams={{id: id}} />
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