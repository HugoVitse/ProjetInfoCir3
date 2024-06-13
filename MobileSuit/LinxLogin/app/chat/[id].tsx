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

const { width } = Dimensions.get('window')

export default function SettingsScreen() {
  const { id } = useLocalSearchParams();
  console.log(id)

  const _Theme = Theme()

  const [message,setMessage] = useState([])
  const [messageComponent, setMessageComponent] = useState([])

  const [isFocused, setIsFocused] = useState(false);

  const theme = {
    roundness:5,
    color:{
      shadow:150
    }
  }

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const reponseMessage = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getMessage`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setMessage(reponseMessage.data)
    }
    wrap()
  },[])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }
    }, 200)
    setIsFocused(false)
  }, [isFocused]);


  // useEffect(()=>{
  //   let messages = []
  //   if(message.length>0){
  //     for(let i = 0; i<message.length;i++){
  //       messages.push(
  //         <View style={{flexDirection: 'row', marginVertical: 5, marginTop: (i-1 == -1 ? 20 : (message[i-1].autor == message[i].autor ? 0 : 20)), alignSelf: (message[i].autor == jwt.autor ? 'flex-end' : 'flex-start')}}>
  //           {i-1 == -1 ? <Avatar.Image size={30} source={{uri:'../assets/images/avatar.png'}} /> : (message[i-1].autor == message[i].autor ? <></> : <Avatar.Image size={30} source={{uri:'../assets/images/avatar.png'}} />)}
  //           <Text style={[styles.messages, (message[i].autor == jwt.autor ? _Theme.themeBackMyMessage : _Theme.themeBackMessage), _Theme.themeText, (i-1 == -1 ? {} : (message[i-1].autor == message[i].autor ? (message[i].autor == jwt.autor ? {marginRight: 40} : {marginLeft: 40}) : {}))]}>{message[i].text}</Text>
  //         </View>
  //       )
  //     }
  //   }

  //   setMessageComponent(messages)

  // },[message])


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
        <View style={{flexDirection: 'row', marginTop: 20, marginVertical: 5, alignSelf: 'flex-start'}}>
          <Avatar.Image size={30} source={{uri:'../assets/images/avatar.png'}} />
          <Text style={[styles.messages, _Theme.themeBackMessage, _Theme.themeText]}>Bonjour je m'appelle Benjamin je suis une carotte et j'aime les endives bien cuites aux petits ognions à la poele et les crustacés. Mais ce que j'aime par dessus tout ce sont les molusques cuits au barbecue. {id}</Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 20, marginVertical: 5, alignSelf: 'flex-end'}}>
          <Text style={[styles.messages, _Theme.themeBackMyMessage, _Theme.themeText]}>Bonjour je m'appelle Benjamin je suis une carotte et j'aime les endives bien cuites aux petits ognions à la poele et les crustacés. Mais ce que j'aime par dessus tout ce sont les molusques cuits au barbecue.</Text>
          <Avatar.Image size={30} source={{uri:'../assets/images/avatar.png'}} />
        </View>
        <View style={{flexDirection: 'row', marginTop: 0, marginVertical: 5, alignSelf: 'flex-end'}}>
          <Text style={[styles.messages, _Theme.themeBackMyMessage, _Theme.themeText, {marginRight: 40}]}>Bonjour je m'appelle Benjamin je suis une carotte et j'aime les endives bien cuites aux petits ognions à la poele et les crustacés. Mais ce que j'aime par dessus tout ce sont les molusques cuits au barbecue.</Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 20, marginVertical: 5, alignSelf: 'flex-start'}}>
          <Avatar.Image size={30} source={{uri:'../assets/images/avatar.png'}} />
          <Text style={[styles.messages, _Theme.themeBackMessage, _Theme.themeText]}>Bonjour je m'appelle Benjamin je suis une carotte et j'aime les endives bien cuites aux petits ognions à la poele et les crustacés. Mais ce que j'aime par dessus tout ce sont les molusques cuits au barbecue.</Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 0, marginVertical: 5, alignSelf: 'flex-start'}}>
          <Text style={[styles.messages, _Theme.themeBackMessage, _Theme.themeText, {marginLeft: 40}]}>Bonjour je m'appelle Benjamin je suis une carotte et j'aime les endives bien cuites aux petits ognions à la poele et les crustacés. Mais ce que j'aime par dessus tout ce sont les molusques cuits au barbecue.</Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 20, marginVertical: 5, alignSelf: 'flex-start'}}>
          <Avatar.Image size={30} source={{uri:'../assets/images/avatar.png'}} />
          <Text style={[styles.messages, _Theme.themeBackMessage, _Theme.themeText]}>Bonjour je m'appelle Benjamin je suis une carotte et j'aime les endives bien cuites aux petits ognions à la poele et les crustacés. Mais ce que j'aime par dessus tout ce sont les molusques cuits au barbecue.</Text>
        </View>
      </ScrollView>
      <View style={[styles.writeMessage, _Theme.themeBack, _Theme.themeShadow]}>
        <TextInput
            outlineColor={_Theme.themeBouton.backgroundColor}
            activeOutlineColor={_Theme.themeBouton.backgroundColor}
            theme={theme}
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
            onPress={() => console.log('Pressed')}
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
    paddingVertical: 5,
    width: (width*2)/3,
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
