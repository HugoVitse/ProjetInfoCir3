import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import Theme from '@/constants/Theme';
import { Avatar, IconButton, TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import Config from '../../config.json'
import { jwtDecode } from 'jwt-decode';

const { width } = Dimensions.get('window')

export default function SettingsScreen() {
  const { id } = useLocalSearchParams();
  console.log(id)

  const _Theme = Theme()

  const [message,setMessage] = useState([])
  const [messageComponent, setMessageComponent] = useState([])
  const [messageToSend, setMessageToSend] = useState('')
  const [isFocused, setIsFocused] = useState(false);

  const theme = {
    roundness:5,
    color:{
      shadow:150
    }
  }

  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async()=>{
    console.log(messageToSend)
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const reponseMessage = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/sendMessage`,{id:id,message:messageToSend},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    setMessageToSend('')
    wrap()
    console.log(reponseMessage.data)
  
  }

  const wrap = async()=>{
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const reponseMessage = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getMessage/${id}`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    setMessage(reponseMessage.data)
    console.log(reponseMessage.data)
  }
  useEffect(()=>{
    
    wrap()

    setInterval(()=>{
      wrap()
    
    },5000)
  },[])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }
    }, 200)
    setIsFocused(false)
  }, [isFocused]);
  


  useEffect(()=>{
    const wrap = async()=>{
      if(message.length >0){
        const jwt = await AsyncStorage.getItem("jwt")
        const decoded = jwtDecode(jwt?jwt:"")
        let messages = []
        console.log(jwt)
  
        for(let i = 0; i<message.length;i++){
          let b = decoded.email != message[i].author
          console.log(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${message[i].author}`)
          console.log(b)
          messages.push(
            <View style={{flexDirection: 'row', marginVertical: 5, marginTop: (i-1 == -1 ? 20 : (message[i-1].author == message[i].author ? 0 : 20)), alignSelf: (message[i].author == decoded.email ? 'flex-end' : 'flex-start')}}>
              { !b ? <></>  : ( (i-1 == -1) ? (<Avatar.Image size={30} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${message[i].author}.png`}} /> ): ((message[i-1].author == message[i].author ? <></> : <Avatar.Image size={30} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${message[i].author}.png`}} />)))}
              <View style={[styles.messages, (message[i].author == decoded.email ? _Theme.themeBackMyMessage : _Theme.themeBackMessage), (i-1 == -1 ? {} : (message[i-1].author == message[i].author ? (message[i].author == decoded.email ? {marginRight: 40} : {marginLeft: 40}) : {}))]}><Text style={ _Theme.themeText}>{message[i].message}</Text></View>
              { b ? <></>  : ( (i-1 == -1) ? (<Avatar.Image size={30} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${message[i].author}.png`}} /> ): ((message[i-1].author == message[i].author ? <></> : <Avatar.Image size={30} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${message[i].author}.png`}} />)))}
            </View>
          )
        }
        
        console.log(messages)
  
        setMessageComponent(messages)
      }
    }
    wrap()


  },[message])


  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.container, _Theme.themeBack2]}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={false}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
    >
      <ScrollView
        style={{width: width, flexDirection: 'column'}}
        ref={scrollViewRef}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
      >
        {messageComponent}
        
      </ScrollView>
      <View style={[styles.writeMessage, _Theme.themeBack, _Theme.themeShadow]}>
        <TextInput
            outlineColor={_Theme.themeBouton.backgroundColor}
            activeOutlineColor={_Theme.themeBouton.backgroundColor}
            theme={theme}
            value={messageToSend}
            onChangeText={setMessageToSend}
            placeholder='Ecrivez votre message...'
            mode='outlined'
            style={[styles.input, _Theme.themeBack2, _Theme.themeShadow]}
            textColor={_Theme.themeText.color}
            onPress={() => setIsFocused(true)}
        />
        <IconButton
            mode={'contained'}
            style={{marginHorizontal: 20, backgroundColor: _Theme.themeBouton.backgroundColor}}
            icon="send"
            iconColor={'#efefef'}
            size={20}
            onPress={()=>sendMessage()}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messages:{
    flexDirection: 'column',
    marginHorizontal: 10,
    marginVertical: 1,
    paddingHorizontal: 10,
    paddingVertical: 11,
    maxWidth: (width*2)/3,
    borderRadius: 20,
  },
  writeMessage: {
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: width,
    height: 70,
    borderTopWidth: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    zIndex: 1,
  },
  input: {
    width: width - 100,
    margin:10,
    borderRadius:2,
    shadowOpacity:0.3,
    shadowRadius:1,
    shadowOffset:{
      height:2,
      width:2
    }
  },
});
