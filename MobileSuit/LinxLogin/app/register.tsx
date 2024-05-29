import React , {useState,useEffect} from 'react';
import {Link, useRouter} from 'expo-router'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { Input,Icon,Button } from 'react-native-elements';
import {Image,Text} from 'react-native'
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '@/constants/type';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const RegisterScreen = () => {
  const [show, setShow] = useState(false);

  const onChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const [err,setErr] = useState("")

  const [date, setDate] = useState(new Date());
  const [isdate,setisdate] = useState(0)
  const [password, onChangePassword] = useState('');
  const [email, onChangeEmail] = useState('');
  const [confirmPass, onChangeconfirmPass] = useState('');
  const [nom, onChangeNom] = useState('');
  const [prenom, onChangePrenom] = useState('');




  const [jwt,setJwt] = useState('');
  const [isjwt,setisjwt] = useState(-1)

  const [islogin,setLogin] = useState(-1)

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
    _retrieveData('jwt');
    console.log(jwt)
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

  useEffect(()=>{
    setisdate(isdate+1)
  },[date])

  const register = async() => {
    const url = 'http://172.20.10.3/register';
    const data = {
      email:email,
      password:password,
      firstName:prenom,
      lastName:nom,
      dateOfBirth:date.toDateString()
    }
    if(password == "" || confirmPass == "" || nom == "" || prenom == "" || email == "" || isdate <=1){
      setErr("Un des champs n'est pas rempli")
    }
    else{
      if(password == confirmPass){
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
        setErr("")
  
        //_storeData('jwt',heads?heads.substring(4,heads.length):'')
  
        console.log(jwt)
        if(jwt != ''){
          console.log("ok")
          
        }
      }
      else{
        setErr("Mots de passes différents")
      }
    }
    
  }

 
  return (
    
    <KeyboardAvoidingView
      style={styles.view}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >


        <Input
            placeholder='Prénom'
            onChangeText={onChangePrenom}
            leftIconContainerStyle={{
                marginRight:5
            }}
            leftIcon={<Icon
            name='user'
            size={24}
            type='font-awesome'
            color='black'
            />}
        />

       <Input
            placeholder='Nom'
            leftIconContainerStyle={{
                marginRight:5
            }}
            onChangeText={onChangeNom}
            leftIcon={<Icon
            name='user'
            size={24}
            type='font-awesome'
            color='black'
            />}
        />
        <Input
            placeholder='Date de naissance'
            leftIconContainerStyle={{
                marginRight:5
            }}
            onPress={showDatepicker}
            value={isdate>1?date.toDateString():""}
          
            leftIcon={<Icon
            name='user'
            size={24}
            type='font-awesome'
            color='black'
            />}
        />

   
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

        <Input
            placeholder='Email'
            onChangeText={onChangeEmail}
            leftIconContainerStyle={{
                marginRight:5
            }}
            leftIcon={<Icon
                name='user'
                size={24}
                type='font-awesome'
                color='black'
            />}
        />

        <Input
            secureTextEntry={true} 
            placeholder='Mot de passe'
            onChangeText={onChangePassword}
            leftIconContainerStyle={{
                marginRight:5
            }}
            leftIcon={
                <Icon
                name='unlock'
                size={24}
                type='feather'
                color='black'
                />
            }
        />
        <Input
            secureTextEntry={true} 
            placeholder='Confirmation du mot de passe'
            onChangeText={onChangeconfirmPass}
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
      title="Inscription"
      type="solid"
      onPress={register}
    />
    <View style={styles.horizontal}>
      <Text>Déjà membre ?</Text>
      <Link style={styles.link} href='..'> Connectez-vous </Link>
    </View>
    <Text style={{color:'red'}}> {err}</Text>
    
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

export default RegisterScreen;