import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, RadioButton, Text } from 'react-native-paper'

function QuizApp() {
   const quizQuestion=[
    {question:"Q1: 2+2=?" ,option1:"4", option2:"5", option3:"2", option4:"3",correctoption:"4"},
    {question:"Q2: 1*5=?" ,option1:"8", option2:"5", option3:"2", option4:"3",correctoption:"5"},
    {question:"Q3: 4/2=?" ,option1:"10", option2:"5", option3:"2", option4:"3",correctoption:"2"},
    {question:"Q4: 5-2=?" ,option1:"17", option2:"5", option3:"2", option4:"3",correctoption:"3"},
    {question:"Q5: 2+2+1=?" ,option1:"29", option2:"5", option3:"2", option4:"3",correctoption:"5"},
    

   ]

   const[ans,setAns]=useState([])
   const[q1,setq1]=useState("")
   const[correctanscount,setCorrectAnsCount]=useState(0)
   const[AttempQcount,setAttempQcount]=useState(0)
   const[score,setScore]=useState(0)
   const[status, setStatus]=useState('')



   const[nextq,setNextq]=useState(0)
   const[showResult, setShowResult]=useState(true)
   const[breakq,setBreakQ]=useState(0)




   const checkcount=()=>{
    setBreakQ(breakq+1)
    if(breakq==5)
    {
       
        console.log(`All  Ans:${ans}`)
             
    }
    else{
        console.log(nextq)
        ansobj={ans:q1, correctans:quizQuestion[nextq].correctoption}
        console.log(ansobj)
        setAns([...ans,ansobj])
        setNextq(nextq+1)
        setq1('')

         
    }
   
   }

   const calculateResult=()=>{

       ans.forEach((e) => {
           setAttempQcount(AttempQcount+1)
           if(e.ans== e.correctans)
           {
               setCorrectAnsCount(correctanscount+1)
           }
       });
     
     setScore(correctanscount*10) 
      setShowResult(!showResult)
   
      
   
   }


  return (


    
    <View style={{backgroundColor:'white', height:1000, margin:0}}>
        <View style={{backgroundColor:"darkgreen", height:50, marginTop:20, alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:"white", fontSize:24}}>Quiz App</Text>
        </View>
        <View style={{backgroundColor:"darkred", height:50, marginTop:20, alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:"white", fontSize:24}}>You have total 5 question to Attempt</Text>
        </View>
        
        
        { !showResult &&
           <View style={{backgroundColor:"grey", height:50,paddingLeft:30, marginTop:20, alignItems:'start', justifyContent:'center'}}>
       <Text style={{color:"white", fontSize:24}}>{quizQuestion[nextq].question}</Text>
   </View>
}
{ !showResult &&
       <View style={{backgroundColor:"white",marginLeft:30, height:200, marginTop:20, alignItems:'start', justifyContent:'center'}}>
            <Text style={{color:"black", fontSize:24}}>options:</Text>
            <View style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                <RadioButton  onPress={()=>setq1(quizQuestion[nextq].option1)} status={q1==quizQuestion[nextq].option1? 'checked':'unchecked'} />
                <Text style={{color:"black", fontSize:24}}>{quizQuestion[nextq].option1}</Text>
            </View>
            <View style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                <RadioButton onPress={()=>setq1(quizQuestion[nextq].option2)} status={q1==quizQuestion[nextq].option2? 'checked':'unchecked'}/>
                <Text style={{color:"black", fontSize:24}}>{quizQuestion[nextq].option2}</Text>
            </View>
            <View style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                <RadioButton onPress={()=>setq1(quizQuestion[nextq].option3)} status={q1==quizQuestion[nextq].option3? 'checked':'unchecked'}/>
                <Text style={{color:"black", fontSize:24}}>{quizQuestion[nextq].option3}</Text>
            </View>
            <View style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                <RadioButton onPress={()=>setq1(quizQuestion[nextq].option4)} status={q1==quizQuestion[nextq].option4? 'checked':'unchecked'}/>
                <Text style={{color:"black", fontSize:24}}>{quizQuestion[nextq].option4}</Text>
            </View>
        </View>
      
    }



        


        { !showResult &&
            <Button onPress={checkcount}  mode='contained' rippleColor='yellow' uppercase={true} style={{backgroundColor:'darkgreen', borderRadius:10, marginTop:10,marginLeft:20,marginRight:20}}>Next Question</Button>
      }
       
            <Button onPress={calculateResult}  mode='contained'rippleColor='yellow' uppercase={true} style={{backgroundColor:'darkgreen', borderRadius:10, marginTop:10,marginLeft:20,marginRight:20}}>Finish</Button>
     



    {showResult &&
        <View style={{backgroundColor:"blue", height:60,paddingLeft:30,paddingTop:10, marginTop:20, alignItems:'start', justifyContent:'start'}}>
            <Text style={{color:"white", fontSize:24, fontWeight:'bold'}}>Summery</Text>
            <View style={{backgroundColor:"white", height:200,paddingLeft:30,paddingTop:10, marginTop:20, alignItems:'start', justifyContent:'start'}}>
                <Text style={{color:"black", fontSize:24}}>Yor Attemp {AttempQcount} Question</Text>
                <Text style={{color:"black", fontSize:24}}>Total Question:                 5</Text>
                <Text style={{color:"black", fontSize:24}}>Your Correct Answer:       {correctanscount}</Text>
                <Text style={{color:"black", fontSize:24}}>Total Score:                       {score}</Text>
                <Text style={{color:"black", fontSize:24}}>status:                            pass</Text>




            </View>
        </View>
      }
    </View>
  )
}

export default QuizApp