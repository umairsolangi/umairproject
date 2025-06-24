import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Switch} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import RiderDashboard from './RiderDashboard';
import RiderOrders from './RiderOrders';
import RiderReadyOrdersScreen from './RiderReadyOrdersScreen';
import {useCart} from '../../Context/LmdContext';
import {ActivityIndicator} from 'react-native-paper';
import CustomDrawer from '../CommonComponents/CustomDrawer';
import {convertDistance} from 'geolib';
import RiderViewAcceptedOrder from './RiderViewAcceptedOrder';
import RiderAddvehicle from './RiderAddvehicle';

const Drawer = createDrawerNavigator();

const RiderDrawerNavigation = ({navigation, route}) => {
  const {isOnline, setIsOnline, setReadyOrder, DeliveryBoyOffONline} =
    useCart();
  const userdata = route.params.userdata;
  const [Userdetails, setUserdetails] = useState('');
  const [loading, setLoading] = useState(true);
  const [readyOrderCount, setReadyOrderCount] = useState(0);
  console.log('Rider Nave');

  useEffect(() => {
    getUserDetails();

    let interval;
    if (isOnline) {
      fetchReadyOrders(); // Fetch ready order count on load
      /* interval = setInterval(() => {
        fetchReadyOrders();
      }, 30000); // every 10 seconds */
    }

    return () => clearInterval(interval);
  }, [isOnline]);

  const getUserDetails = async () => {
    try {
      const response = await fetch(`${url}/deliveryboy/${userdata.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserdetails(data);
        console.log(data);
      }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReadyOrders = async () => {
    try {
      const response = await fetch(
        `${url}/deliveryboy/ready-suborders/${userdata.id}`,
      );
      if (response.ok) {
        const data = await response.json();
        setReadyOrderCount(data.data.length);
        setReadyOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching ready orders:', error.message);
    }
  };

  const renderHeaderRight = () => (
    <>
    {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {/* Bill icon with badge 
       <TouchableOpacity
        onPress={() => navigation.navigate('Ready Orders', {Userdetails})}
        style={{marginRight: 10}}>
        {readyOrderCount > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -6,
              top: -4,
              backgroundColor: 'red',
              borderRadius: 10,
              width: 18,
              height: 18,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>
              {readyOrderCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

       Online switch 
      <Switch
        value={isOnline}
        onValueChange={val => DeliveryBoyOffONline(val)}
        trackColor={{false: '#989c99', true: '#71c774'}}
        thumbColor={isOnline ? '#4CAF50' : 'grey'}
      />
    </View> */}
    <View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 0,
    padding: 5,
   
  }}>
  <View>
    
    <Text style={{color: '#666', fontSize: 13}}>
      {isOnline ? 'Online Mode' : 'Offline Mode'}
    </Text>
  </View>
  <Switch
    value={isOnline}
    onValueChange={val => DeliveryBoyOffONline(val,Userdetails.delivery_boy_id)}
    trackColor={{false: '#d1d1d1', true: '#71c774'}}
    thumbColor={isOnline ? '#4CAF50' : '#ccc'}
    ios_backgroundColor="#ccc"
  />
</View>

    </>
  );

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="black" />
    </View>
  ) : (
    <Drawer.Navigator
      drawerContent={props => (
        <CustomDrawer {...props} route={{params: {Userdetails}}} />
      )}
      screenOptions={{
        headerRight: renderHeaderRight,
        drawerStyle: {backgroundColor: '#f7f7f7', width: 250},
        drawerLabelStyle: {fontSize: 15, fontWeight: 'bold', color: '#5c5959'},
        drawerActiveBackgroundColor: '#faebeb',
        drawerActiveTintColor: '#F8544B',
        drawerInactiveTintColor: '#666',
      }}>
      <Drawer.Screen
        name="Dashboard"
        component={RiderDashboard}
        initialParams={{Userdetails}}
        options={{
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Your Orders"
        initialParams={{Userdetails}}
        component={RiderViewAcceptedOrder}
        options={{
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Add vehicles"
        initialParams={{Userdetails}}
        component={RiderAddvehicle}
        options={{
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Ready Orders"
        component={RiderReadyOrdersScreen}
        options={{
          drawerItemStyle: {display: 'none'}, // Hide from drawer menu
        }}
      />
    </Drawer.Navigator>
  );
};

export default RiderDrawerNavigation;
