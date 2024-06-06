import { useColorScheme, StyleSheet } from "react-native"

export default function Theme() {
    const colorScheme = useColorScheme();

    const Theme = {
        themeBack: colorScheme === 'light' ? styles1.lightThemeBack : styles1.darkThemeBack,
        themeBack2: colorScheme === 'light' ? styles1.lightThemeBack2 : styles1.darkThemeBack2,
        themeText: colorScheme === 'light' ? styles1.lightThemeText : styles1.darkThemeText,
        themeShadow: colorScheme === 'light' ? styles1.lightThemeShadow : styles1.darkThemeShadow,
        themeIcon: colorScheme === 'light' ? styles1.lightThemeIcon : styles1.darkThemeIcon,
        themeBouton: colorScheme === 'light' ? styles1.lightThemeBouton : styles1.darkThemeBouton,
        themeBouton2: colorScheme === 'light' ? styles1.lightThemeBouton2 : styles1.darkThemeBouton2,
        themeTextRadar: colorScheme === 'light' ? styles1.lightThemeTextRadar : styles1.darkThemeTextRadar,
        themePagination: colorScheme === 'light' ? styles1.lightThemePagination : styles1.darkThemePagination,
        themePagination2: colorScheme === 'light' ? styles1.lightThemePagination2 : styles1.darkThemePagination2,
        themeCalendar: colorScheme === 'light' ? styles1.lightThemeCalendar : styles1.darkThemeCalendar,
        themeCard: colorScheme === 'light' ? styles1.lightThemeCard : styles1.darkThemeCard,
    }

    return Theme
}

const styles1 = StyleSheet.create ({
  lightThemeBack: {
    backgroundColor: '#fcfcfd'
  },
  lightThemeBack2: {
    backgroundColor: '#ecedee'
  },
  lightThemeText: {
    color: 'black'
  },
  lightThemeShadow: {
    borderColor: 'white',
    shadowColor: '#000'
  },
  lightThemeIcon: {
    color: '#171717'
  },
  lightThemeBouton: {
    backgroundColor: '#51adf6',
    color: 'white'
  },
  lightThemeBouton2: {
    backgroundColor: 'transparent',
    borderColor: '#51adf6',
    color: '#51adf6'
  },
  lightThemeTextRadar: {
    color: '#444'
  },
  lightThemePagination: {
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  lightThemePagination2: {
    backgroundColor: 'rgba(0,0,0,1)'
  },
  lightThemeCalendar: {
    backgroundColor: 'white',
    color: 'black'
  },
  lightThemeCard: {
    backgroundColor: '#ecedee',
  },
  darkThemeBack: {
    backgroundColor: '#0d1017'
  },
  darkThemeBack2: {
    backgroundColor: '#161b21'
  },
  darkThemeText: {
    color: 'white'
  },
  darkThemeShadow: {
    borderColor: '#3c434b',
    shadowColor: '#fff'
  },
  darkThemeIcon: {
    color: '#efefef'
  },
  darkThemeBouton: {
    backgroundColor: '#2196f3',
    color: 'white'
  },
  darkThemeBouton2: {
    backgroundColor: 'transparent',
    borderColor: '#51adf6',
    color: '#51adf6'
  },
  darkThemeTextRadar: {
    color: '#bbb'
  },
  darkThemePagination: {
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  darkThemePagination2: {
    backgroundColor: 'rgba(255,255,255,1)'
  },
  darkThemeCalendar: {
    backgroundColor: '#0d1017',
    color: 'white'
  },
  darkThemeCard: {
    backgroundColor: '#161b21',
    borderWidth: 0.3,
    borderColor: 'white'
  },
});