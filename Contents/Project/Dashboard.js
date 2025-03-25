import React, { useEffect } from 'react'
import { View,Text,StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'



const Dashboard = ({navigation}) => {


   const [markers, setMarkers] = useState([]);
      const handleMapPress = (event) => {
          const coordinate = event.nativeEvent.coordinate;
          setMarkers([...markers, coordinate])
          console.log(markers)
          // console.log(coordinate)
          // setMarker(coordinate);
      }
      useEffect(async()=>{
        const res=await AsyncStorage.getItem('signupuser')
        if(res){
            const data=JSON.parse(res)
            setMarkers(data)
        }
    
      },[]
    
      )
  
  return (
    <View style={ss.mainContainer}>
      <View style={{backgroundColor:'#F8544B', width:"100%",height:200,marginTop:20,borderRadius:10,}}>
           <Text style={{fontSize: 40, fontWeight: 'bold', alignSelf: 'flex-start',padding:20}}>
                   Welcome To Home
            </Text>
      </View>
      <MapView
                style={{ width: 500, height: 500, }}
                initialRegion={{
                    latitude: 33.64252919601249,
                    longitude: 73.07839628309011,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={handleMapPress}
            >
                {
                    markers.map((marker) => (<Marker coordinate={marker} />))
                }
               

            </MapView>
  {/*   <Button 
        onPress={() =>
          navigation.navigate('AddProducts', {userdata})
        }  
        mode="contained"uppercase={true} 
        style={{backgroundColor:'black', borderRadius: 10, marginTop: 20,marginEnd:4 ,height:100,width:"50%",alignItems:'center',justifyContent:'center',fontWeight:'bold'}}>
        Add New Product
    </Button>
    <Button 
       onPress={() =>
        navigation.navigate('ViewProduct', {userdata})
      } 
        mode="contained"uppercase={true} 
        style={{backgroundColor:'black', borderRadius: 10, marginTop: 20,marginEnd:4 ,height:100,width:"50%",alignItems:'center',justifyContent:'center',fontWeight:'bold'}}>
        View Products
    </Button> */}

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

export default Dashboard