import {View, Text} from 'react-native';
import React, { useState, useEffect } from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import VendorDashboar from './VendorDashboar';
import VendorCustomDrawer from './VendorCustomDrawer';
import VendorShops from './VendorShops';
import { ActivityIndicator } from 'react-native-paper';

const Drawer = createDrawerNavigator();

const VendorDrawerNavigation = ({navigation, route}) => {
  const userdata = route.params.vendordata;

  const [vendordetails, setvendordetails] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchVendorId();
  }, []);

  const searchVendorId = async () => {
    try {
      const response = await fetch(`${url}/vendor/${userdata.id}`);

      if (response.ok) {
        var data = await response.json();
        if (data) {
          setvendordetails(data);
        }
      } else {
        const errorText = await response.text();
      }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };
  return (

    loading ? (
      <ActivityIndicator size="large" color="black" style={{marginTop: 20}} />
      
    ) : (
    <Drawer.Navigator
      drawerContent={props => <VendorCustomDrawer {...props} route={route} />}
      screenOptions={{
        drawerStyle: {backgroundColor: '#f7f7f7', width: 250}, 
        drawerLabelStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#5c5959',
          borderRadius: 0,
        },
        drawerActiveBackgroundColor: '#faebeb', 
        drawerActiveTintColor: 'white', 
        drawerInactiveTintColor: '#666', 
      }}>
      <Drawer.Screen name="Dashboard" component={VendorDashboar} initialParams={{vendordetails}}/>
      <Drawer.Screen name="Shops" component={VendorShops} initialParams={{vendordetails}}/>
    </Drawer.Navigator>

)
  );
};

export default VendorDrawerNavigation;
