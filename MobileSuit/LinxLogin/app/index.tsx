import React , {useState,useEffect} from 'react';
import {Link, useRouter} from 'expo-router'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { Input,Icon } from 'react-native-elements';
import {Image,Text} from 'react-native'
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '@/constants/type';
import {TextInput,Button,ActivityIndicator, HelperText} from 'react-native-paper'
import Config from '../config.json'

const TextInputExample = () => {
  const [password, onChangePassword] = useState('');
  const [email, onChangeEmail] = useState('');
  const [jwt,setJwt] = useState('');
  const [isjwt,setisjwt] = useState(-1)
  const [tentativeLogin,setTentativeLogin] = useState(false)

  const [islogin,setLogin] = useState(-1)

  const [error,setError] = useState(false)
  
  const router = useRouter();

  const _storeData = async (key:string,data:string) => {
    try {
      await AsyncStorage.setItem(
        key,
        data,
      );
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  };


  const _retrieveData = async (key:string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        setJwt(value)
        setisjwt(1)
      }
      else{
        setisjwt(0)
      }
    } catch (error) {
      // Error retrieving data
    }
  };


  useEffect(() => {
    const wrap = async()=>{
      const jwt = await AsyncStorage.getItem("jwt");
      console.log(jwt)
      _retrieveData('jwt');
      console.log(jwt)
    }
    wrap()
  }, []);

  useEffect(()=>{
    if(jwt != ''){
      setLogin(1)
      router.push("(tabs)/home")
    }

  },[jwt])

  useEffect(()=>{
    if(isjwt==0){
      setLogin(0)
    }
  },[isjwt])

  useEffect(()=>{
    console.log(islogin)
  },[islogin])

  const login = async() => {
    setTentativeLogin(true)
    const url = `${Config.scheme}://${Config.urlapi}:${Config.portapi}/login`;
    const data = {
        email:email,
        password:password
    }
    
    // Await the response from the GET request
    
    const reponse = await fetch(url,{
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json',
      },
      body: JSON.stringify(data)
    },);
    console.log(reponse.status)
    if(reponse.status != 200){
      setError(true)
    }
    const heads = reponse.headers.get("set-cookie")
    console.log(heads)
    setJwt(heads?heads.substring(4,heads.length):'')

    await _storeData('jwt',heads?heads.substring(4,heads.length):'')

    const test = await AsyncStorage.getItem("jwt")
    console.log(test)
    console.log(jwt)
    if(jwt != ''){
      console.log("ok")
      
    }
    setTentativeLogin(false)
  }

  if(islogin == -1 || islogin == 1 || tentativeLogin){
    return(
       <View  style={{    flex: 1,      justifyContent: 'center',}} ><ActivityIndicator animating={true} color={colorMain} size='large'></ActivityIndicator></View>
    )
  }
  else{
  return (
    
    <KeyboardAvoidingView
      style={styles.view}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >



      <Image
        source={require('../assets/images/logo.png')}
        style={styles.image}
      />
      
     
           
      <TextInput
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
          outlineColor={colorMain}
          activeOutlineColor={colorMain}
          theme={theme}
          secureTextEntry={true}
          label="Mot de passe"
          placeholder='Entrez votre mot de passe...'
          left={<TextInput.Icon icon="lock-open" />}
          mode='outlined'
          style={styles.input}
          onChangeText={onChangePassword}
        />

        <View>
          <HelperText type="error" visible={error}>
            Adresse email ou mot de passe invalide
          </HelperText>
        </View>
 

      <Button buttonColor={colorMain} icon="login" mode='contained-tonal' onPress={login} style={{marginTop:10,width:200}}>
        Connexion
      </Button> 
      
    <View style={styles.horizontal}>
      <Text>Pas encore membre ?</Text>
      <Link style={styles.link}  href="register"> Inscrivez-vous </Link>
    </View>

    
    </KeyboardAvoidingView>
    
  );
  }
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
    margin:10,
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
  image: {
    marginBottom:50,
    width: 350,
    height: 115,
  },
  link:{
    color:"blue"
  }
});

export default TextInputExample;