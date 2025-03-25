import React, {useState} from 'react';
import {View, FlatList, Alert} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';

function TodoList() {
  const [employee, setEmployee] = useState([
    {ID: 1, Name: 'Rehman', Age: '22', City: 'Attock'},
    {ID: 2, Name: 'Mabroor', Age: '20', City: 'Rawalpindi'},
    {ID: 3, Name: 'Saif', Age: '18', City: 'Chakwal'},
    {ID: 4, Name: 'Hassan', Age: '25', City: 'Murree'},
  ]);
  const darry = [
    {ID: 1, Name: 'Rehman', Age: '22', City: 'Attock'},
    {ID: 2, Name: 'Mabroor', Age: '20', City: 'Rawalpindi'},
    {ID: 3, Name: 'Saif', Age: '18', City: 'Chakwal'},
    {ID: 4, Name: 'Hassan', Age: '25', City: 'Murree'},
  ];

  const deleteEmployee = id => {
    var filterarry = employee.filter(e => e.ID != id);
    setEmployee([...filterarry]);
  };
  const renderItem = ({item}) => {
    return (
      <View
        style={{
          borderWidth: 1,
          paddingVertical: 10,
          backgroundColor: 'pink',
          color: 'white',
          borderColor: 'black',
          borderRadius: 5,
          paddingLeft: 10,
          marginVertical: 10,
        }}>
        <View>
          <Text
            style={{
              alignSelf: 'center',
              color: 'black',
              borderColor: 'black',
              borderRadius: 5,
              paddingLeft: 10,
              fontSize: 30,
              fontWeight: 'bold',
              marginVertical: 10,
              marginHorizontal: 20,
            }}>
            {item.Name}
          </Text>
        </View>

        <View style={{alignSelf: 'center'}}>
          <Text
            style={{
              color: 'white',
              color: 'black',
              borderColor: 'black',
              borderRadius: 5,
              paddingLeft: 10,
              fontSize: 20,
              marginVertical: 10,
              marginHorizontal: 20,
            }}>
            City:{item.City} Age:{item.Age}
          </Text>
        </View>

        <View style={{flexDirection: 'column', alignSelf: 'center'}}>
          <Button
            mode="contained"
            uppercase={true}
            onPress={() => Alert.alert(item.ID + '')}
            style={{
              backgroundColor: 'darkgreen',
              borderRadius: 10,
              marginTop: 10,
              marginLeft: 20,
              marginRight: 20,
              width: 150,
            }}>
            Show ID
          </Button>
          <Button
            onPress={() => deleteEmployee(item.ID)}
            mode="contained"
            rippleColor="yellow"
            uppercase={true}
            style={{
              backgroundColor: 'darkred',
              borderRadius: 10,
              marginTop: 10,
              marginLeft: 20,
              marginRight: 20,
              width: 150,
            }}>
            Delete
          </Button>
        </View>
      </View>
    );
  };
  const resetarry = () => {
    setEmployee([...darry]);
  };
  return (
    <View style={{marginTop: 20,marginHorizontal:10}}>
      <View style={{display:'flex', flexDirection:'row',}} >
      <TextInput
                  
                  mode="outlined"
                  label="Add Todos"
                  placeholder="Enter time"
                  style={{width:300}}
                />
        <Button
          mode="contained"
          uppercase={true}
          onPress={resetarry}
          style={{
            backgroundColor: 'darkgreen',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 0,
            width: 80,
          }}>
          Add
        </Button>
      </View>
      <Button
        mode="contained"
        uppercase={true}
        onPress={resetarry}
        style={{
          backgroundColor: 'darkblue',
          alignSelf: 'center',
          borderRadius: 10,
          marginTop: 10,
          marginLeft: 20,
          marginRight: 20,
          width: "100%",
        }}>
        Reset
      </Button>
      <FlatList data={employee} renderItem={renderItem} />
    </View>
  );
}

export default TodoList;
