import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Dimensions, SafeAreaView, Animated, TouchableOpacity, Platform, Button } from "react-native";
import { Avatar } from '@rneui/themed';
import { IconButton, MD3Colors } from "react-native-paper";
import React, { useEffect, useRef, useState } from 'react';
import RadarChart from '@/components/SpiderGraph';
import Carousel, { Pagination, ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from "react-native-reanimated";
import {Calendar, LocaleConfig} from 'react-native-calendars';

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
  const underlineAnim = useRef(new Animated.Value(0)).current;

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
        return <Text style={styles.slideContent}>{item.content}</Text>
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
            colorList: ["blue"],
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
          style={{width: width-40, marginTop: 20}}
          markedDates={moodCalendar}
        />
    }}
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="cog"
          iconColor={MD3Colors.neutral20}
          onPress={() => router.push("/../settings")}
          style={styles.settings}
        />
        <Text style={styles.headerText}>Logo</Text>
        <Avatar
          size={48}
          rounded
          icon={{ name: "person", type: "material" }}
          containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 8, right: 15 }}
          onPress={() => router.push("/../profile")}
        />
      </View>
      <View style={styles.body}>
        <SafeAreaView style={styles.buttonContainer}>
          {slideData.map((slide, index) => (
            <TouchableOpacity key={slide.id} onPress={() => handlePress(index)} style={styles.button}>
              <Text style={[styles.buttonText, value === slide.title && styles.selectedButtonText]}>
                {slide.title}
              </Text>
            </TouchableOpacity>
          ))}
          {/* <Animated.View style={[styles.underline, { left: underlineAnim, width: width / slideData.length }]} /> */}
        </SafeAreaView>
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
              <Text style={styles.slideTitle}>{item.title}</Text>
              {renderSwitch(item)}
            </View>
          )}
        />
        <Pagination.Basic
          progress={progress}
          data={slideData}
          dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 0, width:(width-30)/3, height: 3 }}
          containerStyle={{ gap: 10, top: 42, position: 'absolute' }}
          onPress={onPressPagination}
        />
      </View>
    </View>
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
  headerText: {
    top: 15,
    color: 'black',
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
    color: 'rgba(0,0,0,0.3)',
  },
  selectedButtonText: {
    color: 'black',
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
