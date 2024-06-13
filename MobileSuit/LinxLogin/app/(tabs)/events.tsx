import { Avatar } from "@rneui/themed";
import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Dimensions, SafeAreaView, Animated, Modal,Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton, MD3Colors, Card, Button, ActivityIndicator, Dialog, Drawer, TextInput, Menu, Divider, Provider, PaperProvider, List } from "react-native-paper";
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
import { jwtDecode } from 'jwt-decode';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Carousel, { Pagination, ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from "react-native-reanimated";

const HEADER_HEIGHT = 100;
const { width } = Dimensions.get('window');
const drawerWidth = 75

const slideData = [
  {
    id: '1',
    src:'https://mdbootstrap.com/img/new/slides/041.jpg'
  },
  {
    id: '2',
    src: 'https://mdbootstrap.com/img/new/slides/042.jpg'
  },
  {
    id: '3',
    src: 'https://mdbootstrap.com/img/new/slides/043.jpg'
  }
]

export default function CatalogScreen() {
  const router = useRouter();
  const [evenements,setEvenements] = useState<evenement[]>([])
  const [componentActivities,setComponentActivities] = useState<JSX.Element[]>([])
  const [jwt,setJwt] = useState<string>();
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
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [value, setValue] = useState(slideData[0].src);
  const [adresseLoading, setAdresseLoading] = useState("")
  const [propsAdresse,setPropsAdresse] = useState("")
  const [trueAdresse, setTrueAdresse] = useState("")

  const [actualIndexImg,setActualIndexImg] = useState(0)

  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");


  const googlekey = "AIzaSyAOpVdDvYUvbIB_u_d6k_HVfw13_Vux0K0"

  const [visible, setVisible] = useState(false);

  const [actualIndex,setActualIndex] = useState(0)

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [visibleMenu, setVisibleMenu] = useState(false);
  const [visibleMenu2, setVisibleMenu2] = useState(false);

  const openMenu = () => setVisibleMenu(true);

  const closeMenu = () => setVisibleMenu(false);

  const openMenu2 = () => setVisibleMenu2(true);

  const closeMenu2 = () => setVisibleMenu2(false);

  const _Theme = Theme();

  const onChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const fetchAdresse = async(adresse:string) => {
    setPropsAdresse(adresse)
    const data = {
      "address": {
          "regionCode": "FR",
          "addressLines": [adresse]
      } 
    }
  const reponse = await axios.post("https://addressvalidation.googleapis.com/v1:validateAddress?key=AIzaSyAOpVdDvYUvbIB_u_d6k_HVfw13_Vux0K0",data)
  setAdresseLoading(reponse.data.result.address.formattedAddress)
  setTrueAdresse(reponse.data.result.address.formattedAddress)
    
  }

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
  
  const register = async() => {
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const data = {
      id:evenements[actualIndex]._id
  }
    const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/EventRegister`,data, {headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    console.log(response)
    hideDialog()
  
  }



  const createEvent = async() => {
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const data = {
      activity:{
        title:title,
        description:description,
        image:slideData[actualIndexImg].src,
        adresse:trueAdresse,
      },
      date:date,
      nbinvities:text,
    }

    console.log(data)

    const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/createEvenement`,data, {headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    console.log(response)
    setModalVisible(!modalVisible)
  }

  useEffect(()=>{
    const getActivities = async() => {
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const decoded = jwtDecode(jwt_cookie?jwt_cookie:"")
      console.log(decoded)
      const email = 'email'in decoded?decoded.email:""
      setJwt(typeof(email)=="string"?email:"")
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
                    onPress={()=>{
                      setActualIndex(i)
                      showDialog()
                    }}
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
    
    <PaperProvider>
      <View style={styles.container}>

    
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          >
            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
          
            <View style={styles.modalView}>
              <KeyboardAwareScrollView contentContainerStyle={[styles.centeredView]}>
              
              <View style={styles.horizontal}>
                <Text style={{justifyContent:'center',alignItems:'center',flex:1}}>Titre</Text>
                <TextInput
                  style={{width:"80%"}}
                  label="Titre"
                  mode="outlined"
                  value={title}
                  onChangeText={text => setTitle(text)}
                />
              </View>
              <Text style={{left:0,width:"100%",padding:10}}>Description</Text>
              <TextInput
                style={{width:"100%"}}
                label="Titre"
                mode="outlined"
                value={description}
                onChangeText={text => setDescription(text)}
              />
              <Text style={{left:0,width:"100%",padding:10}}>Adresse</Text>
              <TextInput
                style={{width:"100%",height:70}}
                label="Titre"
                mode="outlined"
                value={propsAdresse}
                dense={true}
                onPress={openMenu2}
                onChangeText={text => fetchAdresse(text)}
              />
              {adresseLoading.length>0?
                <List.Section style={{height:70}}>
                <List.Item  style={{height:70}} onPress={()=>{setPropsAdresse(adresseLoading);setAdresseLoading("")}} title={"Adresse"} description={adresseLoading} left={() => <List.Icon icon="map-marker" />} />
              </List.Section>:<></>
              }
              

              <View style={{ height: 200 ,width:200,alignItems:'center'}}>

                <Carousel
                  ref={carouselRef}
                  loop={false}
                  
                  width={300}
                  autoPlay={false}
                  data={slideData}
                  onProgressChange={progress}
                  scrollAnimationDuration={500}
                  style={{ height: 200 ,width:300,borderColor:"black"}}
                  // onScrollStart={() => {
                  //   const index = slideData.findIndex(slide => slide.title === value);
                  //   animateUnderline(index);
                  // }}
                  onSnapToItem={(index) => {
                    setActualIndexImg(index)
                    console.log('current index:', index);
                    setValue(slideData[index].src);
                  }}
                  renderItem={({ item }) => (
                    <View style={styles.slide}>
                      <Image source={{uri:item.src}} style={{width:300,height:200, transform:"scale(0.8)"}}/>
                      
                    </View>
                  )}
                />
              </View>
              
              
              
            
              <View style={styles.horizontal}>
                <Text style={{justifyContent:'center',alignItems:'center',flex:1}}>Nombre d'invités</Text>
                <TextInput
                  label="Invités"
                  mode="outlined"
                  value={text}
                  keyboardType = 'numeric'
                  onChangeText={text => setText(text)}
                />
              </View>
              <View style={styles.horizontal}>
                <Text style={{justifyContent:'center',alignItems:'center',flex:1}}>Date de l'évènement</Text>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChange}
                />
              
              </View>
              <View style={styles.horizontal}>
                <Button onPress={()=>{setModalVisible(!modalVisible)}} mode="contained" style={[_Theme.themeBouton]}>
                  Annuler
                </Button>
                <Button onPress={createEvent} mode="contained" style={[_Theme.themeBouton]}>
                  Creer
                </Button>
              </View>
              </KeyboardAwareScrollView>   
            </View>
            </View>
        
        </Modal>
     
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
        <IconButton
              icon={"plus"}
              iconColor={_Theme.themeIcon.color}
              onPress={openMenu}
              style={styles.create}
        />
         <Menu
            visible={visibleMenu}
            onDismiss={closeMenu}
            style={styles.create}
            anchor={{x:ScreenWidth-50,y:50}}
          >
          <Menu.Item onPress={() => {router.push("catalog");setVisibleMenu(!visibleMenu)}} title="Choisir parmi le catalogue" />
          <Divider />
          <Menu.Item onPress={() => {setModalVisible(!modalVisible);setVisibleMenu(!visibleMenu)}} title="Créer un évènement personnalisé" />
        </Menu>

        
   
        
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
            <Drawer.Section title="Liste des évènements">
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
  
                  
                <Text>
                    {evenements[actualIndex]?(evenements[actualIndex].participants.indexOf(jwt?jwt:"")==-1?"":"Vous êtes déjà inscrits"):""}
                </Text>
                <Text>
                    {evenements[actualIndex]?(evenements[actualIndex].participants.length >= (parseInt(evenements[actualIndex].nbinvities) +1)?"Evenement complet":""):""}
                </Text>
    
            <Button disabled={evenements[actualIndex]?((evenements[actualIndex].participants.indexOf(jwt?jwt:"")!=-1  || evenements[actualIndex].participants.length >= (parseInt(evenements[actualIndex].nbinvities) +1))?true:false):false} buttonColor="black" icon="login-variant" mode="contained" onPress={register}>
              S'inscrire
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={colorMain} onPress={hideDialog}>Retour</Button>
          </Dialog.Actions>
      </Dialog>
    </View>
  </PaperProvider>
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
    left: 50,
  },
  create: {
    position: 'absolute', 
    bottom: 10, 
    left: 90,
  },
  centeredView: {
    padding:40,
    width:"100%",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  horizontal: {
    alignItems:'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,

  },
  vertical: {
    alignItems:'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,

  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  slideContent: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  modalView: {
    width:"80%",
    maxHeight:"80%",
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0,
    justifyContent:'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});