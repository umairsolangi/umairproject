import {View, Text, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AdminDashboard from './AdminDashboard';
import VendorApprove from './VendorApprove';
import AdminCustomDrawer from './AdminCustomDrawer';
import BranchApprove from './BranchApprove';

const Drawer = createDrawerNavigator();

const AdminDrawerNavigation = ({navigation, route}) => {
  const admindata = route.params.Admindata;

  
  return (
 
    <Drawer.Navigator
      drawerContent={props => <AdminCustomDrawer {...props} route={route} />}
      screenOptions={{
        drawerStyle: {backgroundColor: '#f7f7f7', width: 300},
        drawerLabelStyle: {fontSize: 20, fontWeight: 'bold', color: '#5c5959'},
        drawerActiveBackgroundColor: '#faebeb',
        drawerActiveTintColor: '#F8544B',
        drawerInactiveTintColor: '#666',
      }}>
      <Drawer.Screen
        name="Dashboard"
        component={AdminDashboard}
        initialParams={{admindata}}
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Approve Vendors "
        component={VendorApprove}
        options={{
          drawerLabel: 'Approve Vendors ',
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account-multiple-check" color={color} size={size} />
          ),
        }}
      />

<Drawer.Screen
        name="Approve Branches"
        component={BranchApprove}
        options={{
          drawerLabel: 'Approve Branches',
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons name="store-check" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>

  );
};

export default AdminDrawerNavigation;
