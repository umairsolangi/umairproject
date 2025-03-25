import React, { useEffect, useState } from "react";
import {  StyleSheet, Text,View ,Image} from "react-native";
import {Button, TextInput,Checkbox} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const[check, setcheck]=useState(false)
    const [messageColor, setMessageColor] = useState('red');
    const [users,setusers]=useState()
 useEffect(async()=>{
        const res=await AsyncStorage.getItem('Alluserss')
        if(res){
            const data=JSON.parse(res)
            console.log(data)
            setusers(data)
           
        }
    
      },[]
    
      )

    const onPressButton = async() => {
      if (!email || !password ) {
        setMessage('Please fill in all fields.');
        setMessageColor('red');
        return;
      } 
      const user = {
        email,
        password,
      };
      if(status){
        await AsyncStorage.setItem('student',JSON.stringify(user))
        console.log("student list added")
      }
        
    }
    return (
        <View style={{ borderRadius:10, height:600, margin:20, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <View style={{display: 'flex', alignItems:"center", gap: 10}}>
      
        <TextInput
          onChangeText={setEmail}
          mode="outlined"
          label="Email"
          placeholder="Enter Email"
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
        <View style={{flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
                <Checkbox onPress={()=> setcheck(!check)}status={check?"checked":"unchecked"}/>
                <Text style={{color:'black'}}>Remember Me  </Text>
        
                </View>

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
        <Text style={{color:'black'}}>Don’t have acount?  </Text>

        <Button onPress={()=>navigation.navigate('Signup')} style={{marginLeft:-16,fontWeignt:'bold'}}>SignUp</Button>

        </View>
        
        <View/></View></View>
    );
}
export default Login;