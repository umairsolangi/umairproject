import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import {TextInput, Button, Text, HelperText} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView, {Marker} from 'react-native-maps';
import {SelectList} from 'react-native-dropdown-select-list';

import * as ImagePicker from 'react-native-image-picker';
import AddnewAddress from '../CommonComponents/Addaddress';

const OrganizationAddDeliverBoy = ({navigation, route}) => {
  const {organizationdetails}=route.params
  console.log(organizationdetails)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_no, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setcPassword] = useState('');

  const [cnic, setCnic] = useState('');
  const [license_no, setLicenseNo] = useState('');
  const [license_expiration_date, setLicenseExpirationDate] = useState('');
  const [profile_picture, setProfilePicture] = useState(null);
  const [license_front, setLicenseFront] = useState(null);
  const [license_back, setLicenseBack] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [summaryModalVisible, setSummaryVisible] = useState(false);

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

  const uploadLicencePic = async type => {
    const options = {mediaType: 'photo', quality: 1};
    let result = await ImagePicker.launchCamera(options);
    if (type === 'front') {
      if (!result.didCancel && result.assets?.length > 0) {
        setLicenseFront(result.assets[0].uri);
      }
    } else if (type === 'back') {
      if (!result.didCancel && result.assets?.length > 0) {
        setLicenseBack(result.assets[0].uri);
      }
    }
  };
  const validateAndShowSummary = () => {
    if (
      !name ||
      !email ||
      !phone_no ||
      !password ||
      !cpassword ||
      !cnic ||
      !license_no ||
      !profile_picture ||
      !license_front ||
      !license_back ||
      !address.street ||
      !address.city ||
      !address.address_type
    ) {
      setErrorMessage('Please fill all required fields and upload all images.');
      setErrorModalVisible(true);
      return;
    }

    if (password !== cpassword) {
      setErrorMessage('Passwords do not match.');
      setErrorModalVisible(true);
      return;
    }

    setSummaryVisible(true);
  };
  const handleSubmit = async () => {
    setSummaryVisible(false);

    const formData = new FormData();

    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone_no', phone_no);
    formData.append('password', password);
    formData.append('cnic', cnic);
    formData.append('license_no', license_no);
    formData.append('license_expiration_date', license_expiration_date || '');

    formData.append('address_type', address.address_type);
    formData.append('street', address.street);
    formData.append('city', address.city);
    formData.append('zip_code', address.zip_code || '');
    formData.append('country', address.country || '');
    formData.append('latitude', address.latitude);
    formData.append('longitude', address.longitude);
    formData.append('organization_id', organizationdetails.organization_id);
    if (profile_picture) {
      formData.append('profile_picture', {
        uri: profile_picture,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    }

    if (license_front) {
      formData.append('license_front', {
        uri: license_front,
        type: 'image/jpeg',
        name: 'license_front.jpg',
      });
    }

    if (license_back) {
      formData.append('license_back', {
        uri: license_back,
        type: 'image/jpeg',
        name: 'license_back.jpg',
      });
    }
    try {
      const response = await fetch(`${url}/deliveryboys/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        setErrorMessage('Data Submited successfully!');
        setErrorModalVisible(true);
        setName('');
        setEmail('');
        setPhoneNo('');
        setPassword('');
        setcPassword('');
        setCnic('');
        setLicenseNo('');
        setLicenseExpirationDate('');
        setProfilePicture(null);
        setLicenseFront(null);
        setLicenseBack(null);
      
        // Optionally close modals if needed
        setModalVisible(false);
        setVisible(false);
        setErrorModalVisible(false);
        setErrorMessage('');
        setSummaryVisible(false);
        setAddress({
          street: '',
          city: '',
          zip_code: '',
          country: '',
          address_type: 'Home',
          latitude: '',
          longitude: '',
        });
        setTimeout(() => {
          setErrorModalVisible(false);

        }, 1500);
      } else {
        const allErrors = Object.values(result.errors)
          .map(errorArr => errorArr[0]) 
          .join('\n');

        console.log('Validation Errors:', allErrors);
        setErrorMessage(allErrors);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('Signup failed! Please try again later.');
      setErrorModalVisible(true);
    }
    console.log('Dellivery Boy Data', formData);
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
        label="License No"
        value={license_no}
        placeholder="Enter Valid License No"
        onChangeText={setLicenseNo}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        activeOutlineColor="black"
        label="License Expiration Date"
        value={license_expiration_date}
        onChangeText={setLicenseExpirationDate}
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

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
      <Pressable
        onPress={() => uploadLicencePic('front')}
        style={styles.LiceneImage}>
        {license_front ? (
          <Image
            source={{uri: license_front}}
            style={styles.Liceneimagestyle}
          />
        ) : (
          <View style={styles.LicenceuploadIconContainer}>
            <Icon name="cloud-upload" size={40} color="gray" />
            <Text style={styles.uploadText}>Upload Licence Front</Text>
          </View>
        )}
      </Pressable>
      <Pressable
        onPress={() => uploadLicencePic('back')}
        style={styles.LiceneImage}>
        {license_back ? (
          <Image source={{uri: license_back}} style={styles.Liceneimagestyle} />
        ) : (
          <View style={styles.LicenceuploadIconContainer}>
            <Icon name="cloud-upload" size={40} color="gray" />
            <Text style={styles.uploadText}>Upload Licence Back</Text>
          </View>
        )}
      </Pressable>
      <Button
        mode="contained"
        onPress={validateAndShowSummary}
        style={styles.submitBtn}>
        Submit
      </Button>
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
      <Modal
        visible={summaryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSummaryModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
              elevation: 5,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 15,
                textAlign: 'center',
              }}>
              Confirm Delivery Boy Info
            </Text>

            <Text>Name: {name}</Text>
            <Text>Email: {email}</Text>
            <Text>Phone: {phone_no}</Text>
            <Text>CNIC: {cnic}</Text>
            <Text>License No: {license_no}</Text>
            <Text>License Expiry: {license_expiration_date || 'N/A'}</Text>
            <Text>
              Address: {address.street}, {address.city}
            </Text>
            <Text>
              Lat/Lng: {address.latitude}, {address.longitude}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
                <Button
              mode="text"
              onPress={() => setSummaryVisible(false)}
              style={{marginTop: 20,}}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit} 
              style={{marginTop: 20, backgroundColor: '#F8544B',alignSelf:'flex-end'}}>
              Confirm
            </Button>
              
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default OrganizationAddDeliverBoy;

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
  LicenceuploadIconContainer: {
    alignItems: 'center',
  },
  LiceneImage: {
    alignSelf: 'center',
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  Liceneimagestyle: {
    width: '100%',
    height: '100%',
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
});
