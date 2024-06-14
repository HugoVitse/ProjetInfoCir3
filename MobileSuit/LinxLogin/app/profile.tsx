import { useRouter } from "expo-router";
import { Image, Text, View, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView } from "react-native";
import { Avatar, Checkbox, List, PaperProvider, Portal, RadioButton, Searchbar } from 'react-native-paper';
import { useEffect, useRef, useState } from 'react';
import { IconButton,TextInput, MD3Colors, Modal, Button, Dialog, HelperText, ActivityIndicator } from "react-native-paper";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import axios from 'axios'
import Config from '../config.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { user } from "@/constants/user";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import Theme from "@/constants/Theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Icon, ScreenHeight, Slider } from "@rneui/base";
import { useSharedValue } from "react-native-reanimated";
import { jwtDecode } from "jwt-decode";

const HEADER_HEIGHT = 200;
const { width } = Dimensions.get('window');

const slideData = [
  {
    id: '1',
    title: "friendList",
  },
  {
    id: '2',
    title: 'searchFriend',
  }
]




export default function ProfileScreen() {
  const router = useRouter();
  const [visibleQ, setVisibleQ] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [facing, setFacing] = useState(CameraType.back);
  const [permission, requestPermission] = useCameraPermissions();
  const [camVisible, setCamVisible] = useState(false);
  const [password, onChangePassword] = useState('');
  const [error, setError] = useState('')
  const [isLoading,setIsLoading] = useState(false)
  const [profilePic, setProfilFic] = useState("");
  const showModal = () => setVisibleQ(true);
  const hideModal = () => setVisibleQ(false);
  const [value, setValue] = useState(0);
  const [value2, setValue2] = useState(0);
  const [checked1, setChecked1] = useState('first');
  const [checked2, setChecked2] = useState('first');
  const [checked3, setChecked3] = useState('first');
  const [checked4, setChecked4] = useState('first');
  const [valueC, setValueC] = useState(slideData[0].title);
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [text,setText] = useState("")
  const [disabledValid, setDisabledValid] = useState(true)
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers,setAllUsers] = useState([])
  const [needle,setNeedle] = useState({})
  const [initialInfos, setInitialInfos] = useState<user>({
    firstName:"",
    lastName:"",
    dateOfBirth:"",
    email:"",
    image:""
  })
  const [newPicture,setNewPicture] = useState("")
  const [friendList,setFriendList] = useState([])
  const [friendListComp,setFriendListComp] = useState([])

  const interpolate = (start: number, end: number) => {
    let k = (value - 0) / 1000; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const interpolate2 = (start: number, end: number) => {
    let k = (value2 - 0) / 5; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };
  


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
    console.log(checkedState)
    const _activities = Object.keys(checkedState).filter((key:any) => checkedState[key] === true);
    const data  = {
      activities: _activities,
      note: Math.floor(value/100),
      preferredTime: checked2,
      groupSize: checked1,
      placeType: checked3,
      budget: checked4,
      description: text,
      travelDistance: 25,
    }
    console.log(data)
    const jwt_cookie = await AsyncStorage.getItem("jwt");
    const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/fillQuestionnaire`, data,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false});
    hideModal()
  }

  const searchFriend = async(text)=>{
    const jwt = await AsyncStorage.getItem("jwt")
    const decode = jwtDecode(jwt)
    let needle = {}
    for(let i=0; i<allUsers.length; i++){
      let b = !('friends' in allUsers[i])
      let c = !('friendRequests' in allUsers[i])
      if(!b){
        b = allUsers[i].friends.indexOf(decode.email)==-1
      }
      if(!c){
        c = allUsers[i].friendRequests.indexOf(decode.email)==-1
      }
      if(allUsers[i].email != decode.email && allUsers[i].email == text && c && b){
        needle = allUsers[i]
        console.log("ok")
        break
      }
    }
    console.log(needle)
    setNeedle(needle)

  }


  const _Theme = Theme()

  const setPhoto = async() => {

    setProfilFic(newPicture)
    setModalVisible(!modalVisible)
    const data = {
      picture:newPicture
    }
    const jwt_token = await AsyncStorage.getItem("jwt")
    
    await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/setPicture`,data,{headers:{Cookie:`jwt=${jwt_token}`},withCredentials:false})
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    console.log(result);

    
    if (!result.canceled) {
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });
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

    console.log(result);

    
    if (!result.canceled) {
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });
      setNewPicture(`data:image/png;base64,${base64}`);
      setDisabledValid(false)
    }
  }

  const editPro = async()=>{
    setIsLoading(true)
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    console.log(jwt_cookie)
    const reponse = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/verifyPassword`,{password:password},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    if(reponse.data == true){
      hideDialog()
    }
    console.log(reponse.data)
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

  useEffect(()=>{
    console.log(camVisible)
  },[camVisible])

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const sendFriendRequest = async()=>{

    const jwt_cookie = await AsyncStorage.getItem("jwt")
    console.log("ok")
    const reponse = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/friendRequests`,{email:needle.email},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    console.log(reponse.data)
    setSearchQuery("")
    const allUsers = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    setAllUsers(allUsers.data)
  }

  const handleCheckboxPress = (activity:any) => {
    setCheckedState({
      ...checkedState,
      [activity]: !checkedState[activity],
    });
  };

  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const handlePress = (index: number) => {
    setValueC(slideData[index].title);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ index, animated: true });
    }
  };
  const renderSwitch = (item: { type: any; content: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }) => {
    {switch(item.title) {
      case 'friendList': 
        return  <List.Section>
                  {friendListComp}
                </List.Section>
      case 'searchFriend': 
        return  (
          <>

                <Searchbar
                  style={{width:width-40,top:50}}
                  placeholder="Search"
                  onChangeText={(text) => {setSearchQuery(text),searchFriend(text)}}
                  value={searchQuery}
                />  
                {Object.keys(needle).length >0 ? (<List.Item style={{top:50}} right={()=> <IconButton icon="account-plus"  iconColor={_Theme.themeIcon.color}      onPress={()=>{sendFriendRequest()}}     style={{top:10}} ></IconButton>}  title={`${needle.firstName} ${needle.lastName}` }  left={() => <Avatar.Image size={70} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${needle.email}.png`}} /> } /> ): <></>}
          </>
        )
               
    }
    }
  }

  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setInitialInfos(reponse.data)
      setNewPicture(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${reponse.data.image}`)
      setProfilFic(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${reponse.data.image}`)
      const friendListReq = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getFriendList`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setFriendList(friendListReq.data)
      const allUsers = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      console.log(allUsers.data)
      setAllUsers(allUsers.data)
    }
    wrap()
  },[])

  useEffect(()=>{

  },[])

  useEffect(()=>{
    if(friendList.length>0){
      let tmpcomp = []
      for (let i=0; i< friendList.length; i++){
        tmpcomp.push(<List.Item key={i} title={`${friendList[i].firstName} ${friendList[i].lastName}` }  left={() => <Avatar.Image size={80} source={{uri:`${Config.scheme}://${Config.urlapi}:${Config.portapi}/profile_pictures/${friendList[i].email}.png`}} />  } />)
      }
      setFriendListComp(tmpcomp)
    }
  },[friendList])
 
  const logout = async() =>{
    await AsyncStorage.setItem("jwt","")
    router.push("/")
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>grant permission</Button>
      </View>
    );
  }
  
  function toggleCameraFacing() {
    setFacing(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  
  if(isLoading)return(<View  style={{    flex: 1,      justifyContent: 'center',}} ><ActivityIndicator animating={true} color={colorMain} size='large'></ActivityIndicator></View>)
  return (
    
    <PaperProvider>
      <View style={styles.container}>
        <View style={[styles.header, _Theme.themeBack, _Theme.themeShadow]}>
          <IconButton
            icon="arrow-left"
            iconColor={_Theme.themeIcon.color}
            onPress={router.back}
            style={styles.buttonBack}
          />
          {/* <Avatar
            size={80}
            rounded
            icon={{ name: "person", type: "material" }}
            containerStyle={{ backgroundColor: "#bbbec1", top: 10 }}
            onPress={() => setModalVisible(true)}
            
          > */}
          <TouchableOpacity onPress={()=>{setModalVisible(true)}}>
            <Avatar.Image size={80} source={{uri:profilePic}} />
          </TouchableOpacity>
          
          
          
          <Text style={[styles.headerText, _Theme.themeText]}>{`${initialInfos.firstName} ${initialInfos.lastName}`}</Text>
          <IconButton
            icon="account-edit"
            iconColor={_Theme.themeIcon.color}
            onPress={/*() => router.push("editProfile")*/showDialog}
            style={styles.edit}
          />
          <IconButton
            icon="form-select"
            iconColor={_Theme.themeIcon.color}
            onPress={() => showModal()}
            style={styles.form}
          />
        </View>
        
        <View style={[styles.body, _Theme.themeBack2]}>
        <SafeAreaView style={styles.buttonContainer}>
            {slideData.map((slide, index) => (
              <TouchableOpacity key={slide.id} onPress={() => handlePress(index)} style={styles.button}>
                <Text style={[styles.buttonText, _Theme.themeText, valueC === slide.title && styles.selectedButtonText]}>
                  {slide.title}
                </Text>
              </TouchableOpacity>
            ))}
            {/* <Animated.View style={[styles.underline, { left: underlineAnim, width: width / slideData.length }]} /> */}
          </SafeAreaView>
        <Carousel
            ref={carouselRef}
            loop={false}
            width={width}
            autoPlay={false}
            data={slideData}
            onProgressChange={progress}
            scrollAnimationDuration={500}
            // onScrollStart={() => {
            //   const index = slideData.findIndex(slide => slide.title === value);
            //   animateUnderline(index);
            // }}
            onSnapToItem={(index) => {
              console.log('current index:', index);
              setValueC(slideData[index].title);
            }}
            renderItem={({ item }) => (
              <View style={[styles.slide,item.title=='friendList'?{flex:1}:{}]}>
               
                {renderSwitch(item)}
              </View>
            )}
          />
          <Pagination.Basic
            progress={progress}
            data={slideData}
            dotStyle={{..._Theme.themePagination, borderRadius: 0, width:(width-30)/2, height: 3}}
            activeDotStyle={_Theme.themePagination2}
            containerStyle={{ gap: 10, top: 42, position: 'absolute' }}
            onPress={onPressPagination}
          />
          
          <Button
            mode="elevated"
            style={{
              width: width - 40,
              borderRadius: 0,
            }}
            onPress={logout}
          >
            Logout
          </Button>
        </View>
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

            <Button disabled={disabledValid} buttonColor={_Theme.themeBouton.backgroundColor} textColor={_Theme.themeBouton.color} icon="account-check" mode='contained-tonal' onPress={setPhoto} style={{marginTop:40,width:width-40}}>
              Valider
            </Button> 
          </Modal>
        </Portal>
        <Portal>
          <Dialog style={{backgroundColor: _Theme.themeBack2.backgroundColor}} visible={visible} onDismiss={hideDialog}>
              
              <Dialog.Icon icon="alert" color={_Theme.themeIcon.color}/>
              <Dialog.Title style={_Theme.themeText}>Entrez votre mot de passe</Dialog.Title>
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
                <Button  buttonColor={_Theme.themeBouton.backgroundColor} icon="login" mode="contained" onPress={editPro}>
                  Valider
                </Button>
              </Dialog.Content>
              <Dialog.Actions>
                <Button textColor={_Theme.themeBouton.backgroundColor} onPress={hideDialog}>Retour</Button>
              </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
      <Modal visible={visibleQ} onDismiss={hideModal} style={{marginTop: HEADER_HEIGHT + 20, maxHeight: ScreenHeight, width: width, padding: 20}}>
        <KeyboardAwareScrollView style={[{ height: ScreenHeight - 300, borderRadius: 20, paddingHorizontal: 50, overflow: 'hidden' }, _Theme.themeBack2]}>
          <Text style={[{ marginVertical: 20, fontSize: 20 }, _Theme.themeText]}>Questionnaire d'Inscription</Text>
          <Text style={[{ marginBottom: 20, textDecorationLine: 'underline' }, _Theme.themeText]}>Quelles activités aimez-vous ?</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              {leftColumn.map((activity: any) => (
                <View key={activity} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Checkbox
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
                value="petitcomite"
                status={checked1 === 'petitcommite' ? 'checked' : 'unchecked'}
                onPress={() => setChecked1('petitcommite')}
              />
              <Text style={_Theme.themeText}>Petit groupe</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <RadioButton
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
                value="morning"
                status={checked2 === 'morning' ? 'checked' : 'unchecked'}
                onPress={() => setChecked2('morning')}
              />
              <Text style={_Theme.themeText}>Matin</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <RadioButton
                value="afternoon"
                status={checked2 === 'afternoon' ? 'checked' : 'unchecked'}
                onPress={() => setChecked2('afternoon')}
              />
              <Text style={_Theme.themeText}>Après-midi</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <RadioButton
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
                value="indoor"
                status={checked3 === 'indoor' ? 'checked' : 'unchecked'}
                onPress={() => setChecked3('indoor')}
              />
              <Text style={_Theme.themeText}>Intérieur</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <RadioButton
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
                value="low"
                status={checked4 === 'low' ? 'checked' : 'unchecked'}
                onPress={() => setChecked4('low')}
              />
              <Text style={_Theme.themeText}>Bas</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <RadioButton
                value="medium"
                status={checked4 === 'medium' ? 'checked' : 'unchecked'}
                onPress={() => setChecked4('medium')}
              />
              <Text style={_Theme.themeText}>Moyen</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <RadioButton
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
          <Button mode='contained' buttonColor={_Theme.themeBouton.backgroundColor} style={{ marginBottom: 20 }} onPress={remplirForm}>
            Finaliser
          </Button>
        </KeyboardAwareScrollView>
      </Modal>

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
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'black',
    fontSize: 20,
  },
  body: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  inputContainer: {
    width: '90%', // Ajustez la largeur en fonction de vos préférences
    marginBottom: 24, // Espace après chaque champ de saisie
  },
  edit: {
    position: 'absolute', 
    right: 10,
    top: 30
  },
  form: {
    position: 'absolute', 
    right: 40,
    top: 30
  },
  popUp: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
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
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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