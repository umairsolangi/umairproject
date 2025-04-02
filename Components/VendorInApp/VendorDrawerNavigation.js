import {View, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import VendorDashboar from './VendorDashboar';
import VendorCustomDrawer from './VendorCustomDrawer';
import VendorShops from './VendorShops';
import {ActivityIndicator} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator
        size="large"
        color="black" /* style={{marginTop: 20,alignSelf:'center'}}  */
      />
    </View>
  ) : (
    <Drawer.Navigator
      drawerContent={props => <VendorCustomDrawer {...props} route={route} />}
      screenOptions={{
        drawerStyle: {backgroundColor: '#f7f7f7', width: 250},
        drawerLabelStyle: {fontSize: 20, fontWeight: 'bold', color: '#5c5959'},
        drawerActiveBackgroundColor: '#faebeb',
        drawerActiveTintColor: '#F8544B',
        drawerInactiveTintColor: '#666',
      }}>
     <Drawer.Screen
        name="Dashboard"
        component={VendorDashboar}
        initialParams={{ vendordetails }}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Shops"
        component={VendorShops}
        initialParams={{ vendordetails }}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="store" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default VendorDrawerNavigation;
