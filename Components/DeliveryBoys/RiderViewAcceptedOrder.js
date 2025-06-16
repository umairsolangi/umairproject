import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {ActivityIndicator, Card, Button} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';

const RiderViewAcceptedOrder = ({navigation, route}) => {
  const {Userdetails} = route.params;
  const [pickeduporders, setPickedUpOrders] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const trackingId = useRef(null);
  const ratePerKm = 20;
console.log('Filetpply')
  const categories = [
    'All',
    'Accepted Orders',
    'Picked_UP Orders',
    'In_Transit Orders',
    'Delivered Orders',
    'Confirmed Payment',
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const calculateCharges = (pickup, delivery) => {
    const distanceMeters = getDistance(
      {
        latitude: parseFloat(pickup.latitude),
        longitude: parseFloat(pickup.longitude),
      },
      {
        latitude: parseFloat(delivery.latitude),
        longitude: parseFloat(delivery.longitude),
      },
    );
    const km = distanceMeters / 1000;
    const charges = km * ratePerKm;
    return {km: km.toFixed(2), charges: charges.toFixed(0)};
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${url}/deliveryboy/${Userdetails.lmd_id}/assigned-suborders`,
      );
      const data = await response.json();
      if (data?.data) {
        setPickedUpOrders(data.data);
        setFilteredItems(data.data)        
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
    setSelectedCategory('All');
  };

  const filterItems = category => {
    setSelectedCategory(category);
    let status = '';
    switch (category) {
      case 'Accepted Orders':
        status = 'assigned';
        break;
      case 'Picked_UP Orders':
        status = 'picked_up';
        break;
      case 'In_Transit Orders':
        status = 'in_transit';
        break;
      case 'Delivered Orders':
        status = 'delivered';
        break;
      case 'Confirmed Payment':
        status = 'confirmed_by_deliveryboy';
        break;
      default:
        status = '';
    }

    if (status === '') {
      setFilteredItems(pickeduporders);
    } else if (status === 'confirmed_by_deliveryboy') {
      const filtered = pickeduporders.filter(
        order => order.payment_status === status,
      );
      setFilteredItems(filtered);
    } else if (status === 'delivered') {
      const filtered = pickeduporders.filter(
        order => order.payment_status === 'confirmed_by_customer' && order.status == 'delivered' 
      );
      setFilteredItems(filtered);
    }
     else {
      const filtered = pickeduporders.filter(
        order =>
          order.status === status ,
      );
      setFilteredItems(filtered);
    }
  };

  const handleMarkPickup = async order => {
    Geolocation.getCurrentPosition(
      async position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await fetch(
            `${url}/deliveryboy/order/${order.suborder_id}/pickup`,
            {
              method: 'PATCH',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                latitude: latitude,
                longitude: longitude,
              }),
            },
          );

          if (response.ok) {
            Alert.alert('Success', 'Order Picked UP Successfully');

            /*             startLiveLocationTracking(order.suborder_id);
             */
          } else {
            Alert.alert('Error', 'Vendor Not Confirmed Pickup');
          }
        } catch (error) {
          console.error('Error marking as picked up:', error.message);
        }
      },
      error => {
        console.log('Location error:', error.message);
        Alert.alert('Error', 'Unable to get current location');
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const delivereyBoyReachedDes = async order => {
    Geolocation.getCurrentPosition(
      async position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await fetch(
            `${url}/deliveryboy/reach-destination/${Userdetails.delivery_boy_id}/${order.suborder_id}`,
            {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                latitude: latitude,
                longitude: longitude,
              }),
            },
          );

          const data = await response.json();
          if (response.ok) {
            Alert.alert('Success', 'Order marked as delivered');
            if (trackingId.current !== null) {
              Geolocation.clearWatch(trackingId.current);

              trackingId.current = null;
              console.log('Live tracking stopped.');
            }
          } else {
            Alert.alert('Error', 'Vendor Not Confirmed Pickup');
          }
        } catch (error) {
          console.error('Error marking as delivered:', error.message);
        }
      },
      error => {
        console.log('Location error:', error.message);
        Alert.alert('Error', 'Unable to get current location');
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  /*   const startLiveLocationTracking = (suborderId) => {
    trackingId.current  = Geolocation.watchPosition(
      position => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log('Location changed:', coords);

        fetch(`${url}/deliveryboy/order/${suborderId}/location`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(coords),
        });
      },
      error => {
        console.log('Live tracking error:', error.message);
      },
      {
        enableHighAccuracy: false,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 3000,
      }
    );
  }; */

  const confirmorderPayment = async order => {
    try {
      const response = await fetch(
        `${url}/deliveryboy/confirm-payment/${order.suborder_id}`,
        {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
        },
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Payment Confirm Succeccfully');
      } else {
        Alert.alert('Error', 'Customer Not Confirmed Payment');
      }
    } catch (error) {
      console.error('Error marking as delivered:', error.message);
    }
  };

  const renderOrderCard = ({item: order}) => {
    const pickup = order.shop.branch.pickup_location;
    const delivery = order.customer.delivery_address;
    const {km, charges} = calculateCharges(pickup, delivery);

    return (
      <Card
        key={order.suborder_id}
        style={{
          marginBottom: 15,
          backgroundColor: '#faebeb',
          borderRadius: 12,
          padding: 10,
        }}>
        {/* Pickup Info */}
        <View style={styles.infoRow}>
          <View style={styles.iconColumn}>
            <MaterialCommunityIcons
              name="map-marker"
              size={30}
              color="#F8544B"
            />
            <Text style={styles.label}>Pickup</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.orderId}>Order ID: {order.suborder_id}</Text>
            <Text style={styles.orderId}>Status: {order.status}</Text>
            <Text style={styles.shopName}>{order.shop.name}</Text>
            <Text style={styles.location}>
              {order.shop.branch.name}, {order.shop.branch.pickup_location.city}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.iconColumn}>
            <MaterialCommunityIcons
              name="map-marker"
              size={30}
              color="#4CAF50"
            />
            <Text style={styles.label}>Deliver</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.boldText}>{order.customer.name}</Text>
            <Text style={styles.phone}>{order.customer.phone}</Text>
            <Text style={styles.location}>
              {delivery.street}, {delivery.city}
            </Text>
          </View>
        </View>

        <Text style={styles.distanceText}>
          Delivery Distance: <Text style={styles.boldText}>{km} km</Text>
          {'\n'}
          Delivery Charges: <Text style={styles.boldText}>Rs {charges}</Text>
        </Text>

        <View style={styles.actionRow}>
          {order.status == 'assigned' && (
            <TouchableOpacity
              style={styles.deliverBtn}
              onPress={() => handleMarkPickup(order)}>
              <Text style={styles.btnText}>Picked Order</Text>
            </TouchableOpacity>
          )}
          {(order.status == 'picked_up' || order.status == 'in_transit') && (
            <TouchableOpacity
              style={styles.deliverBtn}
              onPress={() => delivereyBoyReachedDes(order)}>
              <Text style={styles.btnText}>Deliver Order</Text>
            </TouchableOpacity>
          )}
          {/* {order.status == 'picked_up' && (
            <TouchableOpacity
              style={styles.deliverBtn}
              onPress={() => delivereyBoyReachedDes('picked_up')}>
              <Text style={styles.btnText}>Deliver Order</Text>
            </TouchableOpacity>
          )} */}
          {(order.status == 'delivered' && order.payment_status == 'confirmed_by_customer') && (
            <TouchableOpacity
              style={styles.deliverBtn}
              onPress={() => confirmorderPayment(order)}>
              <Text style={styles.btnText}>Confirm Payment</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() => navigation.navigate('Map', {order})}>
            <Text style={styles.btnText}>View on Map</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return loading ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="black" />
    </View>
  ) : (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <Button
              mode={selectedCategory === item ? 'contained' : 'outlined'}
              textColor={selectedCategory === item ? 'white' : 'black'}
              buttonColor={selectedCategory === item ? '#F8544B' : 'white'}
              onPress={() => filterItems(item)}
              style={styles.categoryButton}>
              {item}
            </Button>
          )}
        />
      </View>

      {/* Order List */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.suborder_id.toString()}
        renderItem={renderOrderCard}
        contentContainerStyle={{padding: 10}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 30}}>
            No orders found.
          </Text>
        }
      />
    </View>
  );
};

export default RiderViewAcceptedOrder;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  iconColumn: {
    alignItems: 'center',
    padding: 10,
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
  },
  orderId: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  shopName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#F8544B',
  },
  location: {
    color: '#555',
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 12,
    color: '#555',
  },
  distanceText: {
    marginBottom: 8,
    color: '#444',
  },
  boldText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 15,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  deliverBtn: {
    backgroundColor: '#F8544B',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  mapBtn: {
    backgroundColor: 'darkgreen',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryContainer: {
    padding: 10,
    paddingTop: 15,
  },
  categoryButton: {
    borderColor: 'black',
    marginHorizontal: 5,
    borderRadius: 20,
  },
});
