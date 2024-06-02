import { useRouter } from "expo-router";
import { Image, Text, View, StyleSheet, Modal, Dimensions } from "react-native";
import { Avatar, Icon, Input } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { IconButton, MD3Colors, Button, Dialog, HelperText } from "react-native-paper";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import axios from 'axios'
import Config from '../config.json'
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const editPro = async()=>{
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    console.log(jwt_cookie)
    const reponse = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/verifyPassword`,{password:password},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    console.log(reponse.data)
    if(reponse.data){
      router.push("editProfile")
    }
    else {
      setError('Mot de passe invalide')
    }
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
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor={MD3Colors.neutral20}
          onPress={router.back}
          style={styles.buttonBack}
        />
        <Avatar
          size={80}
          rounded
          icon={{ name: "person", type: "material" }}
          containerStyle={{ backgroundColor: "#bbbec1" }}
          onPress={() => setModalVisible(true)}
        />
        <Text style={styles.headerText}>Prénom Nom</Text>
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
            onPress={() => setModalVisible(!modalVisible)}
            style={styles.buttonClose}
          />
          <Image 
            source={require('@/assets/images/react-logo.png')}
            style={[styles.profilePic, { width: width }]}
            resizeMode='contain'
          />
          <Button
            mode="elevated"
            style={{
              width: width - 40,
              borderRadius: 0
            }}
            onPress={() => {
              setModalVisible(false)
              setTimeout(()=>{
                setCamVisible(true)
              },100)


            }}
          >
            Prendre une photo
          </Button>
          <Button
            mode="elevated"
            style={{
              width: width - 40,
              borderRadius: 0
            }}
            onPress={() => setModalVisible(!modalVisible)}
          >
            Choisir une photo de la galerie
          </Button>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={camVisible}
        onRequestClose={() => {
          setModalVisible(!camVisible);
        }}
      >
        <View style={{backgroundColor: 'white', height: 300}}></View>
        <CameraView style={styles.camera} facing={facing}>
          <IconButton
            icon="arrow-left"
            containerColor={'rgba(0, 0, 0, 0.5)'}
            iconColor={MD3Colors.neutral100}
            style={{ position: 'absolute', top: 10, left: 10, height: 30, width: 30 }}
            size={24}
            onPress={() => setCamVisible(!camVisible)}
          />
          <IconButton
            icon="orbit-variant"
            containerColor={'rgba(0, 0, 0, 0.5)'}
            iconColor={MD3Colors.neutral100}
            style={{ position: 'absolute', top: 10, right: 10, height: 30, width: 30 }}
            size={24}
            onPress={toggleCameraFacing}
          />
          <Button
            mode="elevated"
          >
            azjfa
          </Button>
        </CameraView>
        <View style={{backgroundColor: 'white', height: 30}}></View>
      </Modal>
      <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Entrez votre mot de passe</Dialog.Title>
          <Dialog.Content>
            <Input
              secureTextEntry={true} 
              inputContainerStyle={styles.inputContainer}
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
            <HelperText type="error" visible={hasErrors()}>
              {error}
            </HelperText>
            <Button icon="login" mode="contained" onPress={editPro}>
              Valider
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Retour</Button>
          </Dialog.Actions>
      </Dialog>
    </View>
    
  );
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
  profilePic: {
    height: undefined,
    aspectRatio: 1,
  },
  buttonClose: {
    position: 'absolute',
    top: 6,
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
});