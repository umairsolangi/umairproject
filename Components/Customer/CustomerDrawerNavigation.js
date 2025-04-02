import {View, Text, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomerDashboard from './CutomerShowBranches';
import CustomDrawer from './CustomDrawer';
import CustomerShowSaveCard from './CustomerShowSaveCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();

const CustomerDrawerNavigation = ({navigation, route}) => {
  const cutomerdata = route.params.customerdata;
  const [customerFullData, setCustomerFullData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomerFullDetails();
  }, []);
  const getCustomerFullDetails = async () => {
    try {
      const response = await fetch(`${url}/customers/${cutomerdata.id}`);
      const data = await response.json();
      if (data) {
        setCustomerFullData(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    finally {
      setLoading(false);
    }
  };
  return (
    loading ? (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator size="large" color="black" /* style={{marginTop: 20,alignSelf:'center'}}  *//>
        </View>   
        ) : (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} route={route} />}
      screenOptions={{
        drawerStyle: {backgroundColor: '#f7f7f7', width: 250},
        drawerLabelStyle: {fontSize: 20, fontWeight: 'bold', color: '#5c5959'},
        drawerActiveBackgroundColor: '#faebeb',
        drawerActiveTintColor: '#F8544B',
        drawerInactiveTintColor: '#666',
      }}>
      <Drawer.Screen
        name="Home"
        component={CustomerDashboard}
        initialParams={{cutomerdata}}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Save Cart"
        component={CustomerShowSaveCard}
        initialParams={{customerFullData,cutomerdata}}
        options={{
          drawerLabel: 'Save Cart',
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons name="cart" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
        )
  );
};

export default CustomerDrawerNavigation;
