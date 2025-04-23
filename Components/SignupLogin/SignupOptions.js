import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { Button } from 'react-native-paper';

const SignupOptions = ({navigation}) => {
  const [selectedRole, setSelectedRole] = useState('Customer');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        What type of account do you want to open?
      </Text>

      {['Customer','Vendor','Organization'].map(role => (
        <TouchableOpacity
          key={role}
          style={[
            styles.option,
            selectedRole === role && styles.selectedOption,
          ]}
          onPress={() => setSelectedRole(role)}>
          <View
            style={[
              styles.radio,
              selectedRole === role && styles.selectedRadio,
            ]}
          />
          <Text style={styles.optionText}>{role}</Text>
        </TouchableOpacity>
      ))}

      {selectedRole==='Vendor' &&(
      <Button
          mode="contained"
          uppercase={true}
          onPress={() => navigation.navigate('Signup', {role: selectedRole})}
          style={{
            backgroundColor: '#F8544B',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 0,
            width: 150,
          }}>
          Continue
        </Button>)}
        {selectedRole==='Customer' &&(
      <Button
          mode="contained"
          uppercase={true}
          onPress={() => navigation.navigate('Signup', {role: selectedRole})}
          style={{
            backgroundColor: '#F8544B',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 0,
            width: 150,
          }}>
          Continue
        </Button>)}
        {selectedRole==='Organization' &&(
      <Button
          mode="contained"
          uppercase={true}
          onPress={() => navigation.navigate('Signup', {role: selectedRole})}
          style={{
            backgroundColor: '#F8544B',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 0,
            width: 150,
          }}>
          Continue
        </Button>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal:10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black'
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCECEC',
    color:  'black',
    padding: 15,
    width: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedOption: {borderWidth: 2, borderColor: '#F8544B'},
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 10,
  },
  selectedRadio: {backgroundColor: '#F8544B', borderColor: '#F8544B'},
  optionText: {fontSize: 16,color:'black'},
  button: {
    backgroundColor: '#F8544B',
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
});

export default SignupOptions;
