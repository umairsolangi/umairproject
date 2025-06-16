import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Card} from 'react-native-paper';
import {getDistance} from 'geolib';
import {Image} from 'react-native-reanimated/lib/typescript/Animated';

const RiderDashboard = ({navigation, route}) => {
  const {Userdetails} = route.params;

  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [riderLocation, setRiderLocation] = useState(null);

  const ratePerKm = 20;

  useEffect(() => {
    requestLocationPermission();
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    fetch(`${url}/deliveryboy/ready-suborders/${Userdetails.lmd_id}`)
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setOrders(json.data);
          console.log('Succefull ready order');
        }
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Failed to load orders');
      });
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        if (
          granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted' ||
          granted['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
        ) {
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        getCurrentLocation(); // iOS
      }
    } catch (error) {
      console.error('Permission error:', error.message);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setRiderLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log('Location error:', error.message);
        // fallback location
        setRiderLocation({latitude: 33.6433, longitude: 73.0790});
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 10000,
      },
    );
  };

  const groupByBranch = ordersList => {
    const grouped = {};
    ordersList.forEach(order => {
      const branchId = String(order.shop.branch_ID || order.branch_ID);
      if (!grouped[branchId]) {
        grouped[branchId] = [];
      }
      grouped[branchId].push(order);
    });
    return grouped;
  };

  const groupedOrders = groupByBranch(orders);

  const handleMarkerPress = branchId => {
    setSelectedOrders(groupedOrders[branchId]);
    setModalVisible(true);
  };

  const calculateCharges = (pickup, delivery) => {
    const distance = getDistance(
      {
        latitude: parseFloat(pickup.latitude),
        longitude: parseFloat(pickup.longitude),
      },
      {
        latitude: parseFloat(delivery.latitude),
        longitude: parseFloat(delivery.longitude),
      },
    );
    const km = distance / 1000;
    return {km: km.toFixed(2), charges: (km * ratePerKm).toFixed(0)};
  };

  const handleAcceptOrder = async order => {
     try {
          const response = await fetch(
            `${url}/deliveryboy/${Userdetails.delivery_boy_id}/accept-order/${order.suborder_id}`,
            {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
            },
          );
    
          if (response.ok) {
            Alert.alert('Success', 'Order Accepted successfully');
            navigation.navigate('Rider Orders',{Userdetails})
          }
        } catch (error) {
          console.error('Error :', error);
          Alert.alert('Error', 'Failed');
        }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <MapView
        style={{flex: 1}}
        initialRegion={{
          latitude: riderLocation?.latitude || 33.7,
          longitude: riderLocation?.longitude || 73.06,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
        followsUserLocation={true}>
        {/* Rider's Location */}
        {riderLocation && (
          <Marker
            coordinate={riderLocation}
            title="You"
            description="Your current location"
            pinColor="blue"
          />
        )}

        {/* Restaurant Markers */}
        {Object.keys(groupedOrders).map(branchId => {
          const branchOrders = groupedOrders[branchId];
          const shopName = branchOrders[0].shop.name;
          const branchName = branchOrders[0].shop.branch.name;
          const pickup = branchOrders[0].shop.branch.pickup_location;

          return (
            <Marker
              key={branchId}
              coordinate={{
                latitude: parseFloat(pickup.latitude),
                longitude: parseFloat(pickup.longitude),
              }}
              onPress={() => handleMarkerPress(branchId)}>
              <View style={{alignItems: 'center'}}>
                <View
                  style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    marginBottom: 5,
                    alignItems: 'center',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowOffset: {width: 0, height: 2},
                  }}>
                  <Text
                    style={{fontSize: 12, fontWeight: 'bold', color: '#000'}}>
                    {shopName}
                  </Text>
                  <Text style={{fontSize: 10, color: '#555'}}>
                    {branchOrders.length} Orders
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={30}
                  color="#F8544B"
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: 'bold',
                alignSelf: 'center',
                marginBottom: 20,
              }}>
              Ready Orders
            </Text>

            <ScrollView>
              {selectedOrders.map(order => {
                const pickup = order.shop.branch.pickup_location;
                const delivery = order.customer.delivery_address;
                const {km, charges} = calculateCharges(pickup, delivery);

                return (
                  <Card key={order.suborder_id} style={styles.card}>
                    <View style={styles.row}>
                      <View style={styles.iconCol}>
                        <MaterialCommunityIcons
                          name="map-marker"
                          size={30}
                          color="#F8544B"
                        />
                        <Text style={styles.label}>Pickup</Text>
                      </View>
                      <View style={styles.infoCol}>
                        <Text style={styles.orderId}>
                          Order ID: {order.suborder_id}
                        </Text>
                        <Text style={styles.shop}>{order.shop.name}</Text>
                        <Text style={styles.city}>
                          {order.shop.branch.name}, {pickup.city}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.row}>
                      <View style={styles.iconCol}>
                        <MaterialCommunityIcons
                          name="map-marker"
                          size={30}
                          color="#4CAF50"
                        />
                        <Text style={styles.label}>Deliver</Text>
                      </View>
                      <View style={styles.infoCol}>
                        <Text style={styles.bold}>{order.customer.name}</Text>
                        <Text style={styles.phone}>{order.customer.phone}</Text>
                        <Text style={styles.city}>
                          {delivery.street}, {delivery.city}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.detail}>
                      Delivery Distance:{' '}
                      <Text style={styles.bold}>{km} km</Text>
                      {'\n'}
                      Delivery Charges:{' '}
                      <Text style={styles.bold}>Rs {charges}</Text>
                    </Text>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleAcceptOrder(order)}>
                      <Text style={styles.buttonText}>Accept Order</Text>
                    </TouchableOpacity>
                  </Card>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    maxHeight: '100%',
    width: '100%',
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    maxHeight: '100%',
    width: '100%',
  },
  card: {
    backgroundColor: '#faebeb',
    marginBottom: 12,
    borderRadius: 12,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCol: {
    alignItems: 'center',
    width: 60,
  },
  infoCol: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  shop: {
    fontSize: 14,
    color: '#F8544B',
    fontWeight: 'bold',
  },
  city: {
    color: '#555',
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
    color: 'black',
  },
  phone: {
    fontSize: 12,
    color: '#555',
  },
  detail: {
    color: '#444',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#F8544B',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 12,
    alignItems: 'center',
    color: 'blue',
    backgroundColor: '#ebeced',
    borderRadius: 10,
    marginTop: 10,
  },
  closeText: {
    color: 'black',
  },
});

export default RiderDashboard;
