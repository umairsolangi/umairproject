import React, {useState} from 'react';
import {StyleSheet, Text, View, Image,Alert} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('hassan@gmail.com');
  const [password, setPassword] = useState('0000');


  const onPressButton = async () => {
    if (!email || !password) {
        Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const user = {
      email,
      password,
    };
    try {
      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user),
      });

      if (response.ok) {
        var data = await response.json();
        console.log(data);
        if (data.message === 'Login successful') {
          
          Alert.alert('Login Successful');
          
          if (data.user.role === 'vendor') {
            var vendordata=data.user
          navigation.navigate('Vendor Dashboard', {vendordata});
          }
          else if (data.user.role === 'admin') {
            var Admindata=data.user
          navigation.navigate('Admin Dashboard', {Admindata});
          }
          else{
            var customerdata=data.user
            navigation.navigate('Customer Dashboard', {customerdata});
            console.log("i think its customers")
          }
        } else {
         
          Alert.alert('Invalid credentials');
        }
      } else {
        const errorText = await response.text();
        setMessage(`Signup Failed: ${errorText}`);
        setMessageColor('red');
      }
    } catch (error) {
          console.error('Error login:', error);
          Alert.alert('Error', 'Failed to Login');
        }
  };
  return (
    <View
      style={{
        borderRadius: 10,
        height: 600,
        margin: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{display: 'flex', alignItems: 'center',justifyContent:'space-between', gap: 10}}>
        <Image
          source={require('../../Assets/Images/Logo2-png.png')}
          style={{width: 260, height: 200}}
        />
        <TextInput
        value={email}
          onChangeText={setEmail}
          mode="outlined"
          label="Email"
          placeholder="Enter Email"
          style={{width: 300}}
        />

        <TextInput
        value={password}
          onChangeText={setPassword}
          mode="outlined"
          label="Password"
          placeholder="Enter Password"
          style={{width: 300}}
        />
     

        <Button
          mode="contained"
          uppercase={true}
          onPress={onPressButton}
          style={{
            backgroundColor: '#F8544B',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 0,
            width: 150,
          }}>
          Login
        </Button>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft:20
          }}>
          <Text style={{color: 'black'}}>Don’t have acount?  </Text>
          <Button
            onPress={() => navigation.navigate('Signup Options')}
            textColor='#F8544B'
            style={{marginLeft: -16, fontWeignt: 'bold' ,}}>
            SignUp
          </Button>
        </View>

        <View />
      </View>
    </View>
  );
};
export default Login;
