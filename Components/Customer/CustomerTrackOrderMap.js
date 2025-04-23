import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

const CustomerTrackOrderMap = ({route}) => {
  const {order} = route.params;
  const [loading, setLoading] = useState(true);
  const [riderTrail, setRiderTrail] = useState([]);
  const [latestLocation, setLatestLocation] = useState(null);

  useEffect(() => {
    fetchOrdersLiveStatus();
  }, []);

  const fetchOrdersLiveStatus = async () => {
    try {
      const locationRes = await fetch(`${url}/suborders/${order.suborder_id}/live-tracking`);
      const locationData = await locationRes.json();

      if (locationData && locationData.data && Array.isArray(locationData.data)) {
        const trail = locationData.data.map(loc => ({
          latitude: parseFloat(loc.latitude),
          longitude: parseFloat(loc.longitude),
        }));

        setRiderTrail(trail);
        setLatestLocation(trail[trail.length - 1]); // latest one
      } else {
        console.warn('Invalid tracking data format');
      }
    } catch (error) {
      console.error('Please Try Again:', error);
    } finally {
      setLoading(false);
    }
  };

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
        
        {/* Rider Marker at latest position */}
        <Marker
          coordinate={latestLocation}
          title="Rider"
          description="Live location"
          pinColor="red"
        />

        {/* Rider Trail Polyline */}
        <Polyline
          coordinates={riderTrail}
          strokeColor="red"
          strokeWidth={4}
        />
      </MapView>

      {/* Info Panel */}
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
        <Text style={{color:'black'}}>Latitude: {latestLocation.latitude}</Text>
        <Text style={{color:'black'}}>Longitude: {latestLocation.longitude}</Text>
      </View>
    </View>
  );
};

export default CustomerTrackOrderMap;
