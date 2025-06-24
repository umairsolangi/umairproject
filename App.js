import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Login from './Components/SignupLogin/Login';
import VendorSignup from './Components/VendorInApp/VendorSignup';
import SignupOptions from './Components/SignupLogin/SignupOptions';
import VendorDashboar from './Components/VendorInApp/VendorDashboar';
import AdminDashboard from './Components/Admin/AdminDashboard';
import VendorShops from './Components/VendorInApp/VendorShops';
import VendorBranches from './Components/VendorInApp/VendorBranches';
import BranchApprove from './Components/Admin/BranchApprove';
import VendorApprove from './Components/Admin/VendorApprove';
import VendorDetails from './Components/Admin/VendorDetails';
import BranchDetails from './Components/Admin/BranchDetails';
import CustomerSignup from './Components/Customer/CustomerSignup';
import CustomerDrawerNavigation from './Components/Customer/CustomerDrawerNavigation';
import ShowItems from './Components/Customer/ShowItems';
import VendorAddItem from './Components/VendorInApp/VendorAddItem';
import VendorDrawerNavigation from './Components/VendorInApp/VendorDrawerNavigation';
import CustomerShowCartItem from './Components/Customer/CustomerShowCartItem';
import CustomerAddnewAddress from './Components/Customer/CustomerAddnewAddress';
import CustomerShowOrderDetails from './Components/Customer/CustomerShowOrderDetails';
import CustomerShowSaveCard from './Components/Customer/CustomerShowSaveCard';
import AdminDrawerNavigation from './Components/Admin/AdminDrawerNavigation';
import VendorViewBranchItem from './Components/VendorInApp/VendorViewBranchItem';
import VendorEditBranch from './Components/VendorInApp/VendorEditBranch';
import {CartProvider} from './Context/LmdContext';
import VendorBranchDrawerNav from './Components/VendorInApp/VendorBranchDrawerNav';
import OrganizationSignup from './Components/Organizations/OrganizationSignup';
import VendorShowOrderDetails from './Components/VendorInApp/VendorShowOrderDetails';
import CustomerShowPlaceOrderDetails from './Components/Customer/CustomerShowPlaceOrderDetails';
import CustomerShowPlaceOrderItem from './Components/Customer/CustomerShowPlaceOrderItem';
import OrganizationDrawerNavigation from './Components/Organizations/OrganizationDrawerNavigation';
import UserSignup from './Components/SignupLogin/UserSignup';
import RiderDrawerNavigation from './Components/DeliveryBoys/RiderDrawerNavigation';
import OrgVendorDetails from './Components/Organizations/OrgVendorDetails';
import RiderReadyOrdersScreen from './Components/DeliveryBoys/RiderReadyOrdersScreen';
import RiderOrders from './Components/DeliveryBoys/RiderOrders';
import RiderViewOrderOnMap from './Components/DeliveryBoys/RiderViewOrderOnMap';
import RiderViewAcceptedOrder from './Components/DeliveryBoys/RiderViewAcceptedOrder';
import CustomerTrackOrderMap from './Components/Customer/CustomerTrackOrderMap';
import AdminViewVendorsShop from './Components/Admin/AdminViewVendorsShop';
import AdminViewVendorBranches from './Components/Admin/AdminViewVendorBranches';
import Adminintegrationform from './Components/Admin/Adminintegrationform';
import AdminIntegrationOption from './Components/Admin/AdminIntegrationOption';
import AdminAddApiEndPoints from './Components/Admin/AdminAddApiEndPoints';
import AdminAddMapping from './Components/Admin/AdminAddMapping';
import AdminAddVariables from './Components/Admin/AdminAddVariables';
import Customeraddratingtoitems from './Components/Customer/Customeraddratingtoitems';
import Orgainizationadddeliveryboyvehicle from './Components/Organizations/Orgainizationadddeliveryboyvehicle';

const App = () => {
  const Stack = createNativeStackNavigator();
  var ipAdd = '172.16.20.143';
  var emulatorip = '10.0.2.2';
  var mobileip = '192.168.76.191';
  
  var homewifi = '192.168.100.11';
  global.url = `http://192.168.243.191:8000/api`;
  global.imgURL = `http://192.168.161.191:8000/`;
  /* screenOptions={{headerShown: false}} */
  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <CartProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
              <Stack.Screen name='Signup' component={UserSignup} />

              {/* Customer */}
              <Stack.Screen name="Customer Signup" component={CustomerSignup} />
              <Stack.Screen name="Customer Dashboard" component={CustomerDrawerNavigation}  options={{headerShown: false}}/>
              <Stack.Screen name="Branch Menu" component={ShowItems} /* options={{headerShown: false}}  */ />
              <Stack.Screen name="Cart Item" component={CustomerShowCartItem} />
              <Stack.Screen name="Add Address" component={CustomerAddnewAddress}/>
              <Stack.Screen name="Order Summary" component={CustomerShowOrderDetails} />
              <Stack.Screen name="Order Detail" component={CustomerShowPlaceOrderDetails} />
              <Stack.Screen name="Items" component={CustomerShowPlaceOrderItem} />
              <Stack.Screen name="Live Tracking" component={CustomerTrackOrderMap} />
              <Stack.Screen name="Order Feedback" component={Customeraddratingtoitems} />





              {/* In App Vendor */}
              <Stack.Screen name="Signup Options" component={SignupOptions} />
              <Stack.Screen name="Vendor Signup" component={VendorSignup} />
              <Stack.Screen name="Vendor Dashboard" component={VendorDrawerNavigation} options={{headerShown: false}} />
              <Stack.Screen name="Vendor Branches" component={VendorBranches} />
              <Stack.Screen name="Add Item" component={VendorAddItem} />
              <Stack.Screen name="View Item" component={VendorViewBranchItem} />
              <Stack.Screen name="Edit Branch" component={VendorEditBranch} />
              <Stack.Screen name="BranchDashboard" component={VendorBranchDrawerNav} options={{headerShown: false}}/>
              <Stack.Screen name="Order Details" component={VendorShowOrderDetails} />


              {/* Organization */}

              <Stack.Screen name="Organization Signup" component={OrganizationSignup}/>
              <Stack.Screen name="Organization Dashboard" component={OrganizationDrawerNavigation} options={{headerShown: false}}/>
              <Stack.Screen name="Vendors Details" component={OrgVendorDetails} />
              <Stack.Screen name="Add Vehicle" component={Orgainizationadddeliveryboyvehicle} />





              {/* Delivery Boys */}
              <Stack.Screen name="Rider Dashboard" component={RiderDrawerNavigation} options={{headerShown: false}}/>
              <Stack.Screen name="Ready Orders" component={RiderReadyOrdersScreen}/>
              <Stack.Screen name="Rider Orders" component={RiderViewAcceptedOrder}/>

              <Stack.Screen name="Map" component={RiderViewOrderOnMap}/>




              {/* Admin */}
              <Stack.Screen name="Admin Dashboard" component={AdminDrawerNavigation} options={{headerShown: false}}/>
              <Stack.Screen name="Branch Approval" component={BranchApprove} />
              <Stack.Screen name="Vendor Approval" component={VendorApprove} />
              <Stack.Screen name="Vendor Details" component={VendorDetails} />
              <Stack.Screen name="Branch Details" component={BranchDetails} />
              <Stack.Screen name="All Shops" component={AdminViewVendorsShop}/>
              <Stack.Screen name="All Branches" component={AdminViewVendorBranches}/>
              <Stack.Screen name="API Form" component={Adminintegrationform}/>
              <Stack.Screen name="API Options" component={AdminIntegrationOption}/>
              <Stack.Screen name="Add Methods" component={AdminAddApiEndPoints}/>
              <Stack.Screen name="Add Mapping" component={AdminAddMapping}/>
              <Stack.Screen name="Variables" component={AdminAddVariables}/>





            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
