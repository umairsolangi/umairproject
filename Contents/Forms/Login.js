import React, { useState } from "react";
import {  StyleSheet, Text,View } from "react-native";
import {Button, TextInput} from 'react-native-paper';

const Login = () => {


    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('red');

    var AllData = [
        { uName: "GPT", pass: "123" },
        { uName: "admin", pass: "000" },
        { uName: "Faiz", pass: "000" },
        { uName: "Samandur Khan", pass: "1122" },
    ];

    const onPressButton = () => {
        if (!userName || password.length == 0) {
            setMessage('Please Enter All Values');
        }
        else {
            var ind = -1;
            var ans = AllData.filter(val => val.uName == userName && val.pass == password)
         
            if (ans.length > 0) {
                setMessage('Login Succfull');
                setMessageColor('green');
            }
            else {
                setMessage('Login Fail');
                setMessageColor('red');
            }
        }
    }
    return (
        <View style={{borderWidth:2, borderRadius:10, height:800, margin:20, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <View style={{display: 'flex', alignItems:"center", gap: 10}}>
        <Text style={{fontSize:40, fontWeight:'bold', alignSelf:'center'}}>Login Task</Text>
        <TextInput
          onChangeText={setUserName}
          mode="outlined"
          label="User Name"
          placeholder="Enter time"
          style={{width: 300}}
        />
       
        <TextInput
          onChangeText={setPassword}
          mode="outlined"
          label="Password"
          placeholder="Enter time"
          style={{width: 300}}
        />
        <Text style={{alignSelf:"center",color:{messageColor}}}>{message}</Text>
        <Button
          mode="contained"
          uppercase={true}
          onPress={onPressButton}
          style={{
            backgroundColor: 'darkgreen',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 0,
            width: 200,
          }}>
          Login
        </Button><View/></View></View>
    );
}
export default Login;