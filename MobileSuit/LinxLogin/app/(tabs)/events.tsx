import { Avatar } from "@rneui/themed";
import { useFocusEffect, useRouter } from "expo-router";
import { Text, View, StyleSheet, Dimensions, SafeAreaView, Animated, Modal,Image, Platform, useColorScheme } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton, MD3Colors, Card, Button, ActivityIndicator, Dialog, Drawer, TextInput, Menu, Divider, Provider, PaperProvider, List } from "react-native-paper";
import { useState , useEffect, useRef, useCallback } from "react";
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
import {Picker} from '@react-native-picker/picker';

const HEADER_HEIGHT = 100;
const { width } = Dimensions.get('window');
const height = Dimensions.get('window').height;
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

const maxLegnth = 40

export default function CatalogScreen() {
  const router = useRouter();
  const [evenements,setEvenements] = useState<evenement[]>([])
  const [evenementsRecommandes,setEvenementsRecommandes] = useState<evenement[]>([])
  const [componentActivities,setComponentActivities] = useState<JSX.Element[]>([])
  const [jwt,setJwt] = useState<string>();
  const [isjwt,setisjwt] = useState(-1)
  const [islogin,setLogin] = useState(-1)
  const [isLoaded,setIsLoaded] = useState(false)
  const [markers, setMarkers] = useState<JSX.Element[]>([])
  const [active, setActive] = useState('');
  const leftDecal =  useState(new Animated.Value(-drawerWidth*4 - 10))[0];
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
  const [picture, setPicture] = useState("")
  const [actualIndexImg,setActualIndexImg] = useState(0)
  const [type, setType] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");
  const [showAndroid, setshowAndroid] = useState(false)
  const [notif,setNotif] = useState(false)
  const [dol,setTheme] = useState(useColorScheme())

  const googlekey = "AIzaSyAOpVdDvYUvbIB_u_d6k_HVfw13_Vux0K0"

  const [visible, setVisible] = useState(false);

  const [actualIndex,setActualIndex] = useState(0)
  const [recommandeActualIndex,setRecommandeActualIndex] = useState(0)
  const [recommande, setRecommande] = useState(false)

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [visibleMenu, setVisibleMenu] = useState(false);
  const [visibleMenu2, setVisibleMenu2] = useState(false);

  const openMenu = () => setVisibleMenu(true);

  const closeMenu = () => setVisibleMenu(false);

  const openMenu2 = () => setVisibleMenu2(true);

  const closeMenu2 = () => setVisibleMenu2(false);

  const _Theme = Theme();

  const types = [
    'Cinéma', 'Attractions', 'Animaux', 'Théâtre', 'Danse',
    'Manga/Anime', 'Séries', 'Échecs', 'Moto', 'Lecture',
    'Jeux vidéos', 'Musique', 'BD/Comics', 'Voyager', 'Musées',
    'Sortir entre amis', 'Sport', 'Nourriture', 'La mode'
  ];

  const onChange = (event:any, selectedDate:any) => {
    setshowAndroid(false)
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
        toValue: -drawerWidth*4 - 10, // Move to -60
        duration: 400, // Animation duration in ms
        useNativeDriver: false, // 'left' is not supported by native driver
      }).start();
      setDrawerDeployed(false)
  }
  
  const register = async() => {
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const data = {
      id: recommande ? evenementsRecommandes[recommandeActualIndex]._id : evenements[actualIndex]._id
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
      type:type,
      nbinvities:text,
    }

    console.log(data)

    const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/createEvenement`,data, {headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    console.log(response)
    setModalVisible(!modalVisible)
    getActivities()
  }
  const getActivities = async() => {
    const today = new Date();
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const decoded = jwtDecode(jwt_cookie?jwt_cookie:"")
    console.log(decoded)
    const email = 'email'in decoded?decoded.email:""
    setJwt(typeof(email)=="string"?email:"")
    const response = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/evenements`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    let event_tmp = []
    for(let i=0;i<response.data.length;i++){
      if(new Date(response.data[i].date)>=today) {
        event_tmp.push(response.data[i])
      }
    }
    setEvenements(event_tmp)
    setIsLoaded(true)
    const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    setPicture("")
    setPicture(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${reponse.data.image}`)
    setNotif(reponse.data.friendRequests.length>0)
    const tmp = []
    for(let i=0;i<response.data.length;i++){
      if(reponse.data.activities.includes(response.data[i].type) && new Date(response.data[i].date)>=today) {
        tmp.push(response.data[i])
      }
    }
    console.log(tmp)
    setEvenementsRecommandes(tmp)
  }

  useFocusEffect(useCallback(()=>{
    
    getActivities()

  

  },[]))

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
            const today = new Date();
            const jwt_cookie = await AsyncStorage.getItem("jwt")
            const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
            for(let i = 0; i<evenements.length;i++){
                if(new Date(evenements[i].date)>=today){
                  
               
                  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(evenements[i].activity.adresse)}&key=${googlekey}`);
                  coords.push({
                      lat:response.data.results[0].geometry.location.lat,
                      long:response.data.results[0].geometry.location.lng
                  })
                  tmp.push(<Marker
                      pinColor={reponse.data.activities.includes(evenements[i].type)?"gold":"red" }
                      
                      tappable={true}
                      coordinate={{
                        latitude: response.data.results[0].geometry.location.lat,
                        longitude: response.data.results[0].geometry.location.lng,
                      }}
                      onPress={()=>{
                        setActualIndex(i)
                        showDialog()
                      }}
                      title={evenements[i].activity.title}
                      description={evenements[i].activity.description.length>maxLegnth?`${evenements[i].activity.description.substring(0,maxLegnth-3)}...`: evenements[i].activity.description}
                    />)
                }
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
          
            <View style={[styles.modalView, _Theme.themeBack2]}>
              <KeyboardAwareScrollView contentContainerStyle={[styles.centeredView]}>
              
                <View style={styles.horizontal}>
                  <Text style={[{justifyContent:'center',alignItems:'center',flex:1}, _Theme.themeText]}>Titre</Text>
                  <TextInput
                    outlineColor={_Theme.themeBouton.backgroundColor}
                    activeOutlineColor={_Theme.themeBouton.backgroundColor}
                    style={[{width:"80%"},_Theme.themeBack2]}
                    label="Titre"
                    mode="outlined"
                    value={title}
                    onChangeText={text => setTitle(text)}
                  />
                </View>
                <Text style={[{left:0,width:"100%",padding:10}, _Theme.themeText]}>Description</Text>
                <TextInput
                  outlineColor={_Theme.themeBouton.backgroundColor}
                  activeOutlineColor={_Theme.themeBouton.backgroundColor}
                  style={[{width:"100%"},_Theme.themeBack2]}
                  label="Titre"
                  mode="outlined"
                  value={description}
                  onChangeText={text => setDescription(text)}
                />
                <Text style={[{left:0,width:"100%",padding:10}, _Theme.themeText]}>Adresse</Text>
                <TextInput
                  outlineColor={_Theme.themeBouton.backgroundColor}
                  activeOutlineColor={_Theme.themeBouton.backgroundColor}
                  style={[{width:"100%",height:70},_Theme.themeBack2]}
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
                
                
                
              
                <View style={[styles.horizontal, _Theme.themeBack2]}>
                  <Text style={[{justifyContent:'center',alignItems:'center',flex:1}, _Theme.themeText]}>Nombre d'invités</Text>
                  <TextInput
                    outlineColor={_Theme.themeBouton.backgroundColor}
                    activeOutlineColor={_Theme.themeBouton.backgroundColor}
                    style={_Theme.themeBack2}
                    label="Invités"
                    mode="outlined"
                    value={text}
                    keyboardType = 'numeric'
                    onChangeText={text => setText(text)}
                  />
                </View>
                <View style={[styles.horizontal, _Theme.themeBack2]}>
                  <Text style={[{justifyContent:'center',alignItems:'center',flex:1}, _Theme.themeText]}>Date de l'évènement</Text>
                  {Platform.OS === 'ios' && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    onChange={onChange}
                  />)}
                  {Platform.OS === 'android' && (<>
                    <Button mode={'text'} onPress={()=>setshowAndroid(!showAndroid)} textColor={_Theme.themeText.color}>{date.toDateString()}</Button>
                    {showAndroid && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        onChange={onChange}
                      />
                    )}
                    </>
                  )}
                
                </View>
              
                <Text style={[{left:0,width:"100%",padding:10}, _Theme.themeText]}>Catégorie</Text>
                <Picker
                  style={[{width:"100%",justifyContent:"center",height:Platform.OS=='ios'?200:40}, _Theme.themeBack2]}
                  selectionColor={_Theme.themeText.color}
                  itemStyle={_Theme.themeBack2}
                  dropdownIconColor={_Theme.themeIcon.color}
                  selectedValue={type}
                  onValueChange={(itemValue, itemIndex) =>
                    setType(itemValue)
                  }>
                  {types.map((type,index) => {
                    return(
                      <Picker.Item key={index} label={type} value={type} color={_Theme.themeText.color} style={_Theme.themeBack2}/>
                    )
                  })}
                </Picker>
                
                <View style={{ width:'100%', justifyContent:'space-between',   padding:10,    flexDirection: 'row',}}>
                  <Button onPress={()=>{setModalVisible(!modalVisible)}} mode="outlined" style={_Theme.themeBouton2} textColor={_Theme.themeBouton2.color}>
                    Annuler
                  </Button>
                  <Button onPress={createEvent} mode="contained" style={_Theme.themeBouton} textColor={_Theme.themeBouton.color}>
                    Creer
                  </Button>
                </View>
              </KeyboardAwareScrollView>   
            </View>
            </View>
        
        </Modal>
     
      <View style={[styles.header,_Theme.themeBack,_Theme.themeShadow]}>
        <IconButton
          icon={notif?"bell-badge":"bell"}
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
    
        
   
        
        <Image style={styles.logo} source={dol==='light'?require("../../assets/images/logo.png"):require("../../assets/images/logoWhite.png")}/>
        <Avatar
          size={48}
          rounded
          source={{uri:picture}}
          icon={{ name: "person", type: "material" }}
          containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 15, right: 15 }}
          onPress={() => router.push("/../profile")}
        />
      </View>
      
      <SafeAreaView style={{flex: 1}}>
        <Animated.View style={{zIndex:3,position:'absolute',width:`${drawerWidth}%`,backgroundColor:_Theme.themeBack2.backgroundColor,height:ScreenHeight,left:leftDecal}}>
          <Drawer.Section title="Evènements recommandés pour vous" theme={{colors: {onSurfaceVariant: _Theme.themeBouton2.color}}}>
                <ScrollView style={{height:"30%"}}>
                {
                     evenementsRecommandes.map((evenement,index) => {
                        
                        return(
                            <Drawer.Item
                                key={index}
                                label={evenement.activity.title}
                                active={active === index.toString()}
                                onPress={
                                    () => {
                                        setActive(index.toString())
                                        setRecommande(true)
                                        setRecommandeActualIndex(index)
                                        endAnimation()
                                        showDialog()
                                    }
                                }
                            />
                        )
                    })
                }
                </ScrollView>
            </Drawer.Section>
            <Drawer.Section title="Liste des évènements" theme={{colors: {onSurfaceVariant: _Theme.themeBouton2.color}}}>
                <ScrollView style={{height:"30%"}}>
                {
                     evenements.map((evenement,index) => {
                        return(
                            <Drawer.Item
                                key={evenementsRecommandes.length+index}
                                label={evenement.activity.title}
                                active={active === evenementsRecommandes.length+index.toString()}
                                onPress={
                                    () => {
                                        setActive(index.toString())
                                        setRecommande(false)
                                        setActualIndex(index)
                                        endAnimation()
                                        showDialog()
                                    }
                                }
                            />
                        )
                    })
                }
                </ScrollView>
              
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
 

       

        <View style={[styles.createMenu, { bottom:Platform.OS=='ios'?190:130 }]}>
          <Menu
            visible={visibleMenu}
            onDismiss={closeMenu}
            contentStyle={{bottom:Platform.OS=='ios'?100:70, right:50}}
            anchorPosition='top'
            anchor={ <IconButton
              icon={"plus"}
              iconColor={_Theme.themeIcon.color}
              onPress={openMenu}
              size={40}
              style={{backgroundColor:_Theme.themeBouton.backgroundColor}}
          />}
            >
            <Menu.Item onPress={() => {router.push("catalog");setVisibleMenu(!visibleMenu)}} title="Choisir parmi le catalogue" />
            <Divider />
            <Menu.Item onPress={() => {setModalVisible(!modalVisible);setVisibleMenu(!visibleMenu)}} title="Créer un évènement personnalisé" />
          </Menu>
        </View>
      </View>
    </SafeAreaView>

    

    <Dialog style={_Theme.themeBack2} visible={visible} onDismiss={hideDialog}>
          
          <Dialog.Icon icon="alert" color={_Theme.themeIcon.color}/>
          <Dialog.Title style={[_Theme.themeText, {textAlign: 'center'}]}>Voulez-vous vraiment vous inscrire ?</Dialog.Title>
          <Dialog.Content>
                <Card style={[{marginVertical: 20 },_Theme.themeCard]}>
                  <Card.Cover source={{ uri: recommande ? (evenementsRecommandes[recommandeActualIndex] ? evenementsRecommandes[recommandeActualIndex].activity.image : "") : (evenements[actualIndex] ? evenements[actualIndex].activity.image : "") }} />
                  <Card.Title titleStyle={{color:_Theme.themeText.color}} subtitleStyle={{color:_Theme.themeText.color}} title={recommande ? (evenementsRecommandes[recommandeActualIndex] ? evenementsRecommandes[recommandeActualIndex].activity.title : "") : (evenements[actualIndex] ? evenements[actualIndex].activity.title : "")} subtitle={recommande ? (evenementsRecommandes[recommandeActualIndex] ? evenementsRecommandes[recommandeActualIndex].date:"") : (evenements[actualIndex] ? evenements[actualIndex].date : "")}/>
                  {/* <Card.Content>
                    <Text style={_Theme.themeText}>{activities[i].adresse}</Text>
                    <Text style={_Theme.themeText}>{activities[i].description}</Text>
                  </Card.Content> */}

                </Card>
  
                  
                <Text style={_Theme.themeText}>
                    {recommande ? (evenementsRecommandes[recommandeActualIndex] ? (evenementsRecommandes[recommandeActualIndex].participants.indexOf(jwt ? jwt : "")==-1 ? "" : "Vous êtes déjà inscrits") : "") : (evenements[actualIndex] ? (evenements[actualIndex].participants.indexOf(jwt ? jwt : "")==-1 ? "" : "Vous êtes déjà inscrits") : "")}
                </Text>
                <Text style={_Theme.themeText}>
                    {recommande ? (evenementsRecommandes[recommandeActualIndex] ? (evenementsRecommandes[recommandeActualIndex].participants.length >= (parseInt(evenementsRecommandes[recommandeActualIndex].nbinvities) +1) ? "Evenement complet" : "") : "") : (evenements[actualIndex] ? (evenements[actualIndex].participants.length >= (parseInt(evenements[actualIndex].nbinvities) +1) ? "Evenement complet" : "") : "")}
                </Text>
    
            <Button 
              disabled={recommande ? (evenementsRecommandes[recommandeActualIndex] ? ((evenementsRecommandes[recommandeActualIndex].participants.indexOf(jwt ? jwt : "")!=-1  || evenementsRecommandes[recommandeActualIndex].participants.length >= (parseInt(evenementsRecommandes[recommandeActualIndex].nbinvities) +1)) ? true : false) : false) : (evenements[actualIndex] ? ((evenements[actualIndex].participants.indexOf(jwt ? jwt : "")!=-1  || evenements[actualIndex].participants.length >= (parseInt(evenements[actualIndex].nbinvities) +1)) ? true : false) : false)} 
              buttonColor={_Theme.themeBouton.backgroundColor} 
              textColor={_Theme.themeBouton.color}
              icon="login-variant" 
              mode="contained" 
              onPress={register}
            >
              S'inscrire
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="text" textColor={_Theme.themeBouton2.color} onPress={hideDialog}>Retour</Button>
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
  createMenu: {
    position:'absolute',
    right:10,
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
    width:"90%",
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
  logo: {
    marginBottom:50,
    width: 150,
    transform:'scale(0.6)',
    top:40,
    height: 115,
  },
});