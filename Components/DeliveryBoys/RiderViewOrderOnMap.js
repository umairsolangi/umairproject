import React, {useEffect, useState} from 'react';
import {View, PermissionsAndroid, Platform, Text} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {getDistance} from 'geolib';
import {ActivityIndicator} from 'react-native-paper';

const ratePerKm = 20;

const RiderViewOrderOnMap = ({route}) => {
  const {order} = route.params;
  const [riderLocation, setRiderLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const [deliveryInfo, setDeliveryInfo] = useState({km: '0', charges: '0'});
  const [riderTrail, setRiderTrail] = useState([]);
  const [latestLocation, setLatestLocation] = useState(null);

  useEffect(() => {
    fetchOrdersLiveStatus();
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (riderLocation) {
      calculateDistanceAndCharges();
    }
  }, [riderLocation]);
  const fetchOrdersLiveStatus = async () => {
    try {
      const locationRes = await fetch(
        `${url}/suborders/${order.suborder_id}/live-tracking`,
      );
      const locationData = await locationRes.json();

      const routeRes = await fetch(
        `${url}/suborders/${order.suborder_id}/route-info`,
      );
      const routeData = await routeRes.json();

      if (
        locationData?.data &&
        Array.isArray(locationData.data) &&
        locationData.data.length > 0
      ) {
        const trail = locationData.data.map(loc => ({
          latitude: parseFloat(loc.latitude),
          longitude: parseFloat(loc.longitude),
        }));

        console.log('rider trail', trail);
        setRiderTrail(trail);
        setLatestLocation(trail[trail.length - 1] || null);
      } else {
        console.warn('No location data available for this suborder.');
      }
    } catch (error) {
      console.error('Error fetching tracking info:', error);
    } finally {
      setLoading(false);
    }
  };

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
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Permission error:', error.message);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        if (riderTrail && riderTrail.length > 0) {
          const lastPoint = riderTrail[riderTrail.length - 1];
          setRiderLocation({
            latitude: lastPoint.latitude,
            longitude: lastPoint.longitude,
          });
        } else {
          setRiderLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }
      },
      error => {
        console.log('Location error:', error.message);
        setRiderLocation({latitude: 33.6844, longitude: 73.0479});
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 10000,
        distanceFilter: 10,
      },
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

  const handleMapPress = async e => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    const coords = {
      latitude: latitude,
      longitude: longitude,
    };
    setRiderLocation(coords);
    setRiderTrail(pre => [...pre, coords]);
    console.log('curren Postion', latitude, longitude);
    if (
      order.status == 'assigned' ||
      order.status == 'picked_up' ||
      order.status == 'handover_confirmed'
    ) {
      try {
        const response = await fetch(
          `${url}/deliveryboy/order/${order.suborder_id}/location`,
          {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(coords),
          },
        );

        if (!response.ok) {
          console.log('Failed to update location:', response.statusText);
        }
      } catch (error) {
        console.log('Live tracking error:', error.message);
      }
    }
  };

  if (!riderLocation) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#F8544B" />
        <Text style={{marginTop: 10, fontWeight: 'bold', color: 'black'}}>
          Fetching location...
        </Text>
      </View>
    );
  }
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#FF5C5C" />
      </View>
    );
  }
  return (
    <View style={{flex: 1}}>
      <MapView
        onPress={handleMapPress}
        style={{flex: 1}}
        initialRegion={{
          latitude: riderLocation.latitude,
          longitude: riderLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        <Marker
          coordinate={riderLocation}
          pinColor="blue"
          title="Your Location"
          image={require('../../Assets/Images/ridericon.png')}
        />

        <Marker
          coordinate={pickupCoords}
          title={`${order.shop.name} - ${order.shop.branch.name}`}
          description="Pickup Location"
          pinColor="red"
        />

        <Marker
          coordinate={deliveryCoords}
          title="Customer"
          description="Delivery Location"
          pinColor="green"
        />
        {riderTrail.length > 1 && (
          <Polyline
            coordinates={riderTrail}
            strokeColor="#0000FF" // You can change this to match your theme
            strokeWidth={4}
          />
        )}
      </MapView>

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
          shadowOffset: {width: 0, height: 2},
          shadowRadius: 5,
          elevation: 4,
        }}>
        <Text style={{fontWeight: 'bold', color: 'black', fontSize: 16}}>
          Distance: {deliveryInfo.km} km
        </Text>
        <Text style={{fontWeight: 'bold', color: 'black', fontSize: 16}}>
          Delivery Charges: Rs {deliveryInfo.charges}
        </Text>
      </View>
    </View>
  );
};

export default RiderViewOrderOnMap;
