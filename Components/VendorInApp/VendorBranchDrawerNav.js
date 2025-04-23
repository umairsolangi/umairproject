import {View, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {ActivityIndicator} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import VendorBranchesDashboard from './VendorBranchesDashboard';
import VednorShowOrders from './VednorShowOrders';
import VendorViewBranchItem from './VendorViewBranchItem';
import VendorCustomDrawer from './VendorCustomDrawer';

const Drawer = createDrawerNavigator();

const VendorBranchDrawerNav = ({navigation, route}) => {
  const {branchData, ShopDetails, vendordata} = route.params;

  const [vendordetails, setvendordetails] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('branch Data:', branchData);
    console.log('Shop Data:', ShopDetails);
    console.log('vendor Data:', vendordata);
  }, []);

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="black" />
    </View>
  ) : (
    <Drawer.Navigator
    drawerContent={props => <VendorCustomDrawer {...props} route={route} />}

      screenOptions={{
        drawerStyle: {backgroundColor: '#f7f7f7', width: 250},
        drawerLabelStyle: {fontSize: 15, fontWeight: 'bold', color: '#5c5959'},
        drawerActiveBackgroundColor: '#faebeb',
        drawerActiveTintColor: '#F8544B',
        drawerInactiveTintColor: '#666',
      }}>
      <Drawer.Screen
        name="Dashboard"
        component={VendorBranchesDashboard}
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
        name="Orders"
        component={VednorShowOrders}
        initialParams={{
          branchData,
          ShopDetails,
          vendordata,
        }}
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
        name="Items"
        component={VendorViewBranchItem}
        initialParams={{
          branchData,
          ShopDetails,
          vendordata,
        }}
        options={{
          drawerIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="storefront-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default VendorBranchDrawerNav;
