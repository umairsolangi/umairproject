import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Modal,
  Text,
  ActivityIndicator
} from 'react-native';
import {RadioButton, TextInput, Button, Menu, } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, {Marker} from 'react-native-maps';
import {SelectList} from 'react-native-dropdown-select-list';

import * as ImagePicker from 'react-native-image-picker';
import AddnewAddress from '../CommonComponents/Addaddress';

const UserSignup = ({navigation, route}) => {
  const {role} = route.params;
const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_no, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');
  const [cnic, setCnic] = useState('');
  const [profile_picture, setProfilePicture] = useState(null);
  const [vendor_type, setVendorType] = useState('In-App Vendor');

  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [address, setAddress] = useState({
    street: '',
    city: '',
    zip_code: '',
    country: '',
    address_type: 'Home',
    latitude: '',
    longitude: '',
  });

  const handleRegionChange = newRegion => {
    setAddress(newRegion);
    console.log(newRegion);
    setVisible(false);
  };

  const handleImageSelection = async type => {
    const options = {mediaType: 'photo', quality: 1};
    let result;

    if (type === 'camera') {
      result = await ImagePicker.launchCamera(options);
    } else {
      result = await ImagePicker.launchImageLibrary(options);
    }

    if (!result.didCancel && result.assets?.length > 0) {
      setProfilePicture(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  const handleSubmit = async (role) => {
    if (!name || !email || !phone_no || !password || !cpassword || !cnic) {
      setErrorMessage('Please fill in all required fields.');
      setErrorModalVisible(true);
      return;
    }
  
    if (password !== cpassword) {
      setErrorMessage('Passwords do not match.');
      setErrorModalVisible(true);
      return;
    }
      setLoading(true); 

  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone_no', phone_no);
    formData.append('password', password);
    formData.append('cnic', cnic);
    formData.append('address_type', address.address_type);
    formData.append('street', address.street);
    formData.append('city', address.city);
    formData.append('zip_code', address.zip_code);
    formData.append('country', address.country);
    formData.append('latitude',address.latitude);
    formData.append('longitude',address.longitude);
  
    if (profile_picture) {
      formData.append('profile_picture', {
        uri: profile_picture,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    }
  
    if (role === 'Vendor') {
      formData.append('vendor_type', vendor_type);
    }
  
    let endpoint = '';
    if (role === 'Vendor') {
      endpoint = `${url}/vendor/signup`;
    } else if (role === 'Customer') {
      endpoint = `${url}/signup`;
    } else if (role === 'Organization') {
      endpoint = `${url}/organization/signup`;
    }
  
    try {
      console.log('URL',endpoint)
      console.log('Data',formData)

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        setErrorMessage('Signed up successfully!');
        setErrorModalVisible(true);
        setTimeout(() => {
          setErrorModalVisible(false);
          navigation.navigate('Login');
        }, 1500);
      } else {
        const allErrors = Object.values(result.errors)
        .map((errorArr) => errorArr[0]) 
        .join('\n');
    
      console.log('Validation Errors:', allErrors);
        setErrorMessage(
          allErrors
        );
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('Signup failed! Please try again later.');
      setErrorModalVisible(true);
    }
    finally {
    setLoading(false); 
  }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={styles.profileImage}>
        {profile_picture ? (
          <Image source={{uri: profile_picture}} style={styles.image} />
        ) : (
          <View style={styles.uploadIconContainer}>
            <Icon name="cloud-upload" size={40} color="gray" />
            <Text style={styles.uploadText}>Upload Image</Text>
          </View>
        )}
      </Pressable>

      <TextInput
        mode="outlined"
        activeOutlineColor="black"
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        activeOutlineColor="black"
        label="Email"
        placeholder="Email Must be Valid"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        activeOutlineColor="black"
        label="Phone No"
        placeholder="Phone No Must be 11 Digit"
        value={phone_no}
        keyboardType="phone-pad"
        onChangeText={setPhoneNo}
        style={styles.input}
      />

      <TextInput
        mode="outlined"
        activeOutlineColor="black"
        label="CNIC"
        placeholder="Enter Valid CNIC & Must be 13 Digit"
        value={cnic}
        onChangeText={setCnic}
        style={styles.input}
      />
      <Pressable onPress={() => setVisible(true)} style={styles.locationBox}>
        <View style={styles.uploadLocationContainer}>
          {address.street === '' ? (
            <>
              <Text
                style={[
                  styles.uploadText,
                  {fontSize: 15, alignSelf: 'flex-start', marginRight: 170},
                ]}>
                Add Address
              </Text>
              <Icon name="location-on" size={30} color="red" />
            </>
          ) : (
            <Text
              style={[
                styles.uploadText,
                {fontSize: 17, alignSelf: 'flex-start', color: 'black'},
              ]}>
              {` ${address.street}, ${address.city},${address.country}`}
            </Text>
          )}
        </View>
      </Pressable>
      <TextInput
        mode="outlined"
        activeOutlineColor="black"
        placeholder="Enter Password"
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        activeOutlineColor="black"
        label="Confirm Password"
        placeholder="Enter Comfirm Password"
        value={cpassword}
        onChangeText={setcPassword}
        style={styles.input}
      />
      {role === 'Vendor' && (
        <>
          {/* Vendor Type Selection */}
          <Text style={styles.vendorTypeText}>Vendor Type</Text>
          <View style={styles.radioContainer}>
            <View style={styles.radioButtonWrapper}>
              <RadioButton
                value="In-App Vendor"
                status={
                  vendor_type === 'In-App Vendor' ? 'checked' : 'unchecked'
                }
                onPress={() => setVendorType('In-App Vendor')}
                color="#F8544B"
              />
              <Text style={{color: 'black'}}>In-App Vendor</Text>
            </View>
            <View style={styles.radioButtonWrapper}>
              <RadioButton
                value="API Vendor"
                status={vendor_type === 'API Vendor' ? 'checked' : 'unchecked'}
                onPress={() => setVendorType('API Vendor')}
                color="#F8544B"
              />
              <Text style={{color: 'black'}}>API Vendor</Text>
            </View>
          </View>
        </>
      )}

      <Button
        mode="contained"
        onPress={() => handleSubmit(role)}
        style={styles.submitBtn}>
        Signup
      </Button>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Already have an account?</Text>
        <Button
          onPress={() => navigation.navigate('Login')}
          textColor="#F8544B"
          style={{marginLeft: -10}}>
          Login
        </Button>
      </View>
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setModalVisible(false)}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>
              Select Image
            </Text>

            <Button
              mode="contained"
              icon="camera"
              onPress={() => handleImageSelection('camera')}
              style={{width: '70%', marginBottom: 10}}>
              Take Photo
            </Button>

            <Button
              mode="contained"
              icon="image"
              onPress={() => handleImageSelection('gallery')}
              style={{width: '70%', marginBottom: 10}}>
              Choose from Gallery
            </Button>

            <Button mode="text" onPress={() => setModalVisible(false)}>
              Cancel
            </Button>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={visible} animationType="slide" transparent>
        <AddnewAddress AddLocation={handleRegionChange} addressobj={address} />
      </Modal>
      <Modal
        transparent
        visible={errorModalVisible}
        animationType="slide"
        onRequestClose={() => setErrorModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 20,
              alignItems: 'center',
            }}>
            
            <Text
              style={{
                fontSize: 16,
                marginTop: 10,
                textAlign: 'center',
                color: 'black',
              }}>
              {errorMessage}
            </Text>

            <Button
              mode="contained"
              onPress={() => setErrorModalVisible(false)}
              style={{marginTop: 20, backgroundColor: '#F8544B'}}>
              OK
            </Button>
          </View>
        </View>
      </Modal>
      {loading && (
  <View
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)',
      zIndex: 10,
    }}>
    <View
      style={{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
      }}>
      <Text style={{marginBottom: 10, fontWeight: 'bold',color:'black'}}>Submitting...</Text>
      <ActivityIndicator size="large" color="#F8544B" />
    </View>
  </View>
)}
    </ScrollView>
  );
};

export default UserSignup;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
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
  uploadBtn: {
    color: '#2196F3',
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 8,
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: '#F8544B',
    borderRadius: 10,
  },
  locationBox: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
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
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    color: 'black',
  },
});
