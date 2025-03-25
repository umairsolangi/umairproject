import React, { useState } from 'react'
import { View,Text,TextInput} from 'react-native'
import { Button } from 'react-native-paper'

function Labtask4cal() {

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState(0);  

  const Resultcal=(e)=>{
    if(e=="add")
    {
        setResult(parseInt(num1) + parseInt(num2));
    }
    else if(e=="sub")
    {
        setResult(num1-num2)
    }
    else if(e=="mul")
        {
            setResult(num1*num2)
        }

        else if(e=="div")
            {
                setResult(num1/num2)
            }
    else{
        setResult(0)
    }
  }

  return (
   <View style={{borderWidth:2, borderRadius:10, height:800, margin:20, display:'flex', alignItems:'center', justifyContent:'center'}}>
               <Text style={{fontSize:40, fontWeight:'bold', justifyContent:'flex-start'}}>Calculator Task</Text>

       <View style={{borderWidth:2, borderRadius:10, height:50,width:300,marginBottom:50,backgroundColor:"darkred",display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:"white", fontSize:25, }}>Calculator</Text>
        </View>


        <TextInput onChangeText={(e)=>setNum1(e)} style={{borderWidth:2, borderRadius:10, width:300, paddingLeft:20, marginBottom:10}} placeholder='Enter 1st No'></TextInput>
        <TextInput onChangeText={(e)=>setNum2(e)} style={{borderWidth:2, borderRadius:10, width:300, paddingLeft:20}} placeholder='Enter 2nd No'></TextInput>
        
         <View style={{borderWidth:2, borderRadius:10, height:130,width:300, margin:20, display:'flex', flexDirection:"row", alignItems:'center',flexWrap:'wrap', justifyContent:'center'}}>
            <Button onPress={()=>Resultcal("add")} mode='contained' rippleColor='yellow'uppercase={true} style={{backgroundColor:'darkgreen', borderRadius:10, marginEnd:10,marginTop:30}}>Addition</Button>
            <Button onPress={()=>Resultcal("sub")} mode='contained' rippleColor='yellow'uppercase={true} style={{backgroundColor:'darkgreen', borderRadius:10, }}>Subtraction</Button>
            <Button onPress={()=>Resultcal("mul")} mode='contained' rippleColor='yellow'uppercase={true} style={{backgroundColor:'darkgreen', borderRadius:10, marginEnd:10}}>Multiplication</Button>
            <Button onPress={()=>Resultcal("div")} mode='contained' rippleColor='yellow'uppercase={true} style={{backgroundColor:'darkgreen', borderRadius:10, }}>Divison</Button>
         </View>

        <View style={{borderRadius:10, height:50,width:300,display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Text>{`Result: ${result}`}</Text>
        </View>
   </View>
  )
}

export default Labtask4cal