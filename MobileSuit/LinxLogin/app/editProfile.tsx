import { Stack } from 'expo-router';
import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function EditScreen() {
  
  const [show, setShow] = useState(false);
  
  const [err,setErr] = useState("")
  
  const [date, setDate] = useState(new Date());
  const [isdate,setisdate] = useState(0)
  const [password, onChangePassword] = useState('');
  const [email, onChangeEmail] = useState('');
  const [confirmPass, onChangeconfirmPass] = useState('');
  const [nom, onChangeNom] = useState('');
  const [prenom, onChangePrenom] = useState('');
  
  const onChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  
  return (
    <ScrollView>
    <KeyboardAvoidingView
      style={styles.view}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

        <Input
            placeholder='Prénom'
            onChangeText={onChangePrenom}
            leftIconContainerStyle={{
                marginRight:5
            }}
            leftIcon={
              <Icon
                name='user'
                size={24}
                type='font-awesome'
                color='black'
              />
            }
        />

       <Input
            placeholder='Nom'
            leftIconContainerStyle={{
                marginRight:5
            }}
            onChangeText={onChangeNom}
            leftIcon={<Icon
            name='user'
            size={24}
            type='font-awesome'
            color='black'
            />}
        />
        <Input
            placeholder='Date de naissance'
            leftIconContainerStyle={{
                marginRight:5
            }}
            onPress={showDatepicker}
            value={isdate>1?date.toDateString():""}
          
            leftIcon={<Icon
            name='user'
            size={24}
            type='font-awesome'
            color='black'
            />}
        />

   
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

        <Input
            placeholder='Email'
            onChangeText={onChangeEmail}
            leftIconContainerStyle={{
                marginRight:5
            }}
            leftIcon={<Icon
                name='user'
                size={24}
                type='font-awesome'
                color='black'
            />}
        />

        <Input
            secureTextEntry={true} 
            placeholder='Mot de passe'
            onChangeText={onChangePassword}
            leftIconContainerStyle={{
                marginRight:5
            }}
            leftIcon={
                <Icon
                name='unlock'
                size={24}
                type='feather'
                color='black'
                />
            }
        />
        <Input
            secureTextEntry={true} 
            placeholder='Confirmation du mot de passe'
            onChangeText={onChangeconfirmPass}
            leftIconContainerStyle={{
                marginRight:5
            }}
            leftIcon={
                <Icon
                name='lock'
                size={24}
                type='feather'
                color='black'
                />
            }
        />

    <Button
      buttonStyle={{
        width:350
      }}
      title="Inscription"
      type="solid"
      onPress={() => console.log('modif')}
    />
    <Text style={{color:'red'}}> {err}</Text>
    </KeyboardAvoidingView>
    </ScrollView>
    
  );
  
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  view:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,

  },
  image: {
    marginBottom:50,
    width: 350,
    height: 115,
  },
  link:{
    color:"blue"
  }
});
