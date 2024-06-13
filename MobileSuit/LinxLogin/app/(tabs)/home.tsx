import { Link, useFocusEffect, useRouter } from "expo-router";
import { Text, View, StyleSheet ,Dimensions, Platform} from "react-native";
import { Avatar } from '@rneui/themed';
import { useEffect, useState  } from "react";
import { Button, IconButton, List, MD3Colors, Modal, RadioButton, Snackbar, TextInput } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import Config from '../../config.json'
import { Checkbox } from 'react-native-paper';
import { ScrollView } from "react-native-gesture-handler";
import { ScreenHeight, Slider ,Icon, ScreenWidth, ListItem} from "@rneui/base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Theme from "@/constants/Theme";
import RIcon from '@mdi/react';
import { mdiCalendarMultipleCheck } from '@mdi/js';
import { DarkTheme } from "@react-navigation/native";

const HEADER_HEIGHT = 100;
const { width,height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);


  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [firstLogin,setFirstLogin] = useState(false)
  const [value, setValue] = useState(0);
  const [value2, setValue2] = useState(0);
  const [checked1, setChecked1] = useState('first');
  const [checked2, setChecked2] = useState('first');
  const [checked3, setChecked3] = useState('first');
  const [checked4, setChecked4] = useState('first');
  const [text,setText] = useState("")
  const [events,setEvents] = useState([])
  const [eventSoonComponent, setEventSoonComponent] = useState([])
  const [eventPastComponent, setEventPastComponent] = useState([])
  const [expandedSoon, setExpandedSoon] = useState(true);
  const [expandedPast, setExpandedPast] = useState(false);
  //snackbar
  const [snack, setSnack] = useState(false);

  const onToggleSnackBar = () => setSnack(!snack);

  const onDismissSnackBar = () => setSnack(false);

  const containerStyle = {backgroundColor: 'white', padding: 20};

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

  useEffect(()=>{
    const wrap = async()=>{
      const jwt_cookie = await AsyncStorage.getItem("jwt")
      const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setFirstLogin(reponse.data.firstLogin)
      const reponseEvents = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getEvents`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setEvents(reponseEvents.data)
    }
    wrap()
    handleCheckboxPress('Cinéma')
    handleCheckboxPress('Jeux vidéos')
    
  },[])

  useEffect(()=>{
    let tmp = []
    let tmp2 = []
    if(events.length>0){
      for(let i = 0; i<events.length;i++){
        const date = new Date(events[i].date)
        const today = new Date()
        if(date>today){
          tmp.push(
            <ListItem 
              key={i}  
              bottomDivider 
              style={_Theme.themeBack2}
              onPress={() => {router.push(`/../chat/${events[i]._id}`)}}
            >
              <Avatar title={"ok"} source={{ uri: "" }} />
              <ListItem.Content style={_Theme.themeBack2}>
                <ListItem.Title style={_Theme.themeText}>{events[i].activity.title}</ListItem.Title>
                <ListItem.Subtitle style={_Theme.themeText}>{events[i].date}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron style={_Theme.themeText}/>
            </ListItem>
          )
        }
        else{

          tmp2.push(
            <ListItem key={i}  bottomDivider>
              <Avatar title={"ok"} source={{ uri: "" }} />
              <ListItem.Content>
                <ListItem.Title>{events[i].activity.title}</ListItem.Title>
                <ListItem.Subtitle>{events[i].date}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )
        }
        
      }

      setEventSoonComponent(tmp)
      setEventPastComponent(tmp2)
      
      
    }
  },[events])
  useEffect(()=>{
    if(firstLogin){
      showModal()
    }
  },[firstLogin])

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

  
  return (
    <View style={styles.container}>
    
      <View style={[styles.header,_Theme.themeBack,_Theme.themeShadow]}>
        <IconButton
          icon="cog"
          iconColor={_Theme.themeIcon.color}
          onPress={() => router.push("/../settings")}
          style={styles.settings}
        />
        {firstLogin?
        <IconButton
          icon="form-select"
          iconColor={_Theme.themeIcon.color}
          onPress={() => showModal()}
          style={styles.form}
        />:""}
        <Text style={[styles.headerText,_Theme.themeText]}>Logo</Text>
        <Avatar
          size={48}
          rounded
          icon={{ name: "person", type: "material" }}
          containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 15, right: 15 }}
          onPress={() => router.push("/../profile")}
        />
      </View>
      
      <View style={[styles.body,_Theme.themeBack2]}>
        <ListItem.Accordion
          content={
            <>
              <Icon type='material-community' name="calendar-multiple" size={30} style={_Theme.themeIcon}/>
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
        <ListItem.Accordion
          content={
            <>
              <Icon type='material-community' name="calendar-multiple-check" size={30} />
              <ListItem.Content>
                <ListItem.Title> Evenements passés</ListItem.Title>
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

