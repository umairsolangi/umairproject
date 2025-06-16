import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

const CustomerTrackOrderMap = ({route}) => {
  const {order} = route.params;
  const [loading, setLoading] = useState(true);
  const [riderTrail, setRiderTrail] = useState([]);
  const [latestLocation, setLatestLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);


 useEffect(() => {
  fetchOrdersLiveStatus();

  const interval = setInterval(() => {
    fetchOrdersLiveStatus();
  }, 5000);

  return () => clearInterval(interval);
}, []);

  const fetchOrdersLiveStatus = async () => {
    try {
      const locationRes = await fetch(
        `${url}/suborders/${order.suborder_id}/live-tracking`
      );
      const locationData = await locationRes.json();

      const routeRes = await fetch(
        `${url}/suborders/${order.suborder_id}/route-info`
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

        setRiderTrail(trail);
        setLatestLocation(trail[trail.length - 1] || null);
      } else {
        console.warn('No location data available for this suborder.');
      }

      if (routeData?.data) {
        setDropLocation(routeData.data);
      }
    } catch (error) {
      console.error('Error fetching tracking info:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickupCoords = dropLocation?.pickup_location
    ? {
        latitude: parseFloat(dropLocation.pickup_location.latitude),
        longitude: parseFloat(dropLocation.pickup_location.longitude),
      }
    : null;

  const deliveryCoords = dropLocation?.drop_location
    ? {
        latitude: parseFloat(dropLocation.drop_location.latitude),
        longitude: parseFloat(dropLocation.drop_location.longitude),
      }
    : null;

  if (loading || !latestLocation) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading Map...</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <MapView
        style={{flex: 1}}
        initialRegion={{
          ...latestLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        region={{
          ...latestLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {/* Rider's Latest Location Marker */}
        <Marker
          coordinate={latestLocation}
          title="Rider"
          description="Live Location"
          image={require('../../Assets/Images/ridericon.png')}
        />

        {/* Pickup Marker */}
        {pickupCoords && (
          <Marker
            coordinate={pickupCoords}
            title="Vendor Location"
            description="Pickup Location"
            pinColor="red"
          />
        )}

        {/* Delivery Marker */}
        {deliveryCoords && (
          <Marker
            coordinate={deliveryCoords}
            title="Customer"
            description="Delivery Location"
            pinColor="green"
          />
        )}

        {/* Rider's Trail Polyline */}
        {riderTrail.length > 1 && (
          <Polyline coordinates={riderTrail} strokeColor="red" strokeWidth={4} />
        )}
      </MapView>

      {/* Rider Info Panel */}
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
          Rider Latest Location:
        </Text>
        <Text style={{color: 'black'}}>
          Latitude: {latestLocation?.latitude ?? 'N/A'}
        </Text>
        <Text style={{color: 'black'}}>
          Longitude: {latestLocation?.longitude ?? 'N/A'}
        </Text>
      </View>
    </View>
  );
};

export default CustomerTrackOrderMap;
