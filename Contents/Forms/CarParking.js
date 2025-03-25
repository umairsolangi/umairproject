import React, { useState } from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Button, RadioButton, TextInput} from 'react-native-paper';

function CarParking() {
    
    const [vehicleNo,setvehicleNo]=useState('')
    const [vehicleType,setVehicleType]=useState('Car')
    const [allVehicle,setAllVehicle]=useState([])
    const [allCars,setAllCars]=useState([])
    const [allBikes,setAllBikes]=useState([])

    const [parkOutVehicle,setParkOutVehicle]=useState([])

    const [totalParkOutVehicle,setTotalParkOutVehicle]=useState(0)
    const [countparkin,setCountParkIn]=useState(0)
    const [countAmount,setCountAmount]=useState(0)
    const [message,setMessage] =useState('')
    const [showall,setShowAll]=useState(true)
    const [showcar,setShowCar]=useState(false)
    const [showbike,setShowBike]=useState(false)
    const [showParkout,setShowParkout]=useState(false)

    const [selecttab, setSelectedTab]=useState('darkgreen')






    const addparkinvehicel=()=>{
    
        if(!vehicleNo)
        {
            setMessage('Please Enter Vehicle no')
            return
        }
        if(!vehicleType)
        {
            setMessage('Please select  Vehicle tyoe')
            return
        }
        const obj={id:countparkin,vehicleNo:vehicleNo,vehicleType:vehicleType}
        console.log(obj)
        setCountParkIn(countparkin+1)
        setAllVehicle((pre)=>[...pre,obj])
        setMessage('Vehicle Successfully Parked')

        console.log(allVehicle)
        setvehicleNo('')
        setMessage('')
    }
   const  addparkoutvehicle=(id)=>{
    const parkoutv=allVehicle.find(e=> e.id==id)
    setParkOutVehicle([ ...parkOutVehicle,parkoutv]);
    const parkinv=allVehicle.filter(e=>e.id!=id)
    setAllVehicle([...parkinv])
    setCountParkIn(countparkin-1)
    setCountAmount(countAmount+50)

   }
   const  AddAndShowAllCars=()=>{
    const Cars=allVehicle.filter(e=> e.vehicleType==='Car')
    console.log(Cars)
    setAllCars([...Cars])
   }
   const  AddAndShowAllBikes=()=>{
    const Bikes=allVehicle.filter(e=> e.vehicleType==='Bike')
    setAllBikes([...Bikes])
    console.log(Bikes)

   }
  const searchresults=(e)=>{

    if(e==1)
    {
      setSelectedTab('darkblue')
      setShowAll(true)
      setShowCar(false)
      setShowBike(false)
      setShowParkout(false)
    }
    else if(e==2)
      {
        setSelectedTab('darkblue')

        AddAndShowAllCars()
        setShowAll(false)
        setShowCar(true)
        setShowBike(false)
        setShowParkout(false)
      }
      else if(e==3)
        {
          setSelectedTab('darkblue')

          AddAndShowAllBikes()
          setShowAll(false)
          setShowCar(false)
          setShowBike(true)
          setShowParkout(false)
        }
      else{
        setSelectedTab('darkblue')

        setShowAll(false)
        setShowCar(false)
        setShowBike(false)
        setShowParkout(true)
      }
  

  }

    const showVehicleDetails=({item})=>{

        return(
            <View style={ss.flatlistview}>
              <View>
                 <Text style={ss.textedit}>{item.vehicleNo}    </Text>
                 <Text style={ss.textedit}>{item.vehicleType}   </Text>
              </View>
             
             
             <Button onPress={()=>addparkoutvehicle(item.id)}  mode="contained"uppercase={true} style={{backgroundColor: 'darkred', borderRadius: 10}}>Park Out</Button>
            </View>
        )
        
    }
    const showParkoutVehicleDetails=({item})=>{

      return(
          <View style={ss.flatlistview}>
            <View style={{flexDirection:'row'}}>
               <Text style={ss.textedit}>Vehicle No: {item.vehicleNo}  ,</Text>
               <Text style={ss.textedit}>   Type: {item.vehicleType}   </Text>
            </View>
          </View>
      )
      
  }
  return (
    <View style={ss.mainContainer}>
      <View style={ss.header}>
        <Text style={ss.headertext}>Car Parking System</Text>
      </View>
      <View style={ss.inputview}>
        <TextInput
          onChangeText={setvehicleNo}
          value={vehicleNo}
          mode="outlined"
          label="Vehicle No"
          placeholder="Enter Your Vehicle no"
          style={{width: 380}}
        />
        <Text style={{marginTop:10,}}>{message}</Text>
      </View>
      <View style={ss.parkinview}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <RadioButton onPress={()=>setVehicleType('Car')} status={vehicleType=='Car'?'checked':'unchecked'}/>
          <Text style={ss.radiobuttons}>Car</Text>
          <RadioButton onPress={()=>setVehicleType('Bike')}  status={vehicleType=='Bike'?'checked':'unchecked'}/>
          <Text style={ss.radiobuttons}>Bike</Text>
        </View>
        <View>
           <Button onPress={addparkinvehicel}  mode="contained"uppercase={true} style={{backgroundColor: 'darkgreen', borderRadius: 10, marginTop: 10, marginLeft: 20, marginRight: 20, width: 150,  }}> Park In</Button>

        </View>
      </View>
      <View style={ss.Buttonsview}>
         <Button onPress={()=>searchresults(1)}  mode="contained"uppercase={true} style={{backgroundColor: showall? selecttab:'darkred', borderRadius: 10, marginTop: 20,marginEnd:4 }}>All</Button>
         <Button onPress={()=>searchresults(2)} mode="contained"uppercase={true} style={{backgroundColor: showcar? selecttab:'darkred', borderRadius: 10, marginTop: 20,marginEnd:4   }}>Cars</Button>
         <Button onPress={()=>searchresults(3)} mode="contained"uppercase={true} style={{backgroundColor: showbike? selecttab:'darkred', borderRadius: 10, marginTop: 20,marginEnd:4  }}>Bikes</Button>
         <Button onPress={()=>searchresults(4)} mode="contained"uppercase={true} style={{backgroundColor: showParkout? selecttab:'darkred', borderRadius: 10, marginTop: 20,marginEnd:4 }}> Park Out</Button>
      </View>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginTop:20,marginHorizontal:20}}>
        <Text style={ss.textedit}>Total Park In:{countparkin}</Text>
        <Text style={ss.textedit}>Earning:{countAmount}</Text>
      </View>
          {showall &&
            <FlatList style={{marginTop:0}} data={allVehicle} renderItem={showVehicleDetails}></FlatList>

          }
          {showcar &&
            <FlatList style={{marginTop:0}} data={allCars} renderItem={showVehicleDetails}></FlatList>

          }
          {showbike &&
            <FlatList style={{marginTop:0}} data={allBikes} renderItem={showVehicleDetails}></FlatList>

          }
          {showParkout &&
            <FlatList style={{marginTop:0}} data={parkOutVehicle} renderItem={showParkoutVehicleDetails}></FlatList>

          }
    </View>
  );
}
const ss = StyleSheet.create({
  mainContainer: {
    height: 1000,
    marginVertical: 10,
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
});
export default CarParking;
