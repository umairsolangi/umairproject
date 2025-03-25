import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Button, Checkbox, RadioButton} from 'react-native-paper';

function UserForm() {
  const [gender, setGender] = useState('female');
    const [id, setID] = useState('')
    const [count, setCount] = useState(0)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [status, setStatus] = useState(false)
    const [marital, setMarital] = useState(true);
    const [graduate, setGraduate] = useState(true)
    const [arrayUsers, setAllUsers] = useState([])
    const saveData = () => {
        if (password != cPassword) {
            console.warn('Password Not Same/Mathced');
            return;
        }
        if (!password || !cPassword) {
            console.warn('Please Enter Password/Confirm Password');
            return;
        }
        var user = {
            id: id, name: name, email: email, password: password,
            gender: gender, status: status, marital: marital, graduate: graduate
        };
        setAllUsers([...arrayUsers, user])
        setCount(count + 1)
        console.log(arrayUsers)
    }

  return (
    <View style={{backgroundColor: 'white', height: 1000}}>
      <View style={ss.container}>
        <Text style={{color: 'white', fontSize: 22, fontWeight: 'bold'}}>
        {`${count} Users Enroll Right Now`}
        </Text>
      </View>
      <View style={{margin: 20}}>
        <Text style={ss.labels}>user ID</Text>
        <TextInput onChangeText={setID} style={ss.textInput} />
        <Text style={ss.labels}>Name</Text>
        <TextInput onChangeText={setName} style={ss.textInput} />
        <Text style={ss.labels}>Email</Text>
        <TextInput onChangeText={setEmail} style={ss.textInput} />
        <Text style={ss.labels}>Password</Text>
        <TextInput onChangeText={setPassword} style={ss.textInput} />
        <Text style={ss.labels}>Confirm Password</Text>
        <TextInput onChangeText={setCPassword} style={ss.textInput}/>
      </View>

      <View
        style={{
          marginLeft: 20,
          marginEnd: 20,
          marginBottom: 20,
          borderWidth:2,
          borderRadius:10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'start',
        }}>
        <RadioButton style={{color: 'white'}} onPress={()=>setGender("Male")}  status={gender=="Male" ? "checked": "unchecked"}/>
        <Text style={{color: 'black', marginEnd: 50}}>Male</Text>

        <RadioButton style={{color: 'white'}} onPress={()=>setGender("Female")}  status={gender=="Female" ? "checked": "unchecked"} />
        <Text style={{color: 'black'}}>Female</Text>
      </View>
      <View
        style={{
          marginLeft: 20,
          marginEnd: 20,
          borderWidth:2,
          borderRadius:10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'start',
        }}>
        <RadioButton style={{color: 'white'}} onPress={() => setStatus(true)} status={status ? 'checked' : 'unchecked'}/>
        <Text style={{color: 'black', marginEnd: 50}}>Active</Text>

        <RadioButton style={{color: 'white'}} onPress={() => setStatus(false)} status={status ? 'unchecked' : 'checked'}/>
        <Text style={{color: 'black'}}>InActive</Text>
      </View>

      <View
        style={{
          marginLeft: 20,
          marginEnd: 20,
          marginTop:20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'start',
        }}>
        <Checkbox onPress={()=> setMarital(!marital)}  status={marital? "checked":"unchecked"}/>
        <Text style={{color: 'black'}}>Married</Text>
      </View>
      <View
        style={{
          marginLeft: 20,
          marginEnd: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'start',
        }}>
        <Checkbox onPress={()=> setGraduate(!graduate)}  status={graduate? "checked":"unchecked"}/>
        <Text style={{color: 'black'}}>Graduated</Text>
      </View>
      <View
        style={{
          marginLeft: 20,
          marginEnd: 20,
        }}>
         <Button  
                onPress={saveData}
                mode='contained'
                rippleColor='yellow'
                uppercase={true}
                style={{backgroundColor:'darkgreen', borderRadius:10, marginTop:10}}
          >
                  Save
                
         </Button>
                
      </View>
      
    </View>
  );
}

const ss = StyleSheet.create({
  container: {
    backgroundColor: 'darkgreen',
    height: 60,
    margin: 20,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 2,
    marginBottom: 10,
    borderRadius: 10,
    paddingStart: 20,
    color: 'black',
    fontSize: 15,
    height: 50,
  },
  labels: {
    color: 'black',
    marginStart: 5,
    marginBottom: 4,
  },
});

export default UserForm;
