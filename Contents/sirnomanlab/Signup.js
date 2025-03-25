import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import MapView, { Marker, Polygon, Polyline } from "react-native-maps";


function Signup({navigation}) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');

  const onPressButton = async () => {
     navigation.navigate('Login')
 
  };

  return (
    <View style={styles.container}>

      <TextInput
        onChangeText={setName}
        mode="outlined"
        label="Name"
        placeholder="Enter Name"
        style={styles.input}
      />
     
    
    

      <Text style={{alignSelf: 'center', color: messageColor}}>
        {message}
      </Text>

      <Button
        mode="contained"
        onPress={onPressButton}
        style={styles.signupButton}>
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    height: 700,
    margin: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#F8544B',
    marginBottom: 10,
  },
  input: {
    width: 300,
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: '#F8544B',
    borderRadius: 10,
    marginTop: 10,
    width: 150,
  },
  loginRedirect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default Signup;
