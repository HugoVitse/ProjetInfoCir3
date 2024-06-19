import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, TouchableOpacity, Animated, Keyboard } from 'react-native';
import Theme from '@/constants/Theme';
import { Avatar, Drawer, IconButton, Portal, Provider, TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useCallback, useEffect, useRef, useState } from 'react';
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

type colorPseudo = {
  user:string,
  color:string
}



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
  const [allUsers, setAllUsers] = useState<user[]>([])
  const [int, setInt] = useState<NodeJS.Timeout>()
  const [myEmail, setMyEmail] = useState("")
  const [colorPseudos, setColorPseudos] = useState<colorPseudo[]>([])


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
  useFocusEffect( useCallback(()=>{
    
    wrap()

    const wrapAllUsers = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const jwt_decode:any = jwtDecode(jwt_cookie?jwt_cookie:"")
      setMyEmail(jwt_decode.email)
      const reponseUsers = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`, {headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setAllUsers(reponseUsers.data)

      const reponseMessage = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getMessage/${id}`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})

      const part = reponseMessage.data.participants
      let colors = []

      for(let i = 0; i<part.length;i++){
        const colori = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getColor`,{email:part[i]},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
        colors.push({
          user:part[i],
          color:colori.data
        })
      }

      setColorPseudos(colors)
    }
    wrapAllUsers()

    let _int = setInterval(()=>{
      wrap()    
    },1000)

    setInt(_int)

    return ()=>{clearInterval(_int)}
  },[]))


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

  const emailToName = (email:string)=>{

    const user = allUsers.find((user) => user.email == email)
    return (`${user?.firstName} ${user?.lastName}`)
  }

  const emailToPicture = (email:string)=>{

    const user = allUsers.find((user) => user.email == email)
    return (user?.image)
  }

  


  useEffect(()=>{
    if(message.length >0 && allUsers.length > 0){
      const wrap = async()=>{
        
          const jwt = await AsyncStorage.getItem("jwt")
          const decoded:user = jwtDecode(jwt?jwt:"")
          let messages = []
      
    
          for(let i = 0; i<message.length;i++){
            let b = decoded.email != message[i].author
            console.log(b)
            let user = allUsers.find((user) => user.email == message[i].author)

           
            let color = colorPseudos.find((color) => color.user == message[i].author)?.color
           
        
            // const colors = await ImageColors.getColors(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${message[i].author}.png`)
            
            let tmp;
    
            messages.push(
              <View style={{flexDirection: 'row', marginVertical: 5, marginTop: (i-1 == -1 ? 20 : (message[i-1].author == message[i].author ? 0 : 20)), alignSelf: (message[i].author == decoded.email ? 'flex-end' : 'flex-start')}}>
                { ( b && ( ((i-1 > 0) && (message[i-1].author != message[i].author))  || (i-1 < 0) )) ?  ( <TouchableOpacity onPress={()=>{clearInterval(int);router.push(`friends/${message[i].author}`)}}><Avatar.Image size={30} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${user?.image}`}} /></TouchableOpacity>):<></>}
                <View style={[styles.messages, (message[i].author == decoded.email ? _Theme.themeBackMyMessage : _Theme.themeBackMessage), (i-1 == -1 ? {} : (message[i-1].author == message[i].author ? (message[i].author == decoded.email ? {marginRight: 40} : {marginLeft: 40}) : {}))]}><Text style={[{marginBottom:5, color:color,fontWeight:'bold', textShadowColor:"black", textShadowRadius:1.9, textShadowOffset:{width:0,height:0.3}}]}>{user?user.firstName:""}</Text><Text style={ _Theme.themeText}>{message[i].message}</Text></View>
                { ( !b && ( ((i-1 > 0) && (message[i-1].author != message[i].author) ) || (i-1 < 0)) ) ?  ( <TouchableOpacity onPress={()=>{clearInterval(int);router.push(`friends/${message[i].author}`)}}><Avatar.Image size={30} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${user?.image}`}} /></TouchableOpacity>):<></>}
              </View>
            )
          }
          
      
    
          setMessageComponent(messages)
        }
      
      wrap()
    
    }


  },[message,allUsers])





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
                                label={emailToName(participant)}
                                right={() => <TouchableOpacity onPress={()=>{router.push(participant==myEmail?'profile':`friends/${participant}`)}}><Avatar.Image size={30} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${emailToPicture(participant)}`}} /></TouchableOpacity>}
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
  outline: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'white', // Couleur du texte intérieur
  },
  outlineText: {
    position: 'absolute',
    textAlign: 'center',
    color: 'black', // Couleur du contour
    // Définissez ici d'autres styles pour le contour (par exemple, borderWidth, borderColor, textShadowColor, etc.)
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
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
