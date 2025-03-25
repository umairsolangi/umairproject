import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

const VendorDashboar = ({navigation, route}) => {
  const userdata = route.params.vendordetails;
  console.log('vendors data:', userdata);
  
  return (
    <View style={ss.mainContainer}>
      <View
        style={{
          backgroundColor: '#f5f0f0',
          width: '100%',
          height: 200,
          padding: 20,
          borderRadius: 10,
        }}>
        <Text
          style={{fontSize: 25, fontWeight: 'bold', alignSelf: 'flex-start'}}>
          Hey!{userdata.name}                 Welcome To Dashboard
        </Text>
        <Text
          style={{fontSize: 25, fontWeight: 'bold', alignSelf: 'flex-start'}}>
          Vendor Type: {userdata.vendor_type}
        </Text>
      </View>
    </View>
  );
};
const ss = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
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
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  radiobuttons: {
    fontSize: 18,
  },
  Buttonsview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatlistview: {
    backgroundColor: 'lightgrey',
    minHeight: 80,
    borderWidth: 3,
    borderColor: 'darkred',
    margin: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  textedit: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default VendorDashboar;
