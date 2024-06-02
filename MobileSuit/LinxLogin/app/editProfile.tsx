import { Link, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform,Image } from 'react-native';
import {Button ,TextInput} from 'react-native-paper'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios'
import Config from '../config.json'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditScreen() {
  
  const [show, setShow] = useState(false);
  const [showDate,setShowDate] = useState(false)

  const [err,setErr] = useState("")
  
  const [date, setDate] = useState(new Date());
  const [isdate,setisdate] = useState(0)
  const [password, onChangePassword] = useState('');
  const [email, onChangeEmail] = useState('');
  const [confirmPass, onChangeconfirmPass] = useState('');
  const [nom, onChangeNom] = useState('');
  const [prenom, onChangePrenom] = useState('');
  
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
  const register = () => {

  }
  
  
  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      console.log(reponse.data)
      onChangePrenom(reponse.data.firstName)
      onChangeEmail(reponse.data.email)
      onChangeNom(reponse.data.lastName)
      onChangePassword("not-real-password")
      onChangeconfirmPass("not-real-password")
      setDate(new Date(Date.parse(reponse.data.dateOfBirth)))
    }
  
    wrap()
  },[])
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollViewContent}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
    >
      <View style={styles.inner}>

        <Image
            source={require('../assets/images/edit.png')}
            style={styles.image}
          />
      <TextInput
          value={prenom}
          outlineColor={colorMain}
          activeOutlineColor={colorMain}
          theme={theme}
          label="Prénom"
          placeholder='Entrez votre prénom...'
          left={<TextInput.Icon icon="account" />}
          mode='outlined'
          style={styles.input}
          onChangeText={onChangePrenom}
        />
        <TextInput
          value={nom}
          outlineColor={colorMain}
          activeOutlineColor={colorMain}
          theme={theme}
          label="Nom"
          placeholder='Entrez votre nom...'
          left={<TextInput.Icon icon="account-outline" />}
          mode='outlined'
          style={styles.input}
          onChangeText={onChangeNom}
        />
       
        <TextInput
          outlineColor={colorMain}
          activeOutlineColor={colorMain}
          theme={theme}
          label="Date de naissance"
          placeholder='Entrez votre date de naissance...'
          left={<TextInput.Icon icon="calendar" />}
          mode='outlined'
          style={styles.input}
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
          display="default"
          onChange={onChange}
        />
      )}
        <TextInput
          value={email}
          outlineColor={colorMain}
          activeOutlineColor={colorMain}
          theme={theme}
          label="Email"
          placeholder='Entrez votre email...'
          left={<TextInput.Icon icon="email" />}
          mode='outlined'
          style={styles.input}
          onChangeText={onChangeEmail}
        />

        <TextInput
          value={password}
          outlineColor={colorMain}
          activeOutlineColor={colorMain}
          theme={theme}
          secureTextEntry={true}
          label="Mot de passe"
          placeholder='Entrez votre nouveau mot de passe...'
          left={<TextInput.Icon icon="lock-open" />}
          mode='outlined'
          style={styles.input}
          onChangeText={onChangePassword}
        />
        <TextInput
          value={confirmPass}
          outlineColor={colorMain}
          activeOutlineColor={colorMain}
          theme={theme}
          secureTextEntry={true}
          label="Confirmation mot de passe"
          placeholder='Entrez à nouveau votre mot de passe...'
          left={<TextInput.Icon icon="lock" />}
          mode='outlined'
          style={styles.input}
          onChangeText={onChangeconfirmPass}
        />

    <Button buttonColor={colorMain} icon="account-check" mode='contained-tonal' onPress={register} style={{marginTop:10,width:200}}>
      Valider
    </Button> 

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
    backgroundColor:'white',
    width:350,
    margin:0,
    borderRadius:2,
    shadowColor:'black',
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
    justifyContent: 'space-around',
    padding: 10,

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
