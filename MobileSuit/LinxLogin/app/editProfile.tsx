import { Link, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform,Image, Dimensions } from 'react-native';
import {Button ,HelperText,Icon,IconButton,TextInput} from 'react-native-paper'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios'
import Config from '../config.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {user} from '../constants/user'
import Theme from '@/constants/Theme';

const { width } = Dimensions.get('window')

export default function EditScreen() {

  const [show, setShow] = useState(false);
  const [showDate,setShowDate] = useState(false)
  const router = useRouter();
  const [error,setErr] = useState("")
  
  const [date, setDate] = useState(new Date());
  const [isdate,setisdate] = useState(0)
  const [password, onChangePassword] = useState('');
  const [email, onChangeEmail] = useState('');
  const [confirmPass, onChangeconfirmPass] = useState('');
  const [nom, onChangeNom] = useState('');
  const [prenom, onChangePrenom] = useState('');
  const [isPasswordHasBeenChanged, setIsPasswordHasBeenChanged] = useState(0)
  const [initialInfos, setInitialInfos] = useState<user>({
    firstName:"",
    lastName:"",
    dateOfBirth:"",
    email:"",
    image:"",
    friendRequests:[],
    friends:[]
  })

  const _Theme = Theme()
  
  const onChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const hideDatepicker = () => {
    if(!showDate) setShow(false);
  };
  const update = async() => {
    if(confirmPass!=password){
      setErr("Mots de passe différents")
      return
    }
    try{
      const data = {
        email:email,
        password:password,
        firstName:prenom,
        lastName:nom,
        dateOfBirth:date.toDateString(),
        passwordChanged:isPasswordHasBeenChanged>2
      }
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const reponse = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/updateInfos`,data,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      if(reponse.status == 200){
        const jwt_full = (reponse.headers['set-cookie'])?(reponse.headers['set-cookie'])[0]:""
        const jwt = jwt_full.substring(4,jwt_full.length)
        console.log(jwt)
        await AsyncStorage.setItem('jwt',jwt)
        setIsPasswordHasBeenChanged(1)
        router.push("/profile")
      }
    } 
    catch{
      setErr("Email déjà prit")      
    }
    
  }
  
  const reset = () => {
    onChangePrenom(initialInfos.firstName)
    onChangeEmail(initialInfos.email)
    onChangeNom(initialInfos.lastName)
    onChangePassword("not-real-password")
    onChangeconfirmPass("not-real-password")
    setDate(new Date(Date.parse(initialInfos.dateOfBirth)))
    setIsPasswordHasBeenChanged(1)
  }
  
  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setInitialInfos(reponse.data)
      onChangePrenom(reponse.data.firstName)
      onChangeEmail(reponse.data.email)
      onChangeNom(reponse.data.lastName)
      onChangePassword("not-real-password")
      onChangeconfirmPass("not-real-password")
      setDate(new Date(Date.parse(reponse.data.dateOfBirth)))
    }
  
    wrap()
  },[])

  useEffect(()=>{
    setIsPasswordHasBeenChanged(isPasswordHasBeenChanged+1)
  },[password])

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollViewContent}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
    >
      <View style={[styles.inner, _Theme.themeBack2]}>

        <Image
            source={require('../assets/images/edit.png')}
            style={styles.image}
          />
      <TextInput
          value={prenom}
          outlineColor={_Theme.themeBouton.color}
          activeOutlineColor={_Theme.themeBouton2.color}
          theme={theme}
          label="Prénom"
          placeholder='Entrez votre prénom...'
          left={<TextInput.Icon icon="account" color={_Theme.themeText.color} />}
          mode='outlined'
          style={[styles.input, _Theme.themeBack2]}
          textColor={_Theme.themeText.color}
          onChangeText={onChangePrenom}
        />
        <TextInput
          value={nom}
          outlineColor={_Theme.themeBouton.color}
          activeOutlineColor={_Theme.themeBouton2.color}
          theme={theme}
          label="Nom"
          placeholder='Entrez votre nom...'
          left={<TextInput.Icon icon="account-outline" color={_Theme.themeText.color} />}
          mode='outlined'
          style={[styles.input, _Theme.themeBack2]}
          textColor={_Theme.themeText.color}
          onChangeText={onChangeNom}
        />
       
        <TextInput
          outlineColor={_Theme.themeBouton.color}
          activeOutlineColor={_Theme.themeBouton2.color}
          theme={theme}
          label="Date de naissance"
          placeholder='Entrez votre date de naissance...'
          left={<TextInput.Icon icon="calendar" color={_Theme.themeText.color} />}
          mode='outlined'
          style={[styles.input, _Theme.themeBack2]}
          textColor={_Theme.themeText.color}
          value={isdate>1?date.toDateString():date.toDateString()}
          onFocus={showDatepicker}
          onBlur={hideDatepicker}
        />
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          onTouchStart={()=>{
            setShowDate(true)
          }}
          mode="date"
          style={_Theme.themeBack2}
          textColor={_Theme.themeText.color}
          display="default"
          onChange={onChange}
        />
      )}
        <TextInput
          value={email}
          outlineColor={_Theme.themeBouton.color}
          activeOutlineColor={_Theme.themeBouton2.color}
          theme={theme}
          label="Email"
          placeholder='Entrez votre email...'
          left={<TextInput.Icon icon="email" color={_Theme.themeText.color} />}
          mode='outlined'
          style={[styles.input, _Theme.themeBack2]}
          textColor={_Theme.themeText.color}
          onChangeText={onChangeEmail}
        />

        <TextInput
          value={password}
          outlineColor={_Theme.themeBouton.color}
          activeOutlineColor={_Theme.themeBouton2.color}
          theme={theme}
          secureTextEntry={true}
          label="Mot de passe"
          placeholder='Entrez votre nouveau mot de passe...'
          left={<TextInput.Icon icon="lock-open" color={_Theme.themeText.color} />}
          mode='outlined'
          style={[styles.input, _Theme.themeBack2]}
          textColor={_Theme.themeText.color}
          onChangeText={onChangePassword}
        />
        <TextInput
          value={confirmPass}
          outlineColor={_Theme.themeBouton.color}
          activeOutlineColor={_Theme.themeBouton2.color}
          theme={theme}
          secureTextEntry={true}
          label="Confirmation mot de passe"
          placeholder='Entrez à nouveau votre mot de passe...'
          left={<TextInput.Icon icon="lock" color={_Theme.themeText.color} />}
          mode='outlined'
          style={[styles.input, _Theme.themeBack2]}
          textColor={_Theme.themeText.color}
          onChangeText={onChangeconfirmPass}
        />
  
      <View>
        <HelperText type="error" visible={error.length>0}>
          {error}
        </HelperText>
      </View> 
      <View style={styles.horizontal}>
        <IconButton 
          icon="reload" 
          size={26} 
          containerColor={_Theme.themeBouton.backgroundColor} 
          iconColor={_Theme.themeBouton.color} mode='contained' 
          onPress={reset} 
          style={{width:"20%"}}
        /> 
        <Button buttonColor={_Theme.themeBouton.backgroundColor} textColor={_Theme.themeBouton.color} icon="account-check" mode='contained' onPress={update} style={{width:"60%"}}>
          Valider
        </Button> 
      </View>
    

    </View>
    </KeyboardAwareScrollView>
    
  );
  
};

const colorMain = '#99c3ff'
const theme = {
  roundness:15,
  color:{
    shadow:150
  }
}

const styles = StyleSheet.create({
  input: {
    width:350,
    margin:0,
    borderRadius:2,
    shadowOpacity:0.3,
    shadowRadius:3,
    shadowOffset:{
      height:5,
      width:5
    }
  },
  view:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    width: width - 100,
    zIndex: 5
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    padding: 44,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    marginTop:0,
    width: 350,
    height: 30,
    transform:'scale(0.7)'
  },
  inputContainer: {
    width: '90%', // Ajustez la largeur en fonction de vos préférences
    marginBottom: 24, // Espace après chaque champ de saisie
  },
  link:{
    color:"blue"
  }
});
