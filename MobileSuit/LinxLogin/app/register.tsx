import React , {useState,useEffect} from 'react';
import {Link, useRouter} from 'expo-router'
import { ImageBackground,Platform,StyleSheet, View } from 'react-native';
import {TextInput,Button} from 'react-native-paper'
import {Image,Text} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';;
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Config from '../config.json'
import Theme from '@/constants/Theme';

const RegisterScreen = () => {
  const [show, setShow] = useState(false);
  const [showDate,setShowDate] = useState(false)

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

  const _Theme = Theme()



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
    setisdate(isdate+1)
  },[date])

  const image = _Theme.Logo
  const register = async() => {
    const url = `${Config.scheme}://${Config.urlapi}:${Config.portapi}/register`;
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
        router.push("/")
  
  
   
        if(jwt != ''){
                 
        }
      }
      else{
        setErr("Mots de passes différents")
      }
    }
    
  }

  return (
    <ImageBackground source={image} resizeMode="cover" style={{    flex: 1,      justifyContent: 'center',}} >
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollViewContent}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
    >
  
      <View style={styles.inner}>
       

        <Image
          source={_Theme.Logo}
          style={styles.image}
        />
      

        <TextInput
          outlineColor={_Theme.themeBouton.backgroundColor}
          activeOutlineColor={_Theme.themeBouton.backgroundColor}
          theme={theme}
          label="Prénom"
          placeholder='Entrez votre prénom...'
          left={<TextInput.Icon icon="account" />}
          mode='outlined'
          textColor={_Theme.themeText.color}
          style={[styles.input,_Theme.themeBack2]}
          onChangeText={onChangePrenom}
        />
        <TextInput
          outlineColor={_Theme.themeBouton.backgroundColor}
          activeOutlineColor={_Theme.themeBouton.backgroundColor}
          theme={theme}
          label="Nom"
          placeholder='Entrez votre nom...'
          left={<TextInput.Icon icon="account-outline" />}
          mode='outlined'
          textColor={_Theme.themeText.color}
          style={[styles.input,_Theme.themeBack2]}
          onChangeText={onChangeNom}
        />
       
        <TextInput
          outlineColor={_Theme.themeBouton.backgroundColor}
          activeOutlineColor={_Theme.themeBouton.backgroundColor}
          theme={theme}
          label="Date de naissance"
          placeholder='Entrez votre date de naissance...'
          left={<TextInput.Icon icon="calendar" />}
          mode='outlined'
          textColor={_Theme.themeText.color}
          style={[styles.input,_Theme.themeBack2]}
          value={isdate>1?date.toDateString():""}
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
          outlineColor={_Theme.themeBouton.backgroundColor}
          activeOutlineColor={_Theme.themeBouton.backgroundColor}
          theme={theme}
          label="Email"
          placeholder='Entrez votre email...'
          left={<TextInput.Icon icon="email" />}
          mode='outlined'
          textColor={_Theme.themeText.color}
          style={[styles.input,_Theme.themeBack2]}
          onChangeText={onChangeEmail}
        />

        <TextInput
          outlineColor={_Theme.themeBouton.backgroundColor}
          activeOutlineColor={_Theme.themeBouton.backgroundColor}
          theme={theme}
          secureTextEntry={true}
          label="Mot de passe"
          placeholder='Entrez votre mot de passe...'
          left={<TextInput.Icon icon="lock-open" />}
          mode='outlined'
          textColor={_Theme.themeText.color}
          style={[styles.input,_Theme.themeBack2]}
          onChangeText={onChangePassword}
        />
        <TextInput
          outlineColor={_Theme.themeBouton.backgroundColor}
          activeOutlineColor={_Theme.themeBouton.backgroundColor}
          theme={theme}
          secureTextEntry={true}
          label="Confirmation mot de passe"
          placeholder='Entrez à nouveau votre mot de passe...'
          left={<TextInput.Icon icon="lock" />}
          mode='outlined'
          textColor={_Theme.themeText.color}
          style={[styles.input,_Theme.themeBack2]}
          onChangeText={onChangeconfirmPass}
        />

    <Button buttonColor={_Theme.themeBouton.backgroundColor} icon="account-check" mode='contained-tonal' onPress={register} style={{marginTop:10,width:200}}>
      Inscription
    </Button> 
    <View style={styles.horizontal}>
      <Text style={[_Theme.themeText]}>Déjà membre ?</Text>
      <Link style={[styles.link,{color:_Theme.themeBouton.backgroundColor}]} href='..'> Connectez-vous </Link>
    </View>
    <Text style={{color:'red'}}> {err}</Text>
   
    </View>

    </KeyboardAwareScrollView>
    </ImageBackground>
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
  inputContainer: {
    width: '90%', // Ajustez la largeur en fonction de vos préférences
    marginBottom: 24, // Espace après chaque champ de saisie
  },
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
    marginTop:50,
    width: 350,
    height: 115,
    transform:'scale(0.7)'
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  link:{
    color:"blue"
  },
});

export default RegisterScreen;