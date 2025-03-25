import React, { useState } from 'react'
import { View ,StyleSheet,Image} from 'react-native'
import { Text,Button,TextInput, } from 'react-native-paper'

function WebApiEmployee() {

    const [showInputBoxes, setShowInputBoxes]=useState(false)
    const [showEmp ,setShowEmp] =useState(false)
    const getAllEmp=async()=>{
        

        

    }
  return (
   
    <View style={styles.container}>
        <Text style={styles.title}>Employee Information</Text>
         {showInputBoxes && (<>
      
      <Image
        source={{uri: null}}
        style={styles.image}
      /> 
      <Button
        mode="contained"
       
        style={styles.button}>
        Upload Image
      </Button>
      <TextInput
      
       
        mode="outlined"
        label="First Name"
        placeholder="Enter Name"
        style={styles.input}
      />
       <TextInput
      
       
      mode="outlined"
      label="Last Name"
      placeholder="Enter Name"
      style={styles.input}
    />
    <TextInput
       
        
       mode="outlined"
       label="Phone No"
       placeholder="Enter Phone No"
       style={styles.input}
     />
      <TextInput
       
        
        mode="outlined"
        label="City"
        placeholder="Enter City"
        style={styles.input}
      />
      <TextInput
       
        
        mode="outlined"
        label="Age"
        placeholder="Enter Age"
        style={styles.input}
      />
      <TextInput
        
        mode="outlined"
        label="Date of Birth"
        placeholder="Enter DOB"
        style={styles.input}
      />
       <Button
        mode="contained"
        onPress={()=>{}}
        style={[styles.button,{backgroundColor:'darkblue'}]}>
        Add Employee
      </Button></>
    )}
      <Button
        mode="contained"
        onPress={()=>setShowInputBoxes(!showInputBoxes)}
        style={styles.button}>
        Add Employee/Hide show
      </Button>
      <Button
        mode="contained"
        onPress={getAllEmp}
        style={styles.button}>
        Show Users
      </Button>
     {/*  {showEmp && (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.Id.toString()}
          style={styles.userList}
        />
      )} */}
    </View>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    backgroundColor: 'gray',
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
    marginHorizontal: 60,
    backgroundColor: 'darkgreen',
  },
  input: {
    marginBottom: 10,
    width: '100%',
  },
  userList: {
    marginTop: 20,
    backgroundColor: 'lightgreen',
    borderRadius: 10,
    padding: 10,
  },
  userCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: 'red',
  },
});
export default WebApiEmployee