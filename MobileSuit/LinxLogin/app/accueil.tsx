import React , {useState,useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { Input,Icon,Button } from 'react-native-elements';
import {Text} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Accueil = () => {



  const logout = ()=>{
    try {
      AsyncStorage.setItem(
        'jwt',
        '',
      );
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  }



  return (
    <View style={[styles.container]}>
    <Text>accueil</Text>
        <Button
        buttonStyle={{
          width:350
        }}
        title="logout"
        type="solid"
        onPress={logout}
      />
    </View>
    
    
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
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Accueil;