import { Link, useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Icon } from '@rneui/themed';
import { Avatar } from '@rneui/themed';
import { IconButton, MD3Colors } from "react-native-paper";
import React, { useState } from 'react';
import RadarChart from '../../components/SpiderGraph';

const HEADER_HEIGHT = 100;

export default function CalendarScreen() {
  const router = useRouter();

  // const [chartOptions, setChartOptions] = useState({
  //   data: [
  //     { critere: 'Sommeil', note: 50 },
  //     { critere: 'Sport', note: 45 },
  //     { critere: 'Alimentation', note: 70 },
  //     { critere: 'Social', note: 20 },
  //     { critere: 'Moral', note: 83 },
  //   ],
  //   type: 'radar-area',
  //   angleKey: 'critere', 
  //   radiusKey: 'note', 
  //   radiusName: 'Note'
  // });
  
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
          containerStyle={{ backgroundColor: "#bbbec1", position: 'absolute', bottom: 15, right: 15 }}
          onPress={() => router.push("/../profile")}
        />
      </View>
      <View style={styles.body}>
        <RadarChart
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
      </View>
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
  headerText: {
    top: 10,
    color: 'black',
    fontSize: 20,
  },
  body: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  settings: {
    position: 'absolute', 
    bottom: 10, 
    left: 10,
  }
});
