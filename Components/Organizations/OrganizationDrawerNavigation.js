import {View, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {createDrawerNavigator} from '@react-navigation/drawer';
import OrganizationDashboard from './OrganizationDashboard';
import OrganizationAddDeliverBoy from './OrganizationAddDeliverBoy';
import {ActivityIndicator} from 'react-native-paper';
import OrganizationCustomDrawer from './OrganizationCustomDrawer';
import OrgReceiveVendorReq from './OrgReceiveVendorReq';
import OrganizationAddVehiclecatagory from './OrganizationAddVehiclecatagory';
import OrgainzationExistingriders from './OrgainzationExistingriders';

const Drawer = createDrawerNavigator();

const OrganizationDrawerNavigation = ({navigation, route}) => {
  const userdata = route.params.customerdata;
  console.log('user data', userdata);
  const [organizationdetails, setOrganizationdetails] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getOrganizationDetails();
  }, []);

  const getOrganizationDetails = async () => {
    try {
      const response = await fetch(`${url}/organizations/${userdata.id}`);

      if (response.ok) {
        var data = await response.json();
        if (data) {
          setOrganizationdetails(data);
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
      drawerContent={props => (
        <OrganizationCustomDrawer
          {...props}
          route={{params: {organizationdetails}}}
        />
      )}
      screenOptions={{
        drawerStyle: {backgroundColor: '#f7f7f7', width: 250},
        drawerLabelStyle: {fontSize: 15, fontWeight: 'bold', color: '#5c5959'},
        drawerActiveBackgroundColor: '#faebeb',
        drawerActiveTintColor: '#F8544B',
        drawerInactiveTintColor: '#666',
      }}>
      <Drawer.Screen
        name="Dashboard"
        component={OrganizationDashboard}
        initialParams={{organizationdetails}}

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
        name="Add Riders"
        component={OrganizationAddDeliverBoy}
        initialParams={{organizationdetails}}
        options={{
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-multiple-plus"
              color={color}
              size={size}
            />
          ),
        }}
      />
<Drawer.Screen
        name="All Riders"
        component={OrgainzationExistingriders}
        initialParams={{organizationdetails}}
        options={{
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={size}
            />
          ),
        }}
      />



      <Drawer.Screen
        name="Vehicle catagory"
        component={OrganizationAddVehiclecatagory}
        initialParams={{organizationdetails}}
        options={{
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="car-multiple"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Approve Vendors"
        component={OrgReceiveVendorReq}
        initialParams={{organizationdetails}}
        options={{
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-check"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default OrganizationDrawerNavigation;
