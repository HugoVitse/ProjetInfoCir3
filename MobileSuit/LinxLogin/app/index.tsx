import React , {useState,useEffect} from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { Input,Icon,Button } from 'react-native-elements';
import {Text} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const TextInputExample = () => {
  const [password, onChangepPassword] = useState('');
  const [email, onChangeEmail] = useState('');
  const [jwt,setJwt] = useState('Connexion');

  

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
        console.log(value)
      }
    } catch (error) {
      // Error retrieving data
    }
  };


  useEffect(() => {
    _retrieveData('jwt');
    console.log(jwt)
  }, []);


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
    console.log(heads)
    setJwt(heads?heads.substring(4,heads.length):'')

    _storeData('jwt',heads?heads.substring(4,heads.length):'')
  }

  return (
    
    <KeyboardAvoidingView
      style={styles.view}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      
     
           

      <Input
        placeholder='  Email'
        onChangeText={onChangeEmail}
        leftIcon={<Icon
          name='user'
          size={24}
          type='font-awesome'
          color='black'
        />}
      />

      <Input
        placeholder='  Mot de passe'
        onChangeText={onChangepPassword}
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
      title={jwt}
      type="solid"
      onPress={login}
    />
    </KeyboardAvoidingView>
    
  );
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
  }
});

export default TextInputExample;