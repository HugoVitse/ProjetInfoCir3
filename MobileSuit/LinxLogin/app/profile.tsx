import { useRouter } from "expo-router";
import { Image, Text, View, StyleSheet, Modal, Dimensions, TouchableOpacity } from "react-native";
import { Avatar } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { IconButton,TextInput, MD3Colors, Button, Dialog, HelperText, ActivityIndicator } from "react-native-paper";
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

const HEADER_HEIGHT = 200;
const { width } = Dimensions.get('window');






export default function ProfileScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [facing, setFacing] = useState(CameraType.back);
  const [permission, requestPermission] = useCameraPermissions();
  const [camVisible, setCamVisible] = useState(false);
  const [password, onChangePassword] = useState('');
  const [error, setError] = useState('')
  const [isLoading,setIsLoading] = useState(false)
  const [profilePic, setProfilFic] = useState("");
  const [disabledValid, setDisabledValid] = useState(true)
  const [initialInfos, setInitialInfos] = useState<user>({
    firstName:"",
    lastName:"",
    dateOfBirth:"",
    email:"",
    image:""
  })
  const [newPicture,setNewPicture] = useState("")

  

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
      setNewPicture("data:image/png;base64,"+base64);
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
      setNewPicture("data:image/png;base64,"+base64);
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


  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setInitialInfos(reponse.data)
      setNewPicture(reponse.data.image)
      setProfilFic(reponse.data.image)
    }
    wrap()
  },[])

  useEffect(()=>{

  },[])
 
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
    
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor={MD3Colors.neutral20}
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
        
        
        
        <Text style={styles.headerText}>{`${initialInfos.firstName} ${initialInfos.lastName}`}</Text>
        <IconButton
          icon="account-edit"
          iconColor={MD3Colors.neutral20}
          onPress={/*() => router.push("editProfile")*/showDialog}
          style={styles.edit}
        />
      </View>
      <View style={styles.body}>
        <Text>Profil</Text>
        
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.popUp}>
          <IconButton
            icon="arrow-left"
            iconColor={MD3Colors.neutral20}
            onPress={() => {setModalVisible(!modalVisible);setNewPicture(profilePic);setDisabledValid(true)}}
            style={styles.buttonClose}
          />
          <Avatar.Image size={300}style={{marginBottom:30}} source={{uri:newPicture}} />
         
          <Button buttonColor={colorMain} icon="account-check" mode='contained-tonal' onPress={cameraPicture} style={{marginTop:10,width:width-40}}>
            Prendre une photo
          </Button> 

          <Button buttonColor={colorMain} icon="account-check" mode='contained-tonal' onPress={pickImage} style={{marginTop:10,width:width-40}}>
            Choisir une photo de la galerie
          </Button> 

          <Button disabled={disabledValid} buttonColor={colorMain} icon="account-check" mode='contained-tonal' onPress={setPhoto} style={{marginTop:40,width:width-40}}>
            Valider
          </Button> 

         
        </View>
      </Modal>
      
      <Dialog style={{backgroundColor:"white"}} visible={visible} onDismiss={hideDialog}>
          
          <Dialog.Icon icon="alert" />
          <Dialog.Title>Entrez votre mot de passe</Dialog.Title>
          <Dialog.Content>
            <TextInput
              outlineColor={colorMain}
              activeOutlineColor={colorMain}
              theme={theme}
              secureTextEntry={true}
              label="Mot de passe"
              placeholder='Entrez votre mot de passe...'
              left={<TextInput.Icon icon={password.length==0?"lock-open":"lock"} />}
              mode='outlined'
              style={styles.input}
              onChangeText={onChangePassword}
            />
            
            <HelperText type="error" visible={hasErrors()}>
              {error}
            </HelperText>
            <Button  buttonColor="black" icon="login" mode="contained" onPress={editPro}>
              Valider
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={colorMain} onPress={hideDialog}>Retour</Button>
          </Dialog.Actions>
      </Dialog>
    </View>
    
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: 'white',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
  popUp: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 2,
  },
  input: {
    backgroundColor:'white',
    margin:10,
    borderRadius:2,
    shadowColor:'black',
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
  logo: {
    width: 606,
    height: 508,
  }
});