import { Link, useFocusEffect, useRouter } from "expo-router";
import {Image, Text, View, StyleSheet ,Dimensions, Platform, Animated, useColorScheme} from "react-native";
import { Avatar } from '@rneui/themed';
import { useCallback, useEffect, useState  } from "react";
import { Button, Dialog, IconButton, List, MD3Colors, Modal, PaperProvider, Portal, RadioButton, Snackbar, TextInput } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { all } from 'axios'
import Config from '../../config.json'
import { Checkbox } from 'react-native-paper';
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { ScreenHeight, Slider ,Icon, ScreenWidth, ListItem} from "@rneui/base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Theme from "@/constants/Theme";
import RIcon from '@mdi/react';
import { mdiCalendarMultipleCheck } from '@mdi/js';
import { evenement } from "@/constants/evenement";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { jwtDecode } from "jwt-decode";
import { user } from "@/constants/user";

const HEADER_HEIGHT = 100;
const { width,height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [visibleD, setVisibleD] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [firstLogin,setFirstLogin] = useState(false)
  const [sOd, setSOd] = useState('');
  const [value, setValue] = useState(0);
  const [value2, setValue2] = useState(0);
  const [checked1, setChecked1] = useState('first');
  const [checked2, setChecked2] = useState('first');
  const [checked3, setChecked3] = useState('first');
  const [checked4, setChecked4] = useState('first');
  const [host,setHost] = useState("")
  const [text,setText] = useState("")
  const [events,setEvents] = useState<evenement[]>([])
  const [eventSoonComponent, setEventSoonComponent] = useState<React.JSX.Element[]>([])
  const [eventPastComponent, setEventPastComponent] = useState<React.JSX.Element[]>([])
  const [expandedSoon, setExpandedSoon] = useState(true);
  const [expandedPast, setExpandedPast] = useState(false);
  const [picture, setPicture] = useState("")
  const [notif,setNotif] = useState(false)
  const [dol,setTheme] = useState(useColorScheme())
  const [idToSoD,setidToSoD] = useState("")
  const [me, setMe] = useState("")
  //snackbar
  const [snack, setSnack] = useState(false);

  const onToggleSnackBar = () => setSnack(!snack);

  const onDismissSnackBar = () => setSnack(false);

  const containerStyle = {backgroundColor: 'white', padding: 20};
  const showDialog = () => setVisibleD(true);

  const hideDialog = () => setVisibleD(false);

  const _Theme = Theme();

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
  
  const handleCheckboxPress = (activity:any) => {
    setCheckedState({
      ...checkedState,
      [activity]: !checkedState[activity],
    });
  };

  useFocusEffect(useCallback(() => {
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setNotif(reponse.data.friendRequests.length>0)
      setFirstLogin(reponse.data.firstLogin)
      if(reponse.data.image!=null){
        setPicture("")
        setPicture(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${reponse.data.image}`)
      }
      const reponseEvents = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getEvents`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setEvents(reponseEvents.data)
    }
    wrap()
    handleCheckboxPress('Cinéma')
    handleCheckboxPress('Jeux vidéos')
    
  },[]))

  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const decode:user = jwtDecode(jwt_cookie?jwt_cookie:"")
      setMe(decode.email)
    }
    wrap()
  },[])

  useEffect(()=>{
    const wrap = async() => {
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const allUsers = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getAllUsers`,{headers:{Cookie:`jwt=${jwt_cookie}`}, withCredentials:false})
      let tmp:React.JSX.Element[] = []
      let tmp2:React.JSX.Element[] = []
      if(events.length>0){
        for(let i = 0; i<events.length;i++){
          console.log(allUsers.data.find((user:user)=>user.email ==events[i].host))
          const date = new Date(events[i].date)
          const today = new Date()
          if(date.getDate() >= today.getDate() && date.getMonth() >= today.getMonth() && date.getFullYear() >= today.getFullYear()){
            tmp.push(
              <Swipeable  dragOffsetFromLeftEdge={0}  renderLeftActions={(progress:any, dragX:any,event:any)=>{return renderLeftActions(events[i]._id,events[i].host)}}>

              <ListItem 
                containerStyle={[_Theme.themeBack2]}
                key={i}  
                bottomDivider 
                style={_Theme.themeBack2}
                onPress={() => {router.push(`/../chat/${events[i]._id}`)}}
              >
                <Avatar title={"ok"} source={{ uri: `${Config.scheme}://${Config.urlapi}:${Config.portapi}/${allUsers.data.find((user:user)=>user.email ==events[i].host).image  }` }} />
                <ListItem.Content style={_Theme.themeBack2}>
                  <ListItem.Title style={_Theme.themeText}>{events[i].activity.title}</ListItem.Title>
                  <ListItem.Subtitle style={_Theme.themeText}>{events[i].date}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron style={_Theme.themeText}/>
              </ListItem>
              </Swipeable>
            )
          }
          else{

            tmp2.push(
              <ListItem
                  key={i}  
                  bottomDivider 
                  containerStyle={[_Theme.themeBack2]}
                  style={[_Theme.themeBack2]}
                  onPress={() => {router.push(`/../chat/${events[i]._id}`)}}>
                <Avatar title={"ok"} source={{ uri: `${Config.scheme}://${Config.urlapi}:${Config.portapi}/${allUsers.data.find((user:user)=>user.email ==events[i].host).image  }` }}  />
                <ListItem.Content style={_Theme.themeBack2}>
                  <ListItem.Title style={_Theme.themeText}>{events[i].activity.title}</ListItem.Title>
                  <ListItem.Subtitle style={_Theme.themeText}>{events[i].date}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron style={_Theme.themeText}/>
              </ListItem>
            )
          }
          
        }

        setEventSoonComponent(tmp)
        setEventPastComponent(tmp2)
     }
      
      
    }

    wrap()
  },[events])

  useFocusEffect(useCallback(() => {
    if(firstLogin){
      showModal()
    }
  },[firstLogin,router]))

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
  

  const remplirForm = async()=>{
    console.log(checkedState)
    const _activities = Object.keys(checkedState).filter((key:any) => checkedState[key] === true);
    console.log(_activities)
    console.log(checked1)
    console.log(checked2)
    console.log(checked3)
    console.log(checked4)
    console.log(value)
    console.log(value2)
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
    setFirstLogin(false)
    onToggleSnackBar()
  }

  const desinscription = async() => {
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/ParticipantDelete`,{id:idToSoD},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    console.log(response.data)
    hideDialog()
    const reponseEvents = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getEvents`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    setEvents(reponseEvents.data)
  }

  const supprimerEvent = async() => {
    const jwt_cookie = await AsyncStorage.getItem("jwt")
    console.log("ok")
    const response = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/EventDelete`,{id:idToSoD},{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    console.log(response.data)
    hideDialog()
    const reponseEvents = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getEvents`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    setEvents(reponseEvents.data)

  }
  // (progress, dragX) => {
  //   const trans = dragX.interpolate({
  //     inputRange: [0, 50, 100, 101],
  //     outputRange: [-20, 0, 0, 1],
  //   });
  //   return (
  //     <RectButton style={styles.leftAction} onPress={this.close}>
  //       <Animated.Text
  //         style={[
  //           styles.actionText,
  //           {
  //             transform: [{ translateX: trans }],
  //           },
  //         ]}>
  //         Archive
  //       </Animated.Text>
  //     </RectButton>
  //   );

  const renderLeftActions = (id:string,host:string) => {
    console.log(host)
    setHost(host)
    setidToSoD(id)
    return (
      <RectButton style={{width:"30%",backgroundColor:me==host?"red":"orange",     justifyContent:'center',          alignItems:'center',}} onPress={()=>{showDialog()}}>
        <Animated.Text
          style={[
          
            {
            
              color: 'black',
 
              textAlign:'center',
            },
          ]}>
          {me==host?"Supprimer":"Se désinscrire"}
        </Animated.Text>
      </RectButton>
    );
  };

  
  return (
    <PaperProvider>
    <View style={styles.container}>
    
      <View style={[styles.header,_Theme.themeBack,_Theme.themeShadow]}>
        <IconButton
          icon={notif?"bell-badge":"bell"}
          iconColor={_Theme.themeIcon.color}
          onPress={() => router.push("/../settings")}
          style={styles.settings}
        />
        <Image style={styles.logo} source={dol==='light'?require("../../assets/images/logo.png"):require("../../assets/images/logoWhite.png")}/>

        <Avatar
          size={48}
          rounded
          source={{ uri: picture }}
          icon={{ name: "person", type: "material" }}
          containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 15, right: 15 }}
          onPress={() => router.push("/../profile")}
        />
      </View>
      <Portal>
        <Dialog visible={visibleD} onDismiss={hideDialog}>
          <Dialog.Title> {me==host?"Supprimer":"Desinscription"}</Dialog.Title>
          <Dialog.Content>
            <Text>Etes-vous sur ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={()=>{sOd=="Supprimer"?supprimerEvent():desinscription()}}>Oui</Button>
            <Button onPress={hideDialog}>Annuler</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      <View style={[styles.body,_Theme.themeBack2]}>
        <ScrollView style={{maxHeight:"45%"}}>
        <ListItem.Accordion
          containerStyle={[_Theme.themeBack2]}  
          icon={ <Icon color={_Theme.themeIcon.color} type='material-community' name="menu-up" size={30} />}
          content={
            <>
              <Icon color={_Theme.themeIcon.color} type='material-community' name="calendar-multiple" size={30} />
              <ListItem.Content style={_Theme.themeBack2}>
                <ListItem.Title style={_Theme.themeText}> Evénements à venir</ListItem.Title>
              </ListItem.Content>
            </>
          }
          isExpanded={expandedSoon}
          onPress={() => {
            setExpandedSoon(!expandedSoon);
          }}
        >
          {eventSoonComponent}
          
        </ListItem.Accordion>
        </ScrollView>
        <ScrollView style={{maxHeight:"45%"}}>
          <ListItem.Accordion
            containerStyle={[_Theme.themeBack2]}
            icon={ <Icon color={_Theme.themeIcon.color} type='material-community' name="menu-up" size={30} />}
            content={
              <>
                  <Icon color={_Theme.themeIcon.color} type='material-community' name="calendar-multiple-check" size={30}  />
                  <ListItem.Content style={_Theme.themeBack2}>
                    <ListItem.Title style={_Theme.themeText}> Evenements passés</ListItem.Title>
                  </ListItem.Content>
              </>
            }
            isExpanded={expandedPast}
            onPress={() => {
              setExpandedPast(!expandedPast);
            }}
          >
        
            {eventPastComponent}
            
          </ListItem.Accordion>
        </ScrollView>
      </View>
      <Modal visible={visible} onDismiss={hideModal} style={{marginTop: HEADER_HEIGHT + 20, maxHeight: ScreenHeight, width: width, padding: 20}}>
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

      
      <Snackbar
        visible={snack}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'OK',
          onPress: () => {
            onDismissSnackBar()
          },
        }}>
        Questionnaire rempli !
      </Snackbar>
    </View>
    </PaperProvider>
  );
}
const colorMain = '#99c3ff'
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
    borderBottomWidth: 1,
    shadowColor: '#000',
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
  body: {
    width:ScreenWidth,
    position: 'relative',
    top: HEADER_HEIGHT,
    flex: 1,
  },
  logo: {
    marginBottom:50,
    width: 150,
    transform:'scale(0.6)',
    top:40,
    height: 115,
  },
  settings: {
    position: 'absolute', 
    bottom: 10, 
    left: 10,
  },
  form: {
    position: 'absolute', 
    bottom: 10, 
    left: 50,
  }
});

