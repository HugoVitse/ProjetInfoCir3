import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from "expo-router";
import { Text, View, StyleSheet, Dimensions, Image } from "react-native";
import { Avatar, Slider, Icon } from '@rneui/themed';
import { IconButton, Button, Modal, Portal, PaperProvider, ActivityIndicator  } from "react-native-paper";
import { useCallback, useState } from 'react';
import RadarChart from '@/components/SpiderGraph';
import {Calendar, LocaleConfig } from 'react-native-calendars';
import Theme from '@/constants/Theme';
import Config from '../../config.json';
import axios from 'axios'
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HEADER_HEIGHT = 100;

const Tab = createMaterialTopTabNavigator();

LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

function Quotidien() {
  const _Theme = Theme()

  const [alreadyFill,setalreadyFill] = useState(false)
  const [radarData, setRadarData] = useState([
    {
      Sommeil: 0,
      Sport: 0,
      Alimentation: 0,
      Social: 0,
      Moral: 0,
    },
  ]) // [sommeil, sport, alimentation, social, moral
  const [loading, setLoading] = useState(false)
  
  useFocusEffect(
    useCallback(()=>{
      const wrap = async()=>{
        const today = new Date()
      
        const jwt_cookie = await AsyncStorage.getItem('jwt')
        const mood = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getMoodTracker`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
        const moodTracker = mood.data.moodTrackerData

        const lastQuestionnaire = moodTracker[moodTracker.length-1]
        const dateLastQuestionnaire = new Date(lastQuestionnaire.date)
        if(dateLastQuestionnaire.toDateString() == today.toDateString()){
          setalreadyFill(true)
          setRadarData(
            [
              {
                Sommeil: lastQuestionnaire.sleepLevel/10,
                Sport: lastQuestionnaire.sportLevel/10,
                Alimentation: lastQuestionnaire.eatLevel/10,
                Social: lastQuestionnaire.socialLevel/10,
                Moral: lastQuestionnaire.moralLevel/10,
              },
            ]
          )
        }
        
        setLoading(true)
      }

      wrap()
    },[])
  )

  return (
    <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}, _Theme.themeBack2]}>
      <Text style={[{fontSize: 30, fontWeight: 'bold', textAlign: 'center', top: -30}, _Theme.themeText]}>Quotidien</Text>
      <RadarChart
        graphSize={400}
        scaleCount={10}
        numberInterval={2}
        data={radarData}
        options={{
          graphShape: 1,
          showAxis: false,
          showIndicator: true,
          color: _Theme.themeTextRadar.color,
          colorList: ["#2196f3"],
          dotList: [false],
        }}
      />
    </View>
  )
}

function Hebdomadaire() {
  const width = Dimensions.get('window').width;
  const _Theme = Theme()
  
  const [loading, setLoading] = useState(false)
  const [barData, setBarData] = useState({
    labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0 ]
      }
    ]
  })
  
  useFocusEffect(
    useCallback(()=>{
      const wrap = async()=>{
        const today = new Date()
      
        const jwt_cookie = await AsyncStorage.getItem('jwt')
        const mood = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getMoodTracker`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
        const moodTracker = mood.data.moodTrackerData
        const day = (today.getDay()-1+7)%7
        const days = [today.toDateString()]
        for(let i=0; i<=day;i++){
          let d = new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()-i}`)
          days.push(d.toDateString())
        }
    


        let dayWeek = [0,0,0,0,0,0,0]

        for(let i=0;i<=day;i++){
          if(moodTracker.length-1-i >=0){
            const d = new Date(moodTracker[moodTracker.length-1-i].date)
            
            if(days.indexOf(d.toDateString()) != -1){
              dayWeek[(d.getDay()-1+7)%7] = moodTracker[moodTracker.length-1-i].average
            }
          }

        }
      
        setBarData({
          labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
          datasets: [
            {
              data: dayWeek
            }
          ]
        })
        
        setLoading(true)
      }

      wrap()
    },[])
  )

  return (
    <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}, _Theme.themeBack2]}>
      <Text style={[{fontSize: 30, fontWeight: 'bold', textAlign: 'center', top: -30}, _Theme.themeText]}>Hebdomadaire</Text>
      <BarChart
        style={{borderRadius: 8, elevation: 3, marginTop: 20 }}
        data={barData}
        width={width - 40}
        height={320}
        fromZero={true}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: _Theme.themeBack.backgroundColor,
          backgroundGradientTo: _Theme.themeBack2.backgroundColor,
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: (opacity = 1) => _Theme.themeTextRadar.color,
          propsForVerticalLabels: {
            translateX: -20
          },
          propsForHorizontalLabels: {
            translateX: 10
          },
        }}
        verticalLabelRotation={30}
      />
    </View>
  )
}

function Calendrier() {
  const width = Dimensions.get('window').width;
  const _Theme = Theme()
  
  const [loading, setLoading] = useState(false)
  const [moodCalendar,setMoodCalendar] = useState({})
  
  const interpolate = (start: number, end: number, value: number) => {
    let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const color = (value: number) => {
    let r = interpolate(255, 0, value);
    let g = interpolate(0, 255, value);
    let b = interpolate(0, 0, value);
    return `rgb(${r},${g},${b})`;
  };
  
  useFocusEffect(
    useCallback(()=>{
      const wrap = async()=>{
        const today = new Date()
      
        const jwt_cookie = await AsyncStorage.getItem('jwt')
        const mood = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getMoodTracker`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
        const moodTracker = mood.data.moodTrackerData

        let tmp = {}

        for(let i=0;i< moodTracker.length;i++){
          const date = new Date(moodTracker[i].date).toLocaleDateString().split('/')
          const actualDate = `${date[2]}-${date[1]}-${date[0]}` 
          tmp = {
            ...tmp,
            [actualDate]: {
              selected: true,
              marked: true,
              selectedColor: color(moodTracker[i].average)
            }
          }
        }

        setMoodCalendar(tmp)
        
        setLoading(true)
      }

      wrap()
    },[])
  )

  return (
    <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}, _Theme.themeBack2]}>
      <Text style={[{fontSize: 30, fontWeight: 'bold', textAlign: 'center', top: -30}, _Theme.themeText]}>Calendrier</Text>
      <Calendar
        hideExtraDays={true}
        firstDay={1}
        disableAllTouchEventsForDisabledDays={true}
        style={[{width: width-40, borderRadius: 8, elevation: 3, marginTop: 20}, _Theme.themeCalendar]}
        markedDates={moodCalendar}
        theme={{
          calendarBackground: _Theme.themeCalendar.backgroundColor, 
          monthTextColor: _Theme.themeCalendar.color,
          todayTextColor: _Theme.themeTextRadar.color,
        }}
      />
    </View>
  )
}

export default function CalendarScreen() {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [valueSommeil, setValueSommeil] = useState(0);
  const [valueSport, setValueSport] = useState(0);
  const [valueSocial, setValueSocial] = useState(0);
  const [valueMoral, setValueMoral] = useState(0);
  const [valueNutrition, setValueNutrition] = useState(0);
  const [alreadyFill,setalreadyFill] = useState(false)
  const [picutre,setPicture] = useState('')
  const [notif,setNotif] = useState(false)
  var todayDate = new Date();
  todayDate.toString();

  const _Theme = Theme()

  const wrap = async()=>{
    const today = new Date()
  
    const jwt_cookie = await AsyncStorage.getItem('jwt')
    const mood = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/getMoodTracker`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    const moodTracker = mood.data.moodTrackerData

    const lastQuestionnaire = moodTracker[moodTracker.length-1]
    const dateLastQuestionnaire = new Date(lastQuestionnaire.date)
    if(dateLastQuestionnaire.toDateString() == today.toDateString()){
      setalreadyFill(true)
    }

    setLoading(true)
    
  }

  const sendQuestionnaire = async() => {
    const data = {
      sleepLevel: valueSommeil,
      sportLevel: valueSport,
      socialLevel: valueSocial,
      moralLevel: valueMoral,
      eatLevel : valueNutrition,
      date: new Date().toDateString(),
      average: (valueSommeil + valueSport + valueSocial + valueMoral + valueNutrition) / 5
    }

    const jwt_cookie = await AsyncStorage.getItem('jwt')

    const reponse = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/FillMoodTracker`, data,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
    
    setLoading(false)

    wrap()
  }

  const interpolate = (start: number, end: number, value: number) => {
    let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const color = (value: number) => {
    let r = interpolate(255, 0, value);
    let g = interpolate(0, 255, value);
    let b = interpolate(0, 0, value);
    return `rgb(${r},${g},${b})`;
  };

  useFocusEffect(
    useCallback(()=>{
      setLoading(false)
      const wrap_picture = async()=>{
        const jwt_cookie = await AsyncStorage.getItem('jwt')
        const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
        setNotif(reponse.data.friendRequests.length>0)
        setPicture("")
        setPicture(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${reponse.data.image}`)
      }
      wrap_picture()
      
      wrap()
    },[])
  )
    
  

  return (
    loading?
    <PaperProvider>
      <View style={styles.container}>
        <View style={[styles.header, _Theme.themeBack, _Theme.themeShadow]}>
          <IconButton
            icon={notif?"bell-badge":"bell"}
            iconColor={_Theme.themeIcon.color}
            onPress={() => router.push("/../notifications")}
            style={styles.notifications}
          />
          <Image style={styles.logo} source={_Theme.Logo}/>
          <Avatar
            size={48}
            rounded
            source={{ uri: picutre}}
            icon={{ name: "person", type: "material" }}
            containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 8, right: 15 }}
            onPress={() => router.push("/../profile")}
          />
        </View>
        <View style={{position: 'absolute', justifyContent:'center', alignItems: 'center', width: width, bottom: height/20, zIndex:2}}>
          <Button contentStyle={{flexDirection: 'row-reverse'}} icon={alreadyFill?"check":""} mode="contained" disabled={alreadyFill} onPress={() => {setModalVisible(true);}} style={_Theme.themeBouton} textColor={_Theme.themeBouton.color}>
            {alreadyFill?"Questionnaire rempli":"Questionnaire du jour"}  
          </Button>
        </View>
        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={[modalStyle, _Theme.themeBack]}>
            <Text style={[{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', margin: 10 }, _Theme.themeText]}>Questionnaire du jour</Text>
            <Text style={_Theme.themeText}>Renseignez chaque données correspondantes aux questions suivantes avec une note entre 0 et 10</Text>
            <View style={styles.slider}>
              <Text style={_Theme.themeText}>Sommeil : {valueSommeil}</Text>
              <Slider
                value={valueSommeil}
                onValueChange={setValueSommeil}
                maximumValue={10}
                minimumValue={0}
                step={1}
                allowTouchTrack
                trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                thumbProps={{
                  children: (
                    <Icon
                      name=""
                      type=""
                      size={10}
                      reverse
                      containerStyle={{ bottom: 10, right: 10 }}
                      color={color(valueSommeil)}
                    />
                  ),
                }}
              />
              <Text style={_Theme.themeText}>Sport : {valueSport}</Text>
              <Slider
                value={valueSport}
                onValueChange={setValueSport}
                maximumValue={10}
                minimumValue={0}
                step={1}
                allowTouchTrack
                trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                thumbProps={{
                  children: (
                    <Icon
                      name=""
                      type=""
                      size={10}
                      reverse
                      containerStyle={{ bottom: 10, right: 10 }}
                      color={color(valueSport)}
                    />
                  ),
                }}
              />
              <Text style={_Theme.themeText}>Social : {valueSocial}</Text>
              <Slider
                value={valueSocial}
                onValueChange={setValueSocial}
                maximumValue={10}
                minimumValue={0}
                step={1}
                allowTouchTrack
                trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                thumbProps={{
                  children: (
                    <Icon
                      name=""
                      type=""
                      size={10}
                      reverse
                      containerStyle={{ bottom: 10, right: 10 }}
                      color={color(valueSocial)}
                    />
                  ),
                }}
              />
              <Text style={_Theme.themeText}>Moral : {valueMoral}</Text>
              <Slider
                value={valueMoral}
                onValueChange={setValueMoral}
                maximumValue={10}
                minimumValue={0}
                step={1}
                allowTouchTrack
                trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                thumbProps={{
                  children: (
                    <Icon
                      name=""
                      type=""
                      size={10}
                      reverse
                      containerStyle={{ bottom: 10, right: 10 }}
                      color={color(valueMoral)}
                    />
                  ),
                }}
              />
              <Text style={_Theme.themeText}>Nutrition : {valueNutrition}</Text>
              <Slider
                value={valueNutrition}
                onValueChange={setValueNutrition}
                maximumValue={10}
                minimumValue={0}
                step={1}
                allowTouchTrack
                trackStyle={{ height: 5, backgroundColor: 'transparent' }}
                thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
                thumbProps={{
                  children: (
                    <Icon
                      name=""
                      type=""
                      size={10}
                      reverse
                      containerStyle={{ bottom: 10, right: 10 }}
                      color={color(valueNutrition)}
                    />
                  ),
                }}
              />
            </View>
            <Button 
              mode="contained" 
              onPress={() => {
                setModalVisible(false); 
                sendQuestionnaire()
              }}
              style={_Theme.themeBouton}
              textColor={_Theme.themeBouton.color}
            >
              Valider
            </Button>
          </Modal>
        </Portal>
        <SafeAreaProvider>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: _Theme.themeText.color,
              tabBarLabelStyle: { fontSize: 12 },
              tabBarStyle: { backgroundColor: _Theme.themeBack.backgroundColor },
              tabBarIndicatorStyle: {backgroundColor: _Theme.themeBouton.backgroundColor}
            }}
          >
            <Tab.Screen name="Quotidien" component={Quotidien} />
            <Tab.Screen name="Hebdomadaire" component={Hebdomadaire} />
            <Tab.Screen name="Calendrier" component={Calendrier} />
          </Tab.Navigator>
        </SafeAreaProvider>
      </View>
    </PaperProvider>
    : <View  style={[{    flex: 1,      justifyContent: 'center',},_Theme.themeBack2]} ><ActivityIndicator  style={_Theme.themeBack2} animating={true} color={_Theme.themeBouton.backgroundColor} size='large'></ActivityIndicator></View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    top: 15,
    fontSize: 20,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  notifications: {
    position: 'absolute', 
    bottom: 5, 
    left: 10,
  },
  slider:{
    padding: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'relative',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    opacity: 0.3
  },
  selectedButtonText: {
    opacity: 1
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: 'blue',
  },
  logo: {
    marginBottom:50,
    width: 150,
    transform:'scale(0.6)',
    top:40,
    height: 115,
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
});

const modalStyle = {padding: 20,  margin: 20, borderRadius: 20,};