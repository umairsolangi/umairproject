import React, { useState } from "react";
import {  StyleSheet, Text,View ,Image} from "react-native";
import {Button, Checkbox, TextInput} from 'react-native-paper';

const Login = ({navigation}) => {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[check,setcheck]=useState(false )
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('red');


    const onPressButton = async() => {
      
        navigation.navigate("Home")
      
    
     

      
       
         
        
    }
    return (
        <View style={{ borderRadius:10, height:600, margin:20, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <View style={{display: 'flex', alignItems:"center", gap: 10}}>
       
        <TextInput
          onChangeText={setEmail}
          mode="outlined"
          label="user name"
          placeholder="Enter username"
          style={{width: 300}}
        />
       
        <TextInput
          onChangeText={setPassword}
          mode="outlined"
          label="Password"
          placeholder="Enter Password"
          style={{width: 300}}
        />
        <Text style={{alignSelf:"center",color:{messageColor}}}>{message}</Text>

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
        <View style={{flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
        <Checkbox onPress={()=> setcheck(!check)}status={check?"checked":"unchecked"}/>
        <Text style={{color:'black'}}>Remember Me  </Text>

        </View>
        
        <View/></View></View>
    );
}
export default Login;