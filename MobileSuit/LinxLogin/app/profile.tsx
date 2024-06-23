import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter, router } from "expo-router";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { Avatar, Checkbox, List, PaperProvider, Portal, RadioButton, Searchbar } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { IconButton,TextInput, Modal, Button, Dialog, HelperText, ActivityIndicator } from "react-native-paper";
import { useCameraPermissions } from 'expo-camera';
import axios from 'axios'
import Config from '../config.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { user } from "@/constants/user";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Theme from "@/constants/Theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Icon, ScreenHeight, Slider } from "@rneui/base";
import { jwtDecode } from "jwt-decode";

const HEADER_HEIGHT = 200;
const { width } = Dimensions.get('window');

const Tab = createMaterialTopTabNavigator();

function Informations(id: any) {

  const _Theme = Theme()

  const [TastesView,setTastesView] = useState<React.JSX.Element[]>([])
  const activities = [
    'Cinéma', 'Attractions', 'Animaux', 'Théâtre', 'Danse',
    'Manga/Anime', 'Séries', 'Échecs', 'Moto', 'Lecture',
    'Jeux vidéos', 'Musique', 'BD/Comics', 'Voyager', 'Musées',
    'Sortir entre amis', 'Sport', 'Nourriture', 'La mode'
  ];

  const [text,setText] = useState("")
  const [checkedState, setCheckedState] = useState(
    activities.reduce((acc:any, activity) => {
      acc[activity] = false;
      return acc;
    }, {})
  );

  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      
      let tmp:any = []
      for(let i = 0; i <activities.length; i++){
        reponse.data.activities.includes(activities[i])?tmp[activities[i]] = true:tmp[activities[i]] = false
      }
      setCheckedState(tmp)

      setText(reponse.data.description)
    }
    wrap()
  },[])



  useEffect(() => {
      let tmpview = []
      for(let i=0; i<activities.length; i++){
        if(checkedState[activities[i]] == true) {
          tmpview.push(<View style={[{borderRadius: 20, padding: 10, margin: 5}, _Theme.themeBackMessage]}><Text style={_Theme.themeText}>{activities[i]}</Text></View>)
        }
      }

      setTastesView(tmpview)
    
  }, [checkedState])

  return (
    <View style={[{flex: 1}, _Theme.themeBack2]}>
      <ScrollView contentContainerStyle={{ alignItems: 'center'}}>
        <Text style={[_Theme.themeText, {margin: 10}]}>{text}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: 10, justifyContent: 'center'}}>
          {TastesView}
        </View>
      </ScrollView>
    </View>
  );
}



function Friends() {
  const _Theme = Theme()
  
  const [friendList,setFriendList] = useState<user[]>([])
  const [friendListComp,setFriendListComp] = useState<React.JSX.Element[]>([])
  const [visibleDelete,setVisibleDelete] = useState(false)

  const [emailToDelete, setEmailToDelete] = useState("")
  
  const showDialogDelete = () => setVisibleDelete(true);

  const hideDialogDelete = () => setVisibleDelete(false);

  const deleteFriend = async() => {
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const friendListReq = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/deleteFriend`,{email:emailToDelete},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    setFriendList(friendListReq.data)
    hideDialogDelete()
  
  }
  

 

  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const friendListReq = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getFriendList`,{email:"",bol:true}, {headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setFriendList(friendListReq.data)
    }
    wrap()
  },[])

  useEffect(()=>{
    if(friendList.length>0){
      let tmpcomp = []
      for (let i=0; i< friendList.length; i++){
  
        tmpcomp.push(<List.Item key={i} title={`${friendList[i].firstName} ${friendList[i].lastName}` } onPress={() => {router.push(`friends/${friendList[i].email}`)}}  right={()=> <IconButton  icon="delete" iconColor={'red'}  onPress={()=>{setEmailToDelete(friendList[i].email);showDialogDelete()}}  style={{top:13}}/>} left={() => <Avatar.Image size={80} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${friendList[i].image}`}} />  } />)
      }
      setFriendListComp(tmpcomp)
    }
    else{
      setFriendListComp([<List.Item key={0} title="Aucun ami" />])
    }
  },[friendList])

  return (
    <View style={[{flex: 1}, _Theme.themeBack2]}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <List.Section>
          {friendListComp}
        </List.Section>
      </ScrollView>
      <Portal>
          <Dialog style={{backgroundColor: _Theme.themeBack2.backgroundColor}} visible={visibleDelete} onDismiss={hideDialogDelete}>
              
              <Dialog.Icon icon="alert" color={_Theme.themeIcon.color}/>
              <Dialog.Title style={[_Theme.themeText, {textAlign: 'center'}]}>Supprimer l'ami ?</Dialog.Title>
              <Dialog.Content>
                <Button  
                  buttonColor={_Theme.themeBouton.backgroundColor}
                  textColor={_Theme.themeBouton.color}
                  icon="logout" 
                  mode="contained" 
                  onPress={deleteFriend}
                >
                  Confirmer
                </Button>
              </Dialog.Content>
              <Dialog.Actions>
                <Button textColor={_Theme.themeBouton.backgroundColor} onPress={hideDialogDelete}>Retour</Button>
              </Dialog.Actions>
          </Dialog>
      </Portal>
    </View>
  );
}


function Search() {
  const _Theme = Theme()
  
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers,setAllUsers] = useState<user[]>([])
  
  const [needle,setNeedle] = useState<user[]>([])

  const sendFriendRequest = async(email_:string)=>{
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const reponse = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/friendRequests`,{email:email_},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    setSearchQuery("")
    const allUsers = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    setAllUsers(allUsers.data)
    searchFriend("")
  }

  const searchFriend = async(_text:string)=>{

    if(_text.length == 0){
      setNeedle([])
      return
    }
    const jwt = await AsyncStorage.getItem("jwt")
    const decode:user = jwtDecode(jwt?jwt:"")
    let _needle:user = {
      firstName:"",
      lastName:"",
      dateOfBirth:"",
      email:"",
      image:"",
      friends:[],
      friendRequests:[]
    }
    let tmpneedle = []
    for(let i=0; i<allUsers.length; i++){
  
      let b = !('friends' in allUsers[i])
      let c = !('friendRequests' in allUsers[i])
      if(!b){
        b = allUsers[i].friends.indexOf(decode.email)==-1
      }
      if(!c){
        c = allUsers[i].friendRequests.indexOf(decode.email)==-1
      }
      if(allUsers[i].email != decode.email && (allUsers[i].email.includes(_text) || allUsers[i].firstName.includes(_text) || allUsers[i].lastName.includes(_text)) && c && b){
        _needle = allUsers[i]
        tmpneedle.push(_needle)
      }
     
     

    }
    setNeedle(tmpneedle)
   

  }


  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const allUsers = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setAllUsers(allUsers.data)
    }
    wrap()
  },[])

  return (
    <View style={[{flex: 1}, _Theme.themeBack2]}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', marginTop:50 }}>
        <Searchbar
          style={[_Theme.themeSearchBar,{width:width-40}]}
          placeholder="Search"
          onChangeText={(text) => {setSearchQuery(text),searchFriend(text)}}
          value={searchQuery}
        />  
        {needle.map((item, index) =>(
            item.firstName.length > 0 ? (<List.Item style={{marginTop: 50}} right={() => <IconButton icon="account-plus" iconColor={_Theme.themeIcon.color} onPress={() => {sendFriendRequest(item.email)}} style={{top: 10}} />} descriptionStyle={{top:5, color:'grey'}} description={item.email} title={`${item.firstName} ${item.lastName}`} left={() => <Avatar.Image size={70} source={{uri: `${Config.scheme}://${Config.urlapi}:${Config.portapi}/${item.image}`}} />} />) : null
        ) )}
      </ScrollView>
    </View>
  );
}


export default function ProfileScreen() {
  const router = useRouter();
  const [visibleQ, setVisibleQ] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [password, onChangePassword] = useState('');
  const [error, setError] = useState('')
  const [isLoading,setIsLoading] = useState(false)
  const [profilePic, setProfilFic] = useState("");
  const showModal = () => setVisibleQ(true);
  const hideModal = () => setVisibleQ(false);
  const [colorBack,setColorBack] = useState("")
  const [value, setValue] = useState(0);
  const [value2, setValue2] = useState(0);
  const [checked1, setChecked1] = useState('first');
  const [checked2, setChecked2] = useState('first');
  const [checked3, setChecked3] = useState('first');
  const [checked4, setChecked4] = useState('first');
  const [text,setText] = useState("")
  const [disabledValid, setDisabledValid] = useState(true)
  const [mimeType,setMimeType] = useState("")
  const [realColor, setRealColor] = useState("")
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [iconColor, setIconColor] = useState('#FFFFFF')
  const [initialInfos, setInitialInfos] = useState<user>({
    firstName:"",
    lastName:"",
    dateOfBirth:"",
    email:"",
    image:"",
    friends:[],
    friendRequests:[]
  })
  const [newPicture,setNewPicture] = useState("")

  const interpolate = (start: number, end: number) => {
    let k = (value - 0) / 1000; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const interpolate2 = (start: number, end: number) => {
    let k = (value2 - 0) / 5; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  
    
  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  


  const color = () => {
    let r = interpolate(255, 0);
    let g = interpolate(0, 255);
    let b = interpolate(0, 0);
    return `rgb(${r},${g},${b})`;
  };

  const color2 = () => {
    let r = interpolate2(255, 0);
    let g = interpolate2(0, 255);
    let b = interpolate2(0, 0);
    return `rgb(${r},${g},${b})`;
  };

  const activities = [
    'Cinéma', 'Attractions', 'Animaux', 'Théâtre', 'Danse',
    'Manga/Anime', 'Séries', 'Échecs', 'Moto', 'Lecture',
    'Jeux vidéos', 'Musique', 'BD/Comics', 'Voyager', 'Musées',
    'Sortir entre amis', 'Sport', 'Nourriture', 'La mode'
  ];


  const splitArray = (array:any) => {
    const half = Math.ceil(array.length / 2);
    return [array.slice(0, half), array.slice(half)];
  };
  
  const [leftColumn, rightColumn] = splitArray(activities);

  const [checkedState, setCheckedState] = useState(
    activities.reduce((acc:any, activity) => {
      acc[activity] = false;
      return acc;
    }, {})
  );
  
  

  const remplirForm = async()=>{
    const _activities = Object.keys(checkedState).filter((key:any) => checkedState[key] === true);
    const data  = {
      activities: _activities,
      note: Math.floor(value/100),
      preferredTime: checked2,
      groupSize: checked1,
      placeType: checked3,
      budget: checked4,
      description: text,
      travelDistance: value2,
    }
    const jwt_cookie = await AsyncStorage.getItem("jwt");
    const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/fillQuestionnaire`, data,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false});
    hideModal()
  }

  const _Theme = Theme()

  const setPhoto = async() => {

    setProfilFic(newPicture)
    setModalVisible(!modalVisible)
    const data = {
      picture:newPicture,
      mime:mimeType
    }
    const jwt_token = await AsyncStorage.getItem("jwt")
    
    await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/setPicture`,data,{headers:{Cookie:`jwt=${jwt_token}`},withCredentials:false})
    const jwt_decode:any = jwtDecode(jwt_token?jwt_token:"")
    const reponseColor = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getColor`,{email:jwt_decode.email,bol:true},{headers:{Cookie:`jwt=${jwt_token}`},withCredentials:false})
    setColorBack(reponseColor.data)
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    
    if (!result.canceled) {
      
     
      setMimeType(result.assets[0].mimeType?result.assets[0].mimeType:"")
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });
      setNewPicture(`data:image/png;base64,${base64}`);
      setNewPicture(`data:image/png;base64,${base64}`);
      setDisabledValid(false)
    }
  };

  const cameraPicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    
    if (!result.canceled) {
      setMimeType(result.assets[0].mimeType?result.assets[0].mimeType:"")
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });
      setNewPicture(`data:image/png;base64,${base64}`);
      setNewPicture(`data:image/png;base64,${base64}`);
      setDisabledValid(false)
    }
  }

  const editPro = async()=>{
    setIsLoading(true)
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const reponse = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/verifyPassword`,{password:password},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    if(reponse.data == true){
      hideDialog()
    }
    if(reponse.data){
      router.push("editProfile")
    }
    else {
      setError('Mot de passe invalide')
    }
    setIsLoading(false)
  }
  const hasErrors = () => {
    return error != ''
  };


  const [visible, setVisible] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(false);

  const showDialogLogout = () => setVisibleLogout(true);
  
  const hideDialogLogout = () => setVisibleLogout(false);

  

  const handleCheckboxPress = (activity:any) => {
    setCheckedState({
      ...checkedState,
      [activity]: !checkedState[activity],
    });
  };
  useEffect(()=>{
    setRealColor(hextoRgb(colorBack,0.5))
    setTextColor(isColorLight(colorBack) ? 'black' : 'white')
    setIconColor(isColorLight(colorBack) ? '#171717' : '#efefef')
  },[colorBack])

  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setInitialInfos(reponse.data)
      const jwt_decode:any = jwtDecode(jwt_cookie?jwt_cookie:"")
      const reponseColor = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getColor`,{email:jwt_decode.email},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setColorBack(reponseColor.data)
      setNewPicture(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${reponse.data.image}`)
      setProfilFic(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${reponse.data.image}`)

      let tmp:any = []
      for(let i = 0; i <activities.length; i++){
        reponse.data.activities.includes(activities[i])?tmp[activities[i]] = true:tmp[activities[i]] = false
      }
      setCheckedState(tmp)

      setValue(reponse.data.note*100)

      setChecked1(reponse.data.groupSize)

      setChecked2(reponse.data.preferredTime)

      setChecked3(reponse.data.placeType)

      setChecked4(reponse.data.budget)

      setText(reponse.data.description)

      setValue2(reponse.data.travelDistance)
    }
    wrap()
  },[])

 
  const logout = async() =>{
    await AsyncStorage.setItem("jwt","")
    router.push("/")
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, _Theme.themeBack2]}>
        <Text style={[{ textAlign: 'center' }, _Theme.themeText]}>Nous avons besoin de votre permission pour utiliser la caméra</Text>
        <Button textColor={_Theme.themeBouton2.color} onPress={requestPermission}>Donner la permission</Button>
      </View>
    );
  }

  function hextoRgb(color:string,opacity:number){
    let hex = color;
    let r = parseInt(hex[1]+hex[2], 16);
    let g = parseInt(hex[3]+hex[4], 16);
    let b = parseInt(hex[5]+hex[6], 16);
    return `rgba(${r},${g},${b},${opacity})`
  }

  function getBrightness (color: string) {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  };
  
  function isColorLight (color: string) {
    return getBrightness(color) > 0.5;
  };


  
  if(isLoading)return(<View  style={[{    flex: 1,      justifyContent: 'center',}, _Theme.themeBack2]} ><ActivityIndicator style={_Theme.themeBack2} animating={true} color={_Theme.themeBouton.backgroundColor} size='large'></ActivityIndicator></View>)
  return (
    
    <PaperProvider>
      <View style={styles.container}>
        <View style={[styles.header, {backgroundColor:realColor,shadowColor:realColor,shadowOpacity:0.7, shadowRadius:40}]}>
          <IconButton
            icon="arrow-left"
            iconColor={iconColor}
            onPress={() => router.push('home')}
            style={styles.buttonBack}
          />
          <TouchableOpacity onPress={()=>{setModalVisible(true)}}>
            <Avatar.Image size={80} source={{uri:profilePic}} />
          </TouchableOpacity>
          
          
          
          <Text style={[styles.headerText, {color: textColor}]}>{`${initialInfos.firstName} ${initialInfos.lastName}`}</Text>
          <IconButton
            icon="logout"
            iconColor={iconColor}
            onPress={showDialogLogout}
            style={styles.logout}
          />
          <IconButton
            icon="account-edit"
            iconColor={iconColor}
            onPress={showDialog}
            style={styles.edit}
          />
          <IconButton
            icon="form-select"
            iconColor={iconColor}
            onPress={() => showModal()}
            style={styles.form}
          />
        </View>
        <SafeAreaProvider>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: _Theme.themeText.color,
              tabBarLabelStyle: { fontSize: 12 },
              tabBarStyle: { backgroundColor: _Theme.themeBack.backgroundColor },
              tabBarIndicatorStyle: {backgroundColor: colorBack}
            }}
          >
            <Tab.Screen name="Informations" component={Informations} />
            <Tab.Screen name="Amis" component={Friends} />
            <Tab.Screen name="Rechercher" component={Search} />
          </Tab.Navigator>
        </SafeAreaProvider>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => {
              setModalVisible(false);
            }}
            contentContainerStyle={[styles.popUp, _Theme.themeBack2]}
          >
            <IconButton
              icon="arrow-left"
              iconColor={_Theme.themeIcon.color}
              onPress={() => {setModalVisible(!modalVisible);setNewPicture(profilePic);setDisabledValid(true)}}
              style={styles.buttonClose}
            />
            <Avatar.Image size={300}style={{marginBottom:30}} source={{uri:newPicture}} />
          
            <Button buttonColor={_Theme.themeBouton.backgroundColor} textColor={_Theme.themeBouton.color} icon="account-check" mode='contained-tonal' onPress={cameraPicture} style={{marginTop:10,width:width-40}}>
              Prendre une photo
            </Button> 

            <Button buttonColor={_Theme.themeBouton.backgroundColor} textColor={_Theme.themeBouton.color} icon="account-check" mode='contained-tonal' onPress={pickImage} style={{marginTop:10,width:width-40}}>
              Choisir une photo de la galerie
            </Button> 
            <Button buttonColor={_Theme.themeBouton.backgroundColor} textColor={_Theme.themeBouton.color} icon="account-check" mode='contained-tonal' onPress={pickImage} style={{marginTop:10,width:width-40}}>
              Choisir une photo de la galerie
            </Button> 

            <Button disabled={disabledValid} buttonColor={_Theme.themeBouton.backgroundColor} textColor={_Theme.themeBouton.color} icon="account-check" mode='contained-tonal' onPress={setPhoto} style={{marginTop:40,width:width-40}}>
              Valider
            </Button> 
          </Modal>
        </Portal>
        <Portal>
          <Dialog style={{backgroundColor: _Theme.themeBack2.backgroundColor}} visible={visible} onDismiss={hideDialog}>
              
              <Dialog.Icon icon="alert" color={_Theme.themeIcon.color}/>
              <Dialog.Title style={[_Theme.themeText, {textAlign: 'center'}]}>Entrez votre mot de passe</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  outlineColor={_Theme.themeBouton.backgroundColor}
                  activeOutlineColor={_Theme.themeBouton.backgroundColor}
                  theme={theme}
                  secureTextEntry={true}
                  label="Mot de passe"
                  placeholder='Entrez votre mot de passe...'
                  left={<TextInput.Icon icon={password.length==0?"lock-open":"lock"} color={_Theme.themeIcon.color}/>}
                  mode='outlined'
                  style={[styles.input, _Theme.themeBack2, _Theme.themeShadow]}
                  onChangeText={onChangePassword}
                />
                
                <HelperText type="error" visible={hasErrors()}>
                  {error}
                </HelperText>
                <Button  
                  buttonColor={_Theme.themeBouton.backgroundColor}
                  textColor={_Theme.themeBouton.color}
                  icon="login" 
                  mode="contained" 
                  onPress={editPro}
                >
                  Valider
                </Button>
              </Dialog.Content>
              <Dialog.Actions>
                <Button textColor={_Theme.themeBouton.backgroundColor} onPress={hideDialog}>Retour</Button>
              </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog style={{backgroundColor: _Theme.themeBack2.backgroundColor}} visible={visibleLogout} onDismiss={hideDialogLogout}>
              
              <Dialog.Icon icon="alert" color={_Theme.themeIcon.color}/>
              <Dialog.Title style={[_Theme.themeText, {textAlign: 'center'}]}>Se déconnecter ?</Dialog.Title>
              <Dialog.Content>
                <Button  
                  buttonColor={_Theme.themeBouton.backgroundColor}
                  textColor={_Theme.themeBouton.color}
                  icon="logout" 
                  mode="contained" 
                  onPress={logout}
                >
                  Confirmer
                </Button>
              </Dialog.Content>
              <Dialog.Actions>
                <Button textColor={_Theme.themeBouton.backgroundColor} onPress={hideDialogLogout}>Retour</Button>
              </Dialog.Actions>
          </Dialog>
        </Portal>
        
        <Portal>
          <Modal visible={visibleQ} onDismiss={hideModal} style={{marginTop: 0, maxHeight: ScreenHeight, width: width - 40, left: 20, paddingVertical: 20 }}>
            <KeyboardAwareScrollView style={[{ height: ScreenHeight - 300, borderRadius: 20, paddingHorizontal: 30, overflow: 'hidden' }, _Theme.themeBack2]}>
              <Text style={[{ marginVertical: 20, fontSize: 20, textAlign: 'center' }, _Theme.themeText]}>Questionnaire d'Inscription</Text>
              <Text style={[{ marginBottom: 20, textDecorationLine: 'underline' }, _Theme.themeText]}>Quelles activités aimez-vous ?</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  {leftColumn.map((activity: any) => (
                    <View key={activity} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <Checkbox
                        color={_Theme.themeBouton.backgroundColor}
                        status={checkedState[activity] ? 'checked' : 'unchecked'}
                        onPress={() => handleCheckboxPress(activity)}
                      />
                      <Text style={_Theme.themeText}>{activity}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flex: 1 }}>
                  {rightColumn.map((activity: any) => (
                    <View key={activity} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <Checkbox
                        color={_Theme.themeBouton.backgroundColor}
                        status={checkedState[activity] ? 'checked' : 'unchecked'}
                        onPress={() => handleCheckboxPress(activity)}
                      />
                      <Text style={_Theme.themeText}>{activity}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text style={[{ marginTop: 20, textDecorationLine: 'underline' }, _Theme.themeText]}>Notez votre état actuel :</Text>
              <Slider
                value={value}
                style={{ margin: 20 }}
                onValueChange={setValue}
                maximumValue={1000}
                minimumValue={0}
                step={1}
                allowTouchTrack
                trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                thumbProps={{
                  children: (
                    <Icon
                      name="heartbeat"
                      type="font-awesome"
                      size={20}
                      reverse
                      containerStyle={{ bottom: 20, right: 20 }}
                      color={color()}
                    />
                  ),
                }}
              />
              <Text style={[{ marginVertical: 20, textDecorationLine: 'underline' }, _Theme.themeText]}>Préférez-vous les activités en petit ou en grand groupe ?</Text>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <RadioButton
                    color={_Theme.themeBouton.backgroundColor}
                    value="petitcomite"
                    status={checked1 === 'petitcommite' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked1('petitcommite')}
                  />
                  <Text style={_Theme.themeText}>Petit groupe</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <RadioButton
                    color={_Theme.themeBouton.backgroundColor}
                    value="grandcomite"
                    status={checked1 === 'grandcomite' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked1('grandcomite')}
                  />
                  <Text style={_Theme.themeText}>Grand groupe</Text>
                </View>
              </View>
              <Text style={[{ marginVertical: 20, textDecorationLine: 'underline' }, _Theme.themeText]}>Quel moment de la journée préférez-vous pour les sorties ?</Text>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <RadioButton
                    color={_Theme.themeBouton.backgroundColor}
                    value="morning"
                    status={checked2 === 'morning' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked2('morning')}
                  />
                  <Text style={_Theme.themeText}>Matin</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <RadioButton
                    color={_Theme.themeBouton.backgroundColor}
                    value="afternoon"
                    status={checked2 === 'afternoon' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked2('afternoon')}
                  />
                  <Text style={_Theme.themeText}>Après-midi</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <RadioButton
                    color={_Theme.themeBouton.backgroundColor}
                    value="evening"
                    status={checked2 === 'evening' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked2('evening')}
                  />
                  <Text style={_Theme.themeText}>Soir</Text>
                </View>
              </View>
              <Text style={[{ marginVertical: 20, textDecorationLine: 'underline' }, _Theme.themeText]}>Préférez-vous les activités en intérieur ou en extérieur ?</Text>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <RadioButton
                    color={_Theme.themeBouton.backgroundColor}
                    value="indoor"
                    status={checked3 === 'indoor' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked3('indoor')}
                  />
                  <Text style={_Theme.themeText}>Intérieur</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <RadioButton
                    color={_Theme.themeBouton.backgroundColor}
                    value="outdoor"
                    status={checked3 === 'outdoor' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked3('outdoor')}
                  />
                  <Text style={_Theme.themeText}>Extérieur</Text>
                </View>
              </View>
              <Text style={[{ marginVertical: 20, textDecorationLine: 'underline' }, _Theme.themeText]}>Quel est votre budget pour les sorties ?</Text>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <RadioButton
                    color={_Theme.themeBouton.backgroundColor}
                    value="low"
                    status={checked4 === 'low' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked4('low')}
                  />
                  <Text style={_Theme.themeText}>Bas</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <RadioButton
                    color={_Theme.themeBouton.backgroundColor}
                    value="medium"
                    status={checked4 === 'medium' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked4('medium')}
                  />
                  <Text style={_Theme.themeText}>Moyen</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <RadioButton
                    color={_Theme.themeBouton.backgroundColor}
                    value="high"
                    status={checked4 === 'high' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked4('high')}
                  />
                  <Text style={_Theme.themeText}>Elevé</Text>
                </View>
              </View>
              <Text style={[{ marginVertical: 20, textDecorationLine: 'underline' }, _Theme.themeText]}>Decrivez-vous</Text>
              <TextInput
                label="Description"
                value={text}
                mode='outlined'
                style={_Theme.themeBack2}
                outlineColor='white'
                activeOutlineColor={_Theme.themeBouton2.borderColor}
                onChangeText={text => setText(text)}
              />
              <Text style={[{ marginVertical: 20, textDecorationLine: 'underline' }, _Theme.themeText]}>Quelle est la distance maximale que vous êtes prêt(e) à parcourir pour une sortie ? (en km)</Text>
              <Slider
                value={value2}
                style={{ margin: 20 }}
                onValueChange={setValue2}
                maximumValue={5}
                minimumValue={0}
                step={1}
                allowTouchTrack
                trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                thumbProps={{
                  children: (
                    <Icon
                      name="car"
                      type="font-awesome"
                      size={20}
                      reverse
                      containerStyle={{ bottom: 20, right: 20 }}
                      color={color2()}
                    />
                  ),
                }}
              />
              <Button mode='contained' buttonColor={_Theme.themeBouton.backgroundColor} textColor={_Theme.themeText.color} style={{ marginBottom: 20 }} onPress={remplirForm}>
                Finaliser
              </Button>
            </KeyboardAwareScrollView>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
    
  );
}



const colorMain = '#99c3ff'
const theme = {
  roundness:5,
  color:{
    shadow:150
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  slide: {
    alignItems: 'center',
    flex: 1
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonBack: {
    position: 'absolute',
    top: 30,
    left: 10,
  },
  headerText: {
    top: 24,
    fontSize: 20,
  },
  inputContainer: {
    width: '90%', // Ajustez la largeur en fonction de vos préférences
    marginBottom: 24, // Espace après chaque champ de saisie
  },
  logout: {
    position: 'absolute', 
    right: 10,
    top: 30
  },
  edit: {
    position: 'absolute', 
    right: 50,
    top: 30
  },
  form: {
    position: 'absolute', 
    right: 90,
    top: 30
  },
  popUp: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4
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
  profilePic: {
    height: undefined,
    aspectRatio: 1,
  },
  buttonClose: {
    position: 'absolute',
    top: 30,
    left: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'relative',
  },
  buttonText: {
    fontSize: 16,
    opacity: 0.3
  },
  selectedButtonText: {
    opacity: 1
  },
  logo: {
    width: 606,
    height: 508,
  }
});