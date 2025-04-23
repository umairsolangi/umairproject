import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import MapView, {Marker} from 'react-native-maps';
import {Button, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomerAddnewAddress = ({navigation, route}) => {
  const cutomerdata = route.params.cutomerdata;

  const [region, setRegion] = useState({
    latitude: 33.6844, // Default location (Karachi)
    longitude: 73.0479,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [address, setAddress] = useState({
    street: '',
    city: '',
    zip_code: '',
    country: '',
    address_type: 'Home',
  });

  const addressTypes = ['Home', 'Work', 'Other'];

  const handleMapPress = e => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setRegion({...region, latitude, longitude});
  };

  const handleSaveAddress = async () => {
    if (!address.street || !address.city) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      const shopData = {
        ...address,
        latitude: region.latitude,
        longitude: region.longitude,
      };

      const response = await fetch(
        `${url}/customers/${cutomerdata.id}/add-address`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(shopData),
        },
      );

      if (response.ok) {
        alert('Address saved successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to saved Address');
      }
    } catch (error) {
      console.error('Error to saved Address:', error);
      Alert.alert('Error', 'Failed to saved Address');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onPress={handleMapPress}>
        <Marker
          coordinate={{latitude: region.latitude, longitude: region.longitude}}
          draggable
        />
      </MapView>

      {/* Address Details */}
      <View style={styles.form}>
        <TextInput
          label="Street"
          mode="outlined"
          style={styles.input}
          value={address.street}
          onChangeText={text => setAddress({...address, street: text})}
        />
        <View style={styles.row}>
          <TextInput
            label="City"
            mode="outlined"
            style={[styles.input, styles.halfInput]}
            value={address.city}
            onChangeText={text => setAddress({...address, city: text})}
          />
          <TextInput
            label="Post Code"
            mode="outlined"
            style={[styles.input, styles.halfInput]}
            value={address.zip_code}
            onChangeText={text => setAddress({...address, zip_code: text})}
          />
        </View>
        <TextInput
          label="Country"
          mode="outlined"
          style={styles.input}
          value={address.country}
          onChangeText={text => setAddress({...address, country: text})}
        />

        {/* Address Type Buttons */}
        <View style={styles.labelContainer}>
          {addressTypes.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.labelButton,
                address.address_type === type && styles.activeLabel,
              ]}
              onPress={() => setAddress({...address, address_type: type})}>
              <Text
                style={[
                  styles.labelText,
                  address.address_type === type && styles.activeLabelText,
                ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSaveAddress}
          style={styles.saveButton}>
          Save location
        </Button>
      </View>
    </ScrollView>
  );
};

export default CustomerAddnewAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0,
    color: '#F8544B',
  },
  map: {
    width: '100%',
    height: 299,
    marginTop: 0,
  },
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  labelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F8544B',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeLabel: {
    backgroundColor: '#F8544B',
  },
  labelText: {
    fontSize: 16,
    color: '#F8544B',
  },
  activeLabelText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#F8544B',
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'flex-end',
  },
});
