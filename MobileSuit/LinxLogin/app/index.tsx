import React , {useState,useEffect} from 'react';
import {Link} from 'expo-router'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { Input,Icon,Button } from 'react-native-elements';
import {Image,Text} from 'react-native'
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '@/constants/type';

const TextInputExample = () => {
  const [password, onChangepPassword] = useState('');
  const [email, onChangeEmail] = useState('');
  const [jwt,setJwt] = useState('');
  const [isjwt,setisjwt] = useState(-1)

  const [islogin,setLogin] = useState(-1)

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
    _retrieveData('jwt');
    console.log(jwt)
  }, []);

  useEffect(()=>{
    if(jwt != ''){
      setLogin(1)
      navigation.navigate("accueil")
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
    const url = 'http://172.20.10.3/login';
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
    const heads = reponse.headers.get("set-cookie")
    setJwt(heads?heads.substring(4,heads.length):'')

    _storeData('jwt',heads?heads.substring(4,heads.length):'')

    console.log(jwt)
    if(jwt != ''){
      console.log("ok")
      
    }
  }

  if(islogin == -1 || islogin == 1){
    return(
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator />
        <ActivityIndicator size="large" />
        <ActivityIndicator size="small" color="#0000ff" />
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    )
  }
  else{
  return (
    
    <KeyboardAvoidingView
      style={styles.view}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >



      <Image
        source={require('../assets/images/Logo.png')}
        style={styles.image}
      />
      
     
           

      <Input
        placeholder='Email'
        onChangeText={onChangeEmail}
        leftIconContainerStyle={{
          marginRight:10
        }}
        leftIcon={<Icon
          name='user'
          size={24}
          type='font-awesome'
          color='black'
        />}
      />

      <Input
        placeholder='Mot de passe'
        onChangeText={onChangepPassword}
        leftIconContainerStyle={{
          marginRight:5
        }}
        leftIcon={
          <Icon
            name='lock'
            size={24}
            type='feather'
            color='black'
          />
        }
      />

    <Button
      buttonStyle={{
        width:350
      }}
      title="Connexion"
      type="solid"
      onPress={login}
    />
    <View style={styles.horizontal}>
      <Text>Pas encore membre ?</Text>
      <Link style={styles.link}  href="register"> Inscrivez-vous </Link>
    </View>
    
    </KeyboardAvoidingView>
    
  );
  }
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
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