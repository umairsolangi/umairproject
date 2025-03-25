import React, { useState ,useEffect} from 'react'
import { View,Text,StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'


const AdminDashboard = ({navigation, route}) => {
  const userdata=route.params.Admindata
  console.log('Admin data:', userdata)

  return (
    <View style={ss.mainContainer}>
      <View style={{backgroundColor:'#F8544B', width:"100%",height:200,padding:20,borderRadius:10,}}>
           <Text style={{fontSize: 25, fontWeight: 'bold', alignSelf: 'flex-start',}}>
                  Hey!  Welcome To Dashboard
            </Text>
            <Text style={{fontSize: 25, fontWeight: 'bold', alignSelf: 'flex-start',}}>
                  Name: {userdata.name}
            </Text>
            <Text style={{fontSize: 25, fontWeight: 'bold', alignSelf: 'flex-start',}}>
                  Email: {userdata.email}
            </Text>
      
      </View>
    <Button 
       onPress={() =>
        navigation.navigate('Vendor Approval', {})
      } 
        mode="contained"uppercase={true} 
        style={{backgroundColor:'black', borderRadius: 10, marginTop: 20,marginEnd:4 ,height:50,width:"50%",alignItems:'center',justifyContent:'center',fontWeight:'bold'}}>
        Vendor Approval
    </Button>
    <Button 
       onPress={() =>
        navigation.navigate('Branch Approval', {})
      } 
        mode="contained"uppercase={true} 
        style={{backgroundColor:'black', borderRadius: 10, marginTop: 20,marginEnd:4 ,height:50,width:"50%",alignItems:'center',justifyContent:'center',fontWeight:'bold'}}>
        Branch Approval
    </Button>
    </View>
  )
}
const ss=StyleSheet.create({
    mainContainer: {
        alignItems:'center',
        marginVertical: 10,
        marginHorizontal:10,
        justifyContent:'center'
      },
      header: {
        marginTop: 20,
        height: 50,
        backgroundColor: 'darkred',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headertext: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
      },
      inputview: {
        marginTop: 20,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      },
      parkinview: {
        marginTop:10,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around'
      },
      radiobuttons:{
        fontSize:18,
      },
      Buttonsview:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
      },
      flatlistview:{
        
        backgroundColor:'lightgrey',
        minHeight:80,
        borderWidth:3,
        borderColor:'darkred',
        margin:20,
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center', 
        justifyContent:'space-around'
      },
      textedit:{
        fontSize:22,
        fontWeight:'bold'
      }
})

export default AdminDashboard