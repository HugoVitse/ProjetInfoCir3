import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity} from "react-native";
import { Avatar, Slider, Icon } from '@rneui/themed';
import { IconButton, MD3Colors, Button, Modal, Portal, PaperProvider  } from "react-native-paper";
import React, { useEffect, useRef, useState } from 'react';
import RadarChart from '@/components/SpiderGraph';
import Carousel, { Pagination, ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from "react-native-reanimated";
import {Calendar, LocaleConfig } from 'react-native-calendars';
import Theme from '@/constants/Theme';
import Config from '../../config.json';
import axios from 'axios'
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useThemeColor } from '@/hooks/useThemeColor';
// import { Colors } from '@/constants/Colors';

// const color = Colors.dark.text
// const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

const HEADER_HEIGHT = 100;

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

const slideData = [
  {
    id: '1',
    title: 'Quotidien',
    content: 'Contenu Quotidien',
    type: 'radarChart'
  },
  {
    id: '2',
    title: 'Hebdomadaire',
    content: 'Contenu Hebdomadaire',
    type: 'barChart'
  },
  {
    id: '3',
    title: 'Calendrier',
    content: 'Contenu Calendrier',
    type: 'calendar'
  }
]

const noteMoyMood = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
]


export default function CalendarScreen() {

  const width = Dimensions.get('window').width;
  const router = useRouter();
  const [value, setValue] = useState(slideData[0].title);
  const carouselRef = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [valueSommeil, setValueSommeil] = useState(0);
  const [valueSport, setValueSport] = useState(0);
  const [valueSocial, setValueSocial] = useState(0);
  const [valueMoral, setValueMoral] = useState(0);
  const [valueNutrition, setValueNutrition] = useState(0);
  const [moodCalendar,setMoodCalendar] = useState({})
  const [alreadyFill,setalreadyFill] = useState(false)
  const [picutre,setPicture] = useState('')
  const [radarData, setRadarData] = useState([
    {
      Sommeil: 0,
      Sport: 0,
      Alimentation: 0,
      Social: 0,
      Moral: 0,
    },
  ]) // [sommeil, sport, alimentation, social, moral
  const [barData, setBarData] = useState({
    labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0 ]
      }
    ]
  })
  var todayDate = new Date();
  todayDate.toString();
  var todayDay = todayDate.getDate()
  var todayMonth = todayDate.getMonth() + 1
  var todayYear = todayDate.getFullYear()

  const _Theme = Theme()

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

    console.log(tmp)
    setMoodCalendar(tmp)
    const lastQuestionnaire = moodTracker[moodTracker.length-1]
    const dateLastQuestionnaire = new Date(lastQuestionnaire.date)
    console.log(today.getDay())
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


    const day = today.getDay()
    const days = [today.toDateString()]

    for(let i=1; i<day;i++){
      let d = new Date(`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()-i}`)
      days.push(d.toDateString())
    }

 
    for(let i=0;i<days.length;i++){
      console.log(days[i])
    }
 

    let dayWeek = [0,0,0,0,0,0,0]

    for(let i=0;i<day;i++){
      if(moodTracker.length-1-i >=0){
        const d = new Date(moodTracker[moodTracker.length-1-i].date)
        if(days.indexOf(d.toDateString()) != -1){
          dayWeek[d.getDay()-1] = moodTracker[moodTracker.length-1-i].average
        }
      }

    }

    console.log(dayWeek)
  
    setBarData({
      labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
      datasets: [
        {
          data: dayWeek
        }
      ]
    })
    
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

    console.log(data)

    const jwt_cookie = await AsyncStorage.getItem('jwt')

    const reponse = await axios.post(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/FillMoodTracker`, data,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})

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

  useEffect(()=>{

    const wrap_picture = async()=>{
      const jwt_cookie = await AsyncStorage.getItem('jwt')
      const reponse = await axios.get(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/infos`,{headers:{Cookie:`jwt=${jwt_cookie}`},withCredentials:false})
      setPicture(`${Config.scheme}://${Config.urlapi}:${Config.portapi}/${reponse.data.image}`)
    }
    wrap_picture()
    
    wrap()
  },[])



  const onPressPagination = (index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const handlePress = (index: number) => {
    setValue(slideData[index].title);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ index, animated: true });
    }
  };

  const renderSwitch = (item: { type: any; content: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }) => {
    {switch(item.type) {
      case 'text': 
        return <Text style={[styles.slideContent, _Theme.themeText]}>{item.content}</Text>
      case 'barChart': 
        return <BarChart
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
      case 'radarChart': 
        return <RadarChart
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
      case 'calendar':
        return <Calendar
          onDayPress={day => {
            console.log('selected day', day);
          }}
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
    }}
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={[styles.header, _Theme.themeBack, _Theme.themeShadow]}>
          <IconButton
            icon="cog"
            iconColor={_Theme.themeIcon.color}
            onPress={() => router.push("/../settings")}
            style={styles.settings}
          />
          <Text style={[styles.headerText, _Theme.themeText]}>Logo</Text>
          <Avatar
            size={48}
            rounded
            source={{ uri: picutre}}
            icon={{ name: "person", type: "material" }}
            containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 8, right: 15 }}
            onPress={() => router.push("/../profile")}
          />
        </View>
        <View style={[styles.body, _Theme.themeBack2]}>
          <SafeAreaView style={styles.buttonContainer}>
            {slideData.map((slide, index) => (
              <TouchableOpacity key={slide.id} onPress={() => handlePress(index)} style={styles.button}>
                <Text style={[styles.buttonText, _Theme.themeText, value === slide.title && styles.selectedButtonText]}>
                  {slide.title}
                </Text>
              </TouchableOpacity>
            ))}
            {/* <Animated.View style={[styles.underline, { left: underlineAnim, width: width / slideData.length }]} /> */}
          </SafeAreaView>
          <View style={{top: 40, zIndex:2}}>
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
              setValue(slideData[index].title);
            }}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <Text style={[styles.slideTitle, _Theme.themeText]}>{item.title}</Text>
                {renderSwitch(item)}
              </View>
            )}
          />
          <Pagination.Basic
            progress={progress}
            data={slideData}
            dotStyle={{..._Theme.themePagination, borderRadius: 0, width:(width-30)/3, height: 3}}
            activeDotStyle={_Theme.themePagination2}
            containerStyle={{ gap: 10, top: 42, position: 'absolute' }}
            onPress={onPressPagination}
          />
        </View>
      </View>
    </PaperProvider>
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
  settings: {
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