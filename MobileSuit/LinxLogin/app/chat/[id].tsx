import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, TouchableOpacity, Animated, Keyboard } from 'react-native';
import Theme from '@/constants/Theme';
import { Avatar, Drawer, IconButton, Portal, Provider, TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import Config from '../../config.json'
import { jwtDecode } from 'jwt-decode';
import { ScreenHeight } from '@rneui/base';
import { user } from '@/constants/user';
import {message} from '@/constants/message';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window')

const HEADER_HEIGHT = 100;
const drawerWidth = 75

export default function SettingsScreen() {
  const { id } = useLocalSearchParams();


  const _Theme = Theme()


  const [message,setMessage] = useState<message[]>([])
  const [messageComponent, setMessageComponent] = useState<React.JSX.Element[]>([])
  const [messageToSend, setMessageToSend] = useState('')
  const [isFocused, setIsFocused] = useState(false);
  const inputWidth =  useState(new Animated.Value(width))[0];
  const [scrollviewHeight, setScrollviewHeight] = useState(ScreenHeight-HEADER_HEIGHT-100)
  const [top, setTop] = useState(HEADER_HEIGHT)
  const [participants, setParticipants] = useState<string[]>([])
  const [KStop,setKStop] = useState(0)
  const rightDecal =  useState(new Animated.Value(-drawerWidth*4 - 10))[0];
  const [drawerDeployed, setDrawerDeployed] = useState(false)
  const [active, setActive] = useState('');

  const router = useRouter();

  const theme = {
    roundness:5,
    color:{
      shadow:150
    }
  }

  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef(null)

  const sendMessage = async()=>{
    if(messageToSend.length > 0){
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const reponseMessage = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/sendMessage`,{id:id,message:messageToSend},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setMessageToSend('')
      wrap()
    }
    
  
  }

  const wrap = async()=>{
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const reponseMessage = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getMessage/${id}`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    setMessage(reponseMessage.data.chat)
    setParticipants(reponseMessage.data.participants)
  }
  useEffect(()=>{
    
    wrap()

    let int = setInterval(()=>{
      wrap()    
    },1000)

    return ()=>{clearInterval(int)}
  },[router])


  const startAnimation = () => {
    Animated.timing(inputWidth, {
      toValue: width-80, // Move to -60
      duration: 300, // Animation duration in ms
      useNativeDriver: false, // 'left' is not supported by native driver
    }).start();
  };

  const endAnimation = () => {
    Animated.timing(inputWidth, {
        toValue: width, // Move to -60
        duration: 300, // Animation duration in ms
        useNativeDriver: false, // 'left' is not supported by native driver
      }).start();
  }

  const startAnimationDraw = () => {
    Animated.timing(rightDecal, {
      toValue: 0, // Move to -60
      duration: 400, // Animation duration in ms
      useNativeDriver: false, // 'left' is not supported by native driver
    }).start();
    setDrawerDeployed(true)
  };

  const endAnimationDraw = () => {
    Animated.timing(rightDecal, {
        toValue: -drawerWidth*4 - 10, // Move to -60
        duration: 400, // Animation duration in ms
        useNativeDriver: false, // 'left' is not supported by native driver
      }).start();
      setDrawerDeployed(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }
    }, 200)
    setIsFocused(false)
  }, [isFocused]);

  useEffect(()=>{
    if(messageToSend.length > 0){
      startAnimation()
    }
    else{
      endAnimation()
    }
  },[messageToSend])
  


  useEffect(()=>{
    if(message.length >0){
    const wrap = async()=>{
      
        const jwt = await AsyncStorage.getItem("jwt")
        const decoded:user = jwtDecode(jwt?jwt:"")
        let messages = []
     
        for(let i = 0; i<message.length;i++){
          let b = decoded.email != message[i].author
          

          messages.push(
            <View style={{flexDirection: 'row', marginVertical: 5, marginTop: (i-1 == -1 ? 20 : (message[i-1].author == message[i].author ? 0 : 20)), alignSelf: (message[i].author == decoded.email ? 'flex-end' : 'flex-start')}}>
              { !b ? <></>  : ( (i-1 == -1) ? (<Avatar.Image size={30} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${message[i].author}.png`}} /> ): ((message[i-1].author == message[i].author ? <></> : <Avatar.Image size={30} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${message[i].author}.png`}} />)))}
              <View style={[styles.messages, (message[i].author == decoded.email ? _Theme.themeBackMyMessage : _Theme.themeBackMessage), (i-1 == -1 ? {} : (message[i-1].author == message[i].author ? (message[i].author == decoded.email ? {marginRight: 40} : {marginLeft: 40}) : {}))]}><Text style={ _Theme.themeText}>{message[i].message}</Text></View>
              { b ? <></>  : ( (i-1 == -1) ? (<Avatar.Image size={30} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${message[i].author}.png`}} /> ): ((message[i-1].author == message[i].author ? <></> : <Avatar.Image size={30} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${message[i].author}.png`}} />)))}
            </View>
          )
        }
        
     
  
        setMessageComponent(messages)
      }
    
    wrap()
    setTimeout(()=>{
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }
    
    },200)
    }


  },[message])





  return (
    <>

    
    <View style={[styles.header,_Theme.themeBack,_Theme.themeShadow]}>
        <IconButton
          icon={"arrow-left"}
          iconColor={_Theme.themeIcon.color}
          onPress={() => {router.push("..")}}
          style={styles.back}
        />
        <IconButton
          icon={"account-multiple"}
          iconColor={_Theme.themeIcon.color}
          onPress={() => {drawerDeployed?endAnimationDraw():startAnimationDraw();setDrawerDeployed(!drawerDeployed)}}
          style={styles.list}
        />
      </View>
      
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.container, _Theme.themeBack2,{paddingTop:0}]}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={false}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
      keyboardShouldPersistTaps='always'
    >
    

      <View style={{height:scrollviewHeight,top:HEADER_HEIGHT-100}}>
        <ScrollView
          style={{width: width, flexDirection: 'column'}}
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 20}}
        >
          {messageComponent}
          
        </ScrollView>
      </View>
  
      <View style={[styles.writeMessage, _Theme.themeBack, _Theme.themeShadow,{}]}>
        <Animated.View style={{width:inputWidth}}>
        <TextInput
            ref={textInputRef}  
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
            onFocus={() => {setIsFocused(true), setScrollviewHeight(ScreenHeight-HEADER_HEIGHT-400)}}
            onBlur={() => {setIsFocused(false), setScrollviewHeight(ScreenHeight-HEADER_HEIGHT-100)}}
        />
        </Animated.View>
        <View style={{display:messageToSend.length > 0 ? 'flex' : 'none'}}>
        <IconButton
            mode={'contained'}
            style={{marginHorizontal: 20, backgroundColor: _Theme.themeBouton.backgroundColor}}
            icon="send"
            iconColor={'#efefef'}
            size={20}
            onPress={()=>sendMessage()}
        />
        </View>
      </View>
    </KeyboardAwareScrollView>
    
  
        <Animated.View style={{zIndex:4,position:'absolute',width:`${drawerWidth}%`,backgroundColor:_Theme.themeBack2.backgroundColor,height:ScreenHeight-40,top:HEADER_HEIGHT,right:rightDecal}}>
          <Drawer.Section title="Participants" theme={{colors: {onSurfaceVariant: _Theme.themeBouton2.color}}}>
                <ScrollView style={{height:"30%"}}>
                {
                      participants.map((participant,index) => {
                        return(
                            <Drawer.Item
                                key={index}
                                label={participant}
                                right={() => <Avatar.Image size={30} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${participant}.png`}} />}
                                active={active === index.toString()}
                                onPress={
                                    () => {

                                        endAnimationDraw()
            
                                    }
                                }
                            />
                        )
                    })
                }
                </ScrollView>
            </Drawer.Section>
          
        </Animated.View>
      

   
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: ScreenHeight+200,
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
    margin:10,
    borderRadius:2,
    shadowOpacity:0.3,
    shadowRadius:1,
    shadowOffset:{
      height:2,
      width:2
    }
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
  list: {
    position: 'absolute', 
    bottom: 10, 
    right: 10,
  }
});
