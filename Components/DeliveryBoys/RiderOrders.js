import React, {useState, useEffect} from 'react';
import {View, PermissionsAndroid, Platform} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import {ActivityIndicator} from 'react-native-paper';

const GOOGLE_MAPS_APIKEY = 'AIzaSyCdmIHvKSHu-vKEeN0hcvjQrOtr8row6qE';

const RiderOrders = ({route}) => {
  const {pickeduporders} = route.params;
  const [riderLocation, setRiderLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);



  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            position => {
              setRiderLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            error => {
              console.log('Location error:', error.message);
            },
            {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
          );
        } else {
          console.log('Location permission denied');
        }
      }
    } catch (error) {
      console.error('Error requesting location permission:', error.message);
    }
  };

  return (
    <View style={{flex: 1}}>
      <MapView
        style={{flex: 1}}
        initialRegion={{
          latitude: riderLocation?.latitude || 33.6844,
          longitude: riderLocation?.longitude || 73.0479,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}>
        {/* Rider marker */}
        {riderLocation && (
          <Marker
            coordinate={riderLocation}
            pinColor="blue"
            title="Your Location"
          />
        )}

        {/* Picked Orders - Route from Rider → Restaurant → Customer */}
        {pickeduporders.map((order, index) => {
          const pickup = order?.shop?.branch?.pickup_location;
          const delivery = order?.customer?.delivery_address;

          if (!pickup || !delivery) return null;

          const pickupLat = parseFloat(pickup.latitude);
          const pickupLng = parseFloat(pickup.longitude);
          const deliveryLat = parseFloat(delivery.latitude);
          const deliveryLng = parseFloat(delivery.longitude);

          return (
            <React.Fragment key={index}>
              {/* Pickup Location Marker */}
              <Marker
                coordinate={{latitude: pickupLat, longitude: pickupLng}}
                title={`${order.shop.name} - ${order.shop.branch.name}`}
                description="Pickup Location"
              />

              {/* Delivery Location Marker */}
              <Marker
                coordinate={{latitude: deliveryLat, longitude: deliveryLng}}
                title="Customer"
                description="Delivery Location"
              />

              {/* Route: Rider → Pickup */}
              {riderLocation && (
                <MapViewDirections
                  origin={riderLocation}
                  destination={{latitude: pickupLat, longitude: pickupLng}}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={4}
                  strokeColor="blue"
                />
              )}

              {/* Route: Pickup → Delivery */}
              <MapViewDirections
                origin={{latitude: pickupLat, longitude: pickupLng}}
                destination={{latitude: deliveryLat, longitude: deliveryLng}}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={4}
                strokeColor="green"
              />
            </React.Fragment>
          );
        })}
      </MapView>
    </View>
  );
};

export default RiderOrders;
