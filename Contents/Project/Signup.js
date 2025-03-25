import React, { useState ,useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Signup({ navigation }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status,setstatus]=useState(false)
  const [messageColor, setMessageColor] = useState('red');
  const [users, setUsers] = useState([]);

  const onPressButton = async () => {
    if (!name || !password || !cpassword) {
      setMessage('Please fill in all fields.');
      setMessageColor('red');
      return;
    }
    if (password !== cpassword) {
      setMessage('Passwords do not match.');
      setMessageColor('red');
      return;
    }

    const user = { name, password,status };
    const allusers=[]
   
      const data = await AsyncStorage.getItem('Alluserss');
      if(data)
      {
        allusers.push(data)
        allusers.push(user)
       await AsyncStorage.setItem('Alluserss', JSON.stringify(allusers));

      setUsers(allusers);
      setMessage('Signup successful!');
      setMessageColor('green');

      setTimeout(() => navigation.navigate('Login',{allusers}),1000);
      }
   
  };
  useEffect(async()=>{
    const res=await AsyncStorage.getItem('Alluserss')
    if(res){
        
       
    }
    else 
    await AsyncStorage.setItem('student',JSON.stringify([]))


  },[]

  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        onChangeText={setName}
        mode="outlined"
        label="Name"
        placeholder="Enter Name"
        style={styles.input}
      />

      <TextInput
        onChangeText={setPassword}
        mode="outlined"
        label="Password"
        placeholder="Enter Password"
        style={styles.input}
      />
      <TextInput
        onChangeText={setcPassword}
        mode="outlined"
        label="Confirm Password"
        placeholder="Confirm Password"
        
        style={styles.input}
      />

      <Text style={{ alignSelf: 'center', color: messageColor }}>{message}</Text>

      <Button mode="contained" onPress={onPressButton} style={styles.signupButton}>
        Sign Up
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
});

export default Signup;
