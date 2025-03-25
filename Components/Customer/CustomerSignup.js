import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {RadioButton, TextInput, Button, Menu} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, {Marker} from 'react-native-maps';
import {SelectList} from 'react-native-dropdown-select-list';

const CustomerSignup = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_no, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const [cnic, setCnic] = useState('');
  const [profile_picture, setProfilePicture] = useState(null);
  const [address_type, setAddressType] = useState('Home'); // New field
  const [visible, setVisible] = useState(false);

  const addressOptions = [
    {key: 'Home', value: 'Home'},
    {key: 'Business', value: 'Business'},
  ];
  const pickImage = () => {
    ImagePicker.launchCamera({mediaType: 'photo'}, resp => {
      if (resp.didCancel) {
        console.log('User canceled image selection');
      } else if (resp.assets && resp.assets[0]) {
        setProfilePicture(resp.assets[0].uri);
      } else {
        console.error('Error picking image:', resp.errorMessage);
      }
    });
  };

  const [region, setRegion] = useState({
    latitude: 33.6433,
    longitude: 73.0790,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [address, setAddress] = useState({
    street: '',
    city: '',
    zip_code: '',
    country: '',
    latitude: region.latitude,
    longitude: region.longitude,
  });

  const handleRegionChange = newRegion => {
    setRegion(newRegion);
    setAddress(prev => ({
      ...prev,
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    }));
  };

  const handleSaveLocation = () => {
    setVisible(false);
  };

  const handleSignup = async () => {
    // Input Validation
    if (
      !name ||
      !email ||
      !phone_no ||
      !password ||
      !cpassword ||
      !cnic 
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (password !== cpassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone_no', phone_no);
      formData.append('password', password);
      formData.append('cnic', cnic);
      formData.append('address_type', address_type);
      formData.append('street', address.street);
      formData.append('city', address.city);
      formData.append('zip_code', address.zip_code);
      formData.append('country', address.country);
      formData.append('latitude', region.latitude);
      formData.append('longitude', region.longitude);

      if (profile_picture) {
        formData.append('profile_picture', {
          uri: profile_picture,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
      }

      const response = await fetch(`${url}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'signed up successfully!');
        navigation.navigate('Login'); // Redirect to Login or Dashboard
      } else {
        Alert.alert('Error', data.message || 'Signup failed!');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title,{color:'#F8544B',}]}>Customer Signup</Text>

      {/* Upload Image Section */}
      <Pressable onPress={pickImage} style={styles.profileImage}>
        {profile_picture ? (
          <Image source={{uri: profile_picture}} style={styles.image} />
        ) : (
          <View style={styles.uploadIconContainer}>
            <Icon name="cloud-upload" size={40} color="gray" />
            <Text style={styles.uploadText}>Upload Image</Text>
          </View>
        )}
      </Pressable>

      {/* Input Fields */}
      <TextInput
        mode="outlined"
        label="Name"
        style={styles.input}
        onChangeText={setName}
      />
      <TextInput
        mode="outlined"
        label="Email"
        style={styles.input}
        onChangeText={setEmail}
      />
      <TextInput
        mode="outlined"
        label="Phone No"
        style={styles.input}
        onChangeText={setPhoneNo}
      />
      <TextInput
        mode="outlined"
        label="CNIC No"
        style={styles.input}
        onChangeText={setCnic}
      />

      {/* Address Type Dropdown */}
      <View style={styles.dropdown}>
        <SelectList
          boxStyles={{paddingHorizontal: 20, }}
          inputStyles={{color:'black'}}
          dropdownTextStyles={{color:'black'}}
          placeholder="Select Address Type"
          save="key"
          setSelected={setAddressType}
          data={addressOptions}
        />
      </View>

      {/* Address Picker */}
      <Pressable onPress={() => setVisible(true)} style={styles.locationBox}>
        <View style={styles.uploadLocationContainer}>
          <Text style={[styles.uploadText, {fontSize: 15,alignSelf:'flex-start',marginRight:170}]}>Add Address</Text>
          <Icon name="location-on" size={30} color="red" />
        </View>
      </Pressable>

      {/* ZIP Code */}
      <TextInput
        mode="outlined"
        label="ZIP Code"
        style={styles.input}
        onChangeText={text => setAddress(prev => ({...prev, zip_code: text}))}
      />

      <TextInput
        mode="outlined"
        label="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />
      <TextInput
        mode="outlined"
        label="Confirm Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setcPassword}
      />

    

      {/* Signup Button */}
      <Button
        mode="contained"
        onPress={handleSignup}
        style={{backgroundColor: '#F8544B',
          alignSelf: 'center',
          borderRadius: 10,
          marginTop: 10,
          marginLeft: 10,
          marginRight: 0,
          width: 150,}}>
        Sign Up
      </Button>

      {/* Location Picker Modal */}
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Location</Text>
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={handleRegionChange}>
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
              />
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
              <Button
                mode="contained"
                onPress={handleSaveLocation}
                style={[styles.button,{backgroundColor:'#F8544B'}]}>
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={() => setVisible(false)}
                style={styles.button}>
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CustomerSignup;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileImage: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  uploadIconContainer: {
    alignItems: 'center',
  },
  uploadText: {
    color: 'gray',
    fontSize: 14,
    marginTop: 5,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  dropdown: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  locationBox: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    alignItems: 'center',
  },
  uploadLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorTypeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radioButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  signupButton: {
    marginTop: 10,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  map: {
    width: '100%',
    height: 250,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
  },
});
