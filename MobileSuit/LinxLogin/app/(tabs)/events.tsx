import { Avatar } from "@rneui/themed";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Dimensions, SafeAreaView, Animated } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton, MD3Colors, Card, Button, ActivityIndicator, Dialog, Drawer } from "react-native-paper";
import { useState , useEffect, useRef } from "react";
import axios from 'axios'
import Config from '../../config.json'
import {evenement} from '../../constants/evenement'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Theme from "../../constants/Theme";
import MapView, {Marker} from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { ScreenHeight, ScreenWidth } from "@rneui/base";
import { coords } from "../../constants/coord"
const HEADER_HEIGHT = 100;
const { width } = Dimensions.get('window');
const drawerWidth = 75

export default function CatalogScreen() {
  const router = useRouter();
  const [evenements,setEvenements] = useState<evenement[]>([])
  const [componentActivities,setComponentActivities] = useState<JSX.Element[]>([])
  const [jwt,setJwt] = useState('');
  const [isjwt,setisjwt] = useState(-1)
  const [islogin,setLogin] = useState(-1)
  const [isLoaded,setIsLoaded] = useState(false)
  const [markers, setMarkers] = useState<JSX.Element[]>([])
  const [active, setActive] = useState('');
  const leftDecal =  useState(new Animated.Value(-drawerWidth*4))[0];
  const [drawerDeployed, setDrawerDeployed] = useState(false)
  const [actualLat,setActualLat] = useState(50.633333)
  const [actualLong,setActualLong] = useState(3.066667)
  const [coords,setCoords] = useState<coords[]>([])


  const googlekey = "AIzaSyAOpVdDvYUvbIB_u_d6k_HVfw13_Vux0K0"

  const [visible, setVisible] = useState(false);

  const [actualIndex,setActualIndex] = useState(0)

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const _Theme = Theme();

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

  const startAnimation = () => {
    Animated.timing(leftDecal, {
      toValue: 0, // Move to -60
      duration: 400, // Animation duration in ms
      useNativeDriver: false, // 'left' is not supported by native driver
    }).start();
    setDrawerDeployed(true)
  };

  const endAnimation = () => {
    Animated.timing(leftDecal, {
        toValue: -drawerWidth*4, // Move to -60
        duration: 400, // Animation duration in ms
        useNativeDriver: false, // 'left' is not supported by native driver
      }).start();
      setDrawerDeployed(false)
  }
  

  useEffect(()=>{
    const getActivities = async() => {
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      console.log(jwt_cookie)
      const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/evenements`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setEvenements(response.data)
      setIsLoaded(true)
    }
    getActivities()
  } ,[])

  useEffect(()=>{
    if(coords.length>0){
        setActualLong(coords[actualIndex].long)
        setActualLat(coords[actualIndex].lat)
    }

  },[actualIndex])

  useEffect(()=>{
    const wrap = async() => {
        if(evenements.length>0){
            let tmp = []
            let coords = []
            for(let i = 0; i<evenements.length;i++){
                const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(evenements[i].activity.adresse)}&key=${googlekey}`);
                coords.push({
                    lat:response.data.results[0].geometry.location.lat,
                    long:response.data.results[0].geometry.location.lng
                })
                tmp.push(<Marker
                    tappable={true}
                    coordinate={{
                      latitude: response.data.results[0].geometry.location.lat,
                      longitude: response.data.results[0].geometry.location.lng,
                    }}
                    onPress={showDialog}
                    title={'Test Marker'}
                    description={'This is a description of the marker'}
                  />)
            }
            setMarkers(tmp)
            setCoords(coords)
        }
    }
    wrap()
  },[evenements])
  
  return (
    
    <View style={styles.container}>
        
      <View style={[styles.header,_Theme.themeBack,_Theme.themeShadow]}>
        <IconButton
          icon="cog"
          iconColor={_Theme.themeIcon.color}
          onPress={() => router.push("/../settings")}
          style={styles.settings}
        />
        <IconButton
          icon={drawerDeployed?"menu-open":"menu"}
          iconColor={_Theme.themeIcon.color}
          onPress={drawerDeployed?endAnimation:startAnimation}
          style={styles.drawer}
        />
        <Text style={[styles.headerText,_Theme.themeText]}>Logo</Text>
        <Avatar
          size={48}
          rounded
          icon={{ name: "person", type: "material" }}
          containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 15, right: 15 }}
          onPress={() => router.push("/../profile")}
        />
      </View>
      
      <SafeAreaView style={{flex: 1}}>
        <Animated.View style={{zIndex:3,position:'absolute',width:`${drawerWidth}%`,backgroundColor:"white",height:ScreenHeight,left:leftDecal}}>
            <Drawer.Section title="Some title">
                {
                     evenements.map((evenement,index) => {
                        return(
                            <Drawer.Item
                                key={index}
                                label={evenement.activity.title}
                                active={active === index.toString()}
                                onPress={
                                    () => {
                                        setActive(index.toString())
                                        setActualIndex(index)
                                        endAnimation()
                                        showDialog()
                                    }
                                }
                            />
                        )
                    })
                }
              
            </Drawer.Section>
        </Animated.View>
        
        
      <View style={styles.container}>

    
      <MapView
            style={styles.mapStyle}
    
            region={{
                latitude: actualLat,
                longitude:  actualLong,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            customMapStyle={mapStyle}>
            {markers}
        </MapView>
      </View>
    </SafeAreaView>

    

    <Dialog style={{backgroundColor:"white"}} visible={visible} onDismiss={hideDialog}>
          
          <Dialog.Icon icon="alert" />
          <Dialog.Title>Voulez-vous vraiment vous inscrire ?</Dialog.Title>
          <Dialog.Content>
                <Card style={[{marginVertical: 20 },_Theme.themeCard]}>
                  <Card.Cover source={{ uri: evenements[actualIndex]?evenements[actualIndex].activity.image:"" }} />
                  <Card.Title titleStyle={{color:_Theme.themeText.color}} subtitleStyle={{color:_Theme.themeText.color}} title={evenements[actualIndex]?evenements[actualIndex].activity.title:""} subtitle={evenements[actualIndex]?evenements[actualIndex].date:""}/>
                  {/* <Card.Content>
                    <Text style={_Theme.themeText}>{activities[i].adresse}</Text>
                    <Text style={_Theme.themeText}>{activities[i].description}</Text>
                  </Card.Content> */}

                </Card>
  
    
            <Button  buttonColor="black" icon="login" mode="contained" onPress={()=>{"yes"}}>
              S'inscrire
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

const mapStyle = [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{color: '#263c3f'}],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#6b9a76'}],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#38414e'}],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{color: '#212a37'}],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9ca5b3'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#746855'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#1f2835'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{color: '#f3d19c'}],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{color: '#2f3948'}],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#17263c'}],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#515c6d'}],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#17263c'}],
    },
  ];

const styles = StyleSheet.create({
    container: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width:ScreenWidth,
        height:ScreenHeight,
      },
      mapStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
  header: {
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    borderBottomWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerText: {
    top: 10,
    color: 'black',
    fontSize: 20,
  },
  settings: {
    position: 'absolute', 
    bottom: 10, 
    left: 10,
  },
  drawer: {
    position: 'absolute', 
    bottom: 10, 
    left: 70,
  }
});