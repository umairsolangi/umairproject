import React, { useEffect, useState } from 'react';
import { View, PermissionsAndroid, Platform, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';
import { ActivityIndicator } from 'react-native-paper';

const ratePerKm = 20;

const RiderViewOrderOnMap = ({ route }) => {
  const { order } = route.params;
  const [riderLocation, setRiderLocation] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({ km: '0', charges: '0' });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (riderLocation) {
      calculateDistanceAndCharges();
      console.log('rider location',riderLocation)
    }
  }, [riderLocation]);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        const fine = granted['android.permission.ACCESS_FINE_LOCATION'];
        const coarse = granted['android.permission.ACCESS_COARSE_LOCATION'];

        if (fine === 'granted' || coarse === 'granted') {
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
        setRiderLocation({ latitude: 33.6844, longitude: 73.0479 });
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 10000,
        distanceFilter: 10,
      }
    );
  };

  const pickup = order?.shop?.branch?.pickup_location;
  const delivery = order?.customer?.delivery_address;

  const pickupCoords = {
    latitude: parseFloat(pickup?.latitude),
    longitude: parseFloat(pickup?.longitude),
  };

  const deliveryCoords = {
    latitude: parseFloat(delivery?.latitude),
    longitude: parseFloat(delivery?.longitude),
  };

  const calculateDistanceAndCharges = () => {
    if (pickupCoords.latitude && deliveryCoords.latitude) {
      const meters = getDistance(pickupCoords, deliveryCoords);
      const km = meters / 1000;
      const charges = km * ratePerKm;
      setDeliveryInfo({
        km: km.toFixed(2),
        charges: charges.toFixed(0),
      });
    }
  };

  if (!riderLocation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#F8544B" />
        <Text style={{ marginTop: 10, fontWeight: 'bold' ,color:"black"}}>
          Fetching location...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: riderLocation.latitude,
          longitude: riderLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Rider Marker */}
        <Marker
          coordinate={riderLocation}
          pinColor="blue"
          title="Your Location"
        />

        {/* Pickup Marker */}
        <Marker
          coordinate={pickupCoords}
          title={`${order.shop.name} - ${order.shop.branch.name}`}
          description="Pickup Location"
          pinColor="red"
        />

        {/* Delivery Marker */}
        <Marker
          coordinate={deliveryCoords}
          title="Customer"
          description="Delivery Location"
          pinColor="green"
        />

        {/* Route Polyline */}
        <Polyline
          coordinates={[pickupCoords, deliveryCoords]}
          strokeColor="#F8544B"
          strokeWidth={4}
        />
      </MapView>

      {/* Bottom Info Panel */}
      <View
        style={{
          position: 'absolute',
          bottom: 15,
          left: 15,
          right: 15,
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 5,
          elevation: 4,
        }}
      >
        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>
          Distance: {deliveryInfo.km} km
        </Text>
        <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>
          Delivery Charges: Rs {deliveryInfo.charges}
        </Text>
      </View>
    </View>
  );
};

export default RiderViewOrderOnMap;
