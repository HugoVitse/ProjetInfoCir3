import { useFocusEffect, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Dimensions,Image } from 'react-native';
import Theme from '@/constants/Theme';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios'
import Config from '../config.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton } from 'react-native-paper';
import { Button, ListItem } from '@rneui/base';
import { Avatar } from '@rneui/themed';
import { user } from '@/constants/user';

const HEADER_HEIGHT = 100


export default function NotificationsScreen() {
  const _Theme = Theme()
  const [friendRequests, setFriendRequests] = useState([])
  const [friendRequestListComp, setFriendRequestListComp] = useState<React.JSX.Element[]>([])
  const [allUsers, setAllUsers] = useState<user[]>([])

  const router = useRouter()

  const { width} = Dimensions.get('window')
  

  const denyFriendRequest  = async(email:string)=>{
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const r = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/denyFriendRequest`,{email:email},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    setFriendRequests(response.data.friendRequests)
  }
  const acceptFriendRequest  = async(email:string)=>{

    const data  = {
      email:email
    }

    const jwt = await AsyncStorage.getItem("jwt")
    
    const rep = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/acceptFriendRequest`,data,{headers:{Cookie:`jwt=${jwt}`},withCredentials:false})
    const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt}`},withCredentials:false})
    setFriendRequests(response.data.friendRequests)

  }

  useFocusEffect(useCallback(() => {
    const wrap = async()=>{
      const jwt = await AsyncStorage.getItem("jwt")
      const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt}`},withCredentials:false})
      setFriendRequests(response.data.friendRequests)
      const allUsers = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`,{headers:{Cookie:`jwt=${jwt}`},withCredentials:false})
      setAllUsers(allUsers.data)
    }
    wrap()
    
  },[]))

  useEffect(()=>{
    if(friendRequests.length>0 && allUsers.length>0){
      let tmp = []
      for(let i=0; i<friendRequests.length;i++){
        let user = allUsers.find((user)=>{return user.email==friendRequests[i]})
        tmp.push(
         
         
             <ListItem.Swipeable 
              containerStyle={[_Theme.themeBack,{width:width*0.8}]}
              key={i}  
              bottomDivider 
              style={[_Theme.themeBack2]}
              onPress={() => {}}
              leftContent={(reset) => (
                <Button
                  title="Supprimer"
                  onPress={() => {reset();denyFriendRequest(friendRequests[i])}}
                  icon={{ name: 'delete', color: 'white' }}
                  buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                />
              )}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Avatar title={"ok"} source={{ uri: `${Config.scheme}://${Config.urlapi}:${Config.portapi}/${user?.image}` }} />
                  <View>
                    <Text style={[_Theme.themeText,{marginLeft:10}]}> {`${user?.firstName} ${user?.lastName}`}</Text>
                    <Text style={[_Theme.themeName,{marginLeft:10,fontSize:11}]}> {`${user?.email}`}</Text>
                  </View>
                  
                </View>
                <IconButton icon="account-plus"  iconColor={_Theme.themeIcon.color}    onPress={()=>{acceptFriendRequest(friendRequests[i])}}     style={{right:0}} ></IconButton>
              </View>
            </ListItem.Swipeable>
    

        )
      }

      setFriendRequestListComp(tmp)
    }
    else{
      setFriendRequestListComp([])
    }
  },[friendRequests,allUsers])

  return (
    <>
    <View style={[styles.header,_Theme.themeBack,_Theme.themeShadow]}>
        <IconButton
          icon={"arrow-left"}
          iconColor={_Theme.themeIcon.color}
          onPress={() => {router.push("..")}}
          style={styles.back}
        />
        <Image style={styles.logo} source={_Theme.Logo}/>

        
      </View>
    <View style={[styles.container, _Theme.themeBack2,{height:"100%",width:"100%"}]}>
      {friendRequestListComp}
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  }, 
  logo: {
    marginBottom:50,
    width: 150,
    transform:'scale(0.6)',
    top:40,
    height: 115,
  },
  back: {
    position: 'absolute', 
    bottom: 10, 
    left: 10,
  },
});
