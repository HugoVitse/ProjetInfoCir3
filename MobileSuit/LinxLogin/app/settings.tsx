import { Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import Theme from '@/constants/Theme';
import { useEffect, useState } from 'react';
import axios from 'axios'
import Config from '../config.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, IconButton, List } from 'react-native-paper';

const HEADER_HEIGHT = 100

export default function SettingsScreen() {
  const _Theme = Theme()
  const [friendRequests, setFriendRequests] = useState([])
  const [friendRequestListComp, setFriendRequestListComp] = useState<React.JSX.Element[]>([])

  const router = useRouter()

  const acceptFriendRequest  = async(email:string)=>{

    const data  = {
      email:email
    }

    const jwt = await AsyncStorage.getItem("jwt")
    
    const rep = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/acceptFriendRequest`,data,{headers:{Cookie:`jwt=${jwt}`},withCredentials:false})
    const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt}`},withCredentials:false})
    setFriendRequests(response.data.friendRequests)

  }

  useEffect(() => {
    const wrap = async()=>{
      const jwt = await AsyncStorage.getItem("jwt")
      const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt}`},withCredentials:false})
      setFriendRequests(response.data.friendRequests)
      console.log(response.data.friendRequests)
    }
    wrap()
    
  },[])

  useEffect(()=>{
    if(friendRequests.length>0){
      let tmp = []
      for(let i=0; i<friendRequests.length;i++){
        tmp.push(
          <List.Item right={()=> <IconButton icon="account-plus"  iconColor={_Theme.themeIcon.color}    onPress={()=>{acceptFriendRequest(friendRequests[i])}}     style={{top:10}} ></IconButton>}  title={`${friendRequests[i]}` }  left={() => <Avatar.Image size={70} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${friendRequests[i]}.png`}} />} />
        )
      }

      setFriendRequestListComp(tmp)
    }
    else{
      setFriendRequestListComp([])
    }
  },[friendRequests])

  return (
    <>
    <View style={[styles.header,_Theme.themeBack,_Theme.themeShadow]}>
        <IconButton
          icon={"arrow-left"}
          iconColor={_Theme.themeIcon.color}
          onPress={() => {router.push("..")}}
          style={styles.back}
        />
        
      </View>
    <View style={[styles.container, _Theme.themeBack2]}>
      <List.Section>
        {friendRequestListComp}
      </List.Section>
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
  back: {
    position: 'absolute', 
    bottom: 10, 
    left: 10,
  },
});
