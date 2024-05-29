import { Link, useRouter } from "expo-router";
import { Image, Text, View, StyleSheet, Modal, Pressable, Dimensions } from "react-native";
import { Icon } from '@rneui/themed';
import { Avatar } from '@rneui/themed';
import { useState } from 'react';

const HEADER_HEIGHT = 200;
const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonPressed1, setButtonPressed1] = useState(false);
  const [buttonPressed2, setButtonPressed2] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.buttonBack}
          onPress={() => router.back()}
        >
          <Icon name='arrow-back' type='material' color={'#687076'}/>
        </Pressable>
        <Avatar
          size={80}
          rounded
          icon={{ name: "person", type: "material" }}
          containerStyle={{ backgroundColor: "#bbbec1" }}
          onPress={() => setModalVisible(true)}
        />
        <Text style={styles.headerText}>Prénom Nom</Text>
        <Link href="editProfile" style={styles.edit}>
          <Icon name='pencil' type='font-awesome' color={'#687076'}/>
        </Link>
      </View>
      <View style={styles.body}>
        <Text>Profil</Text>
        <Link href="@/settings">?</Link>
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
          <Pressable
            style={styles.buttonClose}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Icon name='arrow-back' type='material' color={'#687076'}/>
          </Pressable>
          <Image 
            source={require('@/assets/images/react-logo.png')}
            style={[styles.profilePic, { width: width }]}
            resizeMode='contain'
          />
          <Pressable
            style={[styles.button, buttonPressed1 && styles.buttonPressed]}
            onPress={() => setModalVisible(!modalVisible)}
            onPressIn={() => setButtonPressed1(true)}
            onPressOut={() => setButtonPressed1(false)}
          >
            <Text style={styles.textStyle}>Prendre une photo</Text>
          </Pressable>
          <Pressable
            style={[styles.button, buttonPressed2 && styles.buttonPressed]}
            onPress={() => setModalVisible(!modalVisible)}
            onPressIn={() => setButtonPressed2(true)}
            onPressOut={() => setButtonPressed2(false)}
          >
            <Text style={styles.textStyle}>Choisir une photo de la galerie</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  buttonBack: {
    position: 'absolute',
    top: 40,
    left: 20,
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
  edit: {
    position: 'absolute', 
    right: 20,
    top: 40
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
  button: {
    paddingVertical: 10,
    width: width - 40,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
  buttonPressed: {
    backgroundColor: '#1E88E5',
  },
  buttonClose: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});