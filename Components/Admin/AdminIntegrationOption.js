import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const AdminIntegrationOption = ({navigation, route}) => {
  const {item,vendordata} = route.params;
  const [apivendor,setapivendor]=useState({})
 useEffect(()=>{
  getApiVendorId()
 },[])
  const getApiVendorId = async () => {
    try {
      const response = await fetch(`${url}/admin/api-vendor/${item.id}`);
      const data = await response.json();

      if (data.status) {
        setapivendor(data.data)
      }
    } catch (error) {
      console.error('Error fetching methods:', error);
    } 
  };
  const handleNavigate = screenName => {
    navigation.navigate(screenName,{item,apivendor});
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Integration Options</Text>

      {[
        {label: 'Add API Details', screen: 'API Form'},
        {label: 'Add API Endpoints', screen: 'Add Methods'},
        {label: 'Add Mapping', screen: 'Add Mapping'},
         {label: 'Add Variables', screen: 'Variables'},
       
      ].map((btn, index) => (
        <TouchableOpacity
          key={index}
          style={styles.actionButton}
          onPress={() => handleNavigate(btn.screen)}>
          <Text style={styles.actionButtonText}>{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default AdminIntegrationOption;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FF5C5C',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#FF5C5C',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
