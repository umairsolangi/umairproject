import React from 'react';
import {Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Sharepref = () => {
    const setStudent=async()=>{
        const stdlist=[
            {"name":"Rehman","Age":21},
            {"name":"Mabroor","Age":20},
            {"name":"Saif","Age":24},
            {"name":"Hassan","Age":18},

        ]
        
        await AsyncStorage.setItem('student',JSON.stringify(stdlist))
        console.log("student list added")


    }
    const getStudent=async()=>{

       
        const res=await AsyncStorage.getItem('student')
        if(res){
            const data=JSON.parse(res)
            console.log(data)
        }


    }
  return (
    <View>
      <Text>Hello</Text>
          <Button 
                mode="contained"
                uppercase={true}
                onPress={setStudent}
                style={{
                  backgroundColor: '#F8544B',
                  alignSelf: 'center',
                  borderRadius: 10,
                  marginTop: 10,
                  marginLeft: 10,
                  marginRight: 0,
                  width: 150, 
                }}>
               Save Student
              </Button>
              <Button 
                mode="contained"
                uppercase={true}
                onPress={getStudent}
                style={{
                  backgroundColor: '#F8544B',
                  alignSelf: 'center',
                  borderRadius: 10,
                  marginTop: 10,
                  marginLeft: 10,
                  marginRight: 0,
                  width: 150, 
                }}>
               get student
              </Button>
    </View>
  );
};

export default Sharepref;
