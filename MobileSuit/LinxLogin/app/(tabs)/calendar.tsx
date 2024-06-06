import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity} from "react-native";
import { Avatar, Slider, Icon } from '@rneui/themed';
import { IconButton, MD3Colors, Button, Modal, Portal, PaperProvider  } from "react-native-paper";
import React, { useRef, useState } from 'react';
import RadarChart from '@/components/SpiderGraph';
import Carousel, { Pagination, ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from "react-native-reanimated";
import {Calendar, LocaleConfig} from 'react-native-calendars';
import Theme from '@/constants/Theme';
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
    type: 'chart'
  },
  {
    id: '2',
    title: 'Hebdomadaire',
    content: 'Contenu Hebdomadaire',
    type: 'text'
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

  const moodCalendar = {
    '2024-06-11': {
      selected: true,
      marked: true,
      selectedColor: color(noteMoyMood[0])
    },
    '2024-06-12': {
      selected: true,
      marked: true,
      selectedColor: color(noteMoyMood[1])
    },
    '2024-06-13': {
      selected: true,
      marked: true,
      selectedColor: color(noteMoyMood[2])
    },
    '2024-06-14': {
      selected: true,
      marked: true,
      selectedColor: color(noteMoyMood[3])
    },
    '2024-06-15': {
      selected: true,
      marked: true,
      selectedColor: color(noteMoyMood[4])
    },
    '2024-06-16': {
      selected: true,
      marked: true,
      selectedColor: color(noteMoyMood[5])
    },
    '2024-06-17': {
      selected: true,
      marked: true,
      selectedColor: color(noteMoyMood[6])
    },
    '2024-06-18': {
      selected: true,
      marked: true,
      selectedColor: color(noteMoyMood[7])
    },
    '2024-06-19': {
      selected: true,
      marked: true,
      selectedColor: color(noteMoyMood[8])
    },
    '2024-06-20': {
      selected: true,
      marked: true,
      selectedColor: color(noteMoyMood[9])
    },
    '2024-06-21': {
      selected: true,
      marked: true,
      selectedColor: color(noteMoyMood[10])
    },
  }  

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
        return <Text style={[styles.slideContent, Theme().themeText]}>{item.content}</Text>
      case 'chart': 
        return <RadarChart
          graphSize={400}
          scaleCount={10}
          numberInterval={2}
          data={[
            {
              Sommeil: 0.7,
              Sport: 1,
              Alimentation: 0.9,
              Social: 0.67,
              Moral: 0.8,
            },
          ]}
          options={{
            graphShape: 1,
            showAxis: false,
            showIndicator: true,
            color: Theme().themeTextRadar.color,
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
          style={[{width: width-40, marginTop: 20}, Theme().themeCalendar]}
          markedDates={moodCalendar}
          theme={{calendarBackground: Theme().themeCalendar.backgroundColor, monthTextColor: Theme().themeCalendar.color}}
        />
    }}
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={[styles.header, Theme().themeBack, Theme().themeShadow]}>
          <IconButton
            icon="cog"
            iconColor={Theme().themeIcon.color}
            onPress={() => router.push("/../settings")}
            style={styles.settings}
          />
          <Text style={[styles.headerText, Theme().themeText]}>Logo</Text>
          <Avatar
            size={48}
            rounded
            icon={{ name: "person", type: "material" }}
            containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 8, right: 15 }}
            onPress={() => router.push("/../profile")}
          />
        </View>
        <View style={[styles.body, Theme().themeBack2]}>
          <SafeAreaView style={styles.buttonContainer}>
            {slideData.map((slide, index) => (
              <TouchableOpacity key={slide.id} onPress={() => handlePress(index)} style={styles.button}>
                <Text style={[styles.buttonText, Theme().themeText, value === slide.title && styles.selectedButtonText]}>
                  {slide.title}
                </Text>
              </TouchableOpacity>
            ))}
            {/* <Animated.View style={[styles.underline, { left: underlineAnim, width: width / slideData.length }]} /> */}
          </SafeAreaView>
          <View style={{top: 40, zIndex:2}}>
            <Button mode="contained" onPress={() => {setModalVisible(true); console.log("pressed")}} style={Theme().themeBouton} textColor={Theme().themeBouton.color}>
              Questionnaire du jour
            </Button>
          </View>
          <Portal>
            <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={[modalStyle, Theme().themeBack]}>
              <Text style={[{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', margin: 10 }, Theme().themeText]}>Questionnaire du jour</Text>
              <Text style={Theme().themeText}>Renseignez chaque données correspondantes aux questions suivantes avec une note entre 0 et 10</Text>
              <View style={styles.slider}>
                <Text style={Theme().themeText}>Sommeil : {valueSommeil}</Text>
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
                <Text style={Theme().themeText}>Sport : {valueSport}</Text>
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
                <Text style={Theme().themeText}>Social : {valueSocial}</Text>
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
                <Text style={Theme().themeText}>Moral : {valueMoral}</Text>
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
                <Text style={Theme().themeText}>Nutrition : {valueNutrition}</Text>
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
                  console.log("pressed"); 
                }}
                style={Theme().themeBouton}
                textColor={Theme().themeBouton.color}
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
                <Text style={[styles.slideTitle, Theme().themeText]}>{item.title}</Text>
                {renderSwitch(item)}
              </View>
            )}
          />
          <Pagination.Basic
            progress={progress}
            data={slideData}
            dotStyle={{...Theme().themePagination, borderRadius: 0, width:(width-30)/3, height: 3}}
            activeDotStyle={Theme().themePagination2}
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