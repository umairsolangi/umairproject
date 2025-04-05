import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {Text, Button, TextInput} from 'react-native-paper';

const LocationPicker = () => {
  const [region, setRegion] = useState({
    latitude: 33.647549,
    longitude: 73.074145,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [address, setAddress] = useState({
    street: '',
    city: '',
    country: '',
  });

  // Function to handle user selecting a location on the map
  const handleMapPress = async (event) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    
    setRegion({...region, latitude, longitude});
    
    // Reverse Geocode to get address details
    fetchAddressFromCoordinates(latitude, longitude);
  };

  // Reverse Geocoding Function (Uses OpenStreetMap API)
  const fetchAddressFromCoordinates = async (lat, lon) => {
    try {
      let response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      let data = await response.json();

      if (data.address) {
        setAddress({
          street: data.address.road || '',
          city: data.address.city || data.address.town || '',
          country: data.address.country || '',
        });
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  // Function to save selected location
  const handleSaveLocation = () => {
  const location={
      latitude: region.latitude,
      longitude: region.longitude,
      street: address.street,
      city: address.city,
      country: address.country,
    };

    console.log('User Location', location)
  };

  return (
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select Location</Text>
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
      >
        <Marker coordinate={{latitude: region.latitude, longitude: region.longitude}} />
      </MapView>

      <TextInput
        label="Street"
        value={address.street}
        onChangeText={text => setAddress({...address, street: text})}
        style={styles.input}
      />
      <TextInput
        label="City"
        value={address.city}
        onChangeText={text => setAddress({...address, city: text})}
        style={styles.input}
      />
      <TextInput
        label="Country"
        value={address.country}
        onChangeText={text => setAddress({...address, country: text})}
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <Button mode="contained" onPress={handleSaveLocation} style={[styles.button, {backgroundColor: '#F8544B'}]}>
          Save
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: { padding: 20, backgroundColor: 'white', borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  map: { width: '100%', height: 300 },
  input: { marginTop: 10, backgroundColor: 'white' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  button: { flex: 1, marginHorizontal: 5 },
});

export default LocationPicker;
