import React, {useState} from 'react';
import {View, Text, Modal, Pressable, Image, Alert} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';

const VendorEditBranch = ({navigation, route}) => {
  const {branchData} = route.params;

  // Convert latitude & longitude to numbers
  const [latitude, setLatitude] = useState(parseFloat(branchData.latitude));
  const [longitude, setLongitude] = useState(parseFloat(branchData.longitude));
  const [description, setDescription] = useState(branchData.description);
  const [openingHours, setOpeningHours] = useState(branchData.opening_hours);
  const [closingHours, setClosingHours] = useState(branchData.closing_hours);
  const [contactNumber, setContactNumber] = useState(branchData.contact_number);
  const [areaName, setAreaName] = useState(branchData.description);
  const [branchPicture, setBranchPicture] = useState(branchData.branch_picture);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Image Picker (Camera & Gallery)
  const handleImageSelection = async type => {
    const options = {mediaType: 'photo', quality: 1};
    let result;

    if (type === 'camera') {
      result = await ImagePicker.launchCamera(options);
    } else {
      result = await ImagePicker.launchImageLibrary(options);
    }

    if (!result.didCancel && result.assets?.length > 0) {
      setBranchPicture(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  // Update Branch Function
  const updateBranch = async () => {
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('opening_hours', openingHours);
      formData.append('closing_hours', closingHours);
      formData.append('contact_number', contactNumber);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('area_name', areaName);

      if (branchPicture && branchPicture !== branchData.branch_picture) {
        formData.append('branch_picture', {
            uri: branchPicture,
            name: 'branch.jpg',
            type: 'image/jpeg',
        });
      }

      const response = await fetch(`${url}/branches/${branchData.branch_id}`,
        {
          method: 'POST',
          body: formData
        },
      );

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Branch updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.message || 'Failed to update branch.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  return (
    <View style={{flex: 1, padding: 20, backgroundColor: 'white'}}>
  

      {/* Image Upload */}
      <Pressable
        onPress={() => setModalVisible(true)}
        style={{ width:'100%',
          height: 150,
          borderRadius: 5,
          backgroundColor: '#f0f0f0',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          marginVertical: 10,}}>
        {branchPicture ? (
          <Image
            source={{uri: branchPicture}}
            style={{width: '100%',
              height: '100%',
              borderRadius: 5,}}
          />
        ) : (
          <View style={{alignItems: 'center'}}>
            <Icon name="cloud-upload" size={40} color="gray" />
            <Text>Upload Image</Text>
          </View>
        )}
      </Pressable>

      {/* Form Inputs */}
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        style={{marginBottom: 10}}
      />
      <TextInput
        label="Opening Hours"
        value={openingHours}
        onChangeText={setOpeningHours}
        mode="outlined"
        keyboardType="numeric"
        style={{marginBottom: 10}}
      />
      <TextInput
        label="Closing Hours"
        value={closingHours}
        onChangeText={setClosingHours}
        mode="outlined"
        keyboardType="numeric"
        style={{marginBottom: 10}}
      />
      <TextInput
        label="Contact Number"
        value={contactNumber}
        onChangeText={setContactNumber}
        mode="outlined"
        keyboardType="phone-pad"
        style={{marginBottom: 10}}
      />
        <TextInput
                    label="Area Name"
                    value={areaName}
                    onChangeText={setAreaName}
                    mode="outlined"
                    style={{marginBottom: 10}}
                  />

      {/* Map Modal */}
      <Button
        mode="contained"
        onPress={() => setMapModalVisible(true)}
        style={{backgroundColor: '#4285F4', marginBottom: 10}}>
        Select Location on Map
      </Button>

      {/* Update Button */}
      <Button
        mode="contained"
        onPress={updateBranch}
        style={{backgroundColor: '#F8544B'}}>
        Update Branch
      </Button>

      {/* Location Selection Modal */}
      <Modal visible={mapModalVisible} transparent={true} animationType="slide">
        <View style={{flex: 1}}>
          <MapView
            style={{flex: 1}}
            onPress={e => {
              setLatitude(e.nativeEvent.coordinate.latitude);
              setLongitude(e.nativeEvent.coordinate.longitude);
            }}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}>
            {latitude && longitude && (
              <Marker coordinate={{latitude, longitude}} />
            )}
          </MapView>
          <View
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 15,
            }}>
            <Button mode="text" onPress={() => setMapModalVisible(false)}>
              Cancel
            </Button>
            <Button mode="contained" onPress={() => setMapModalVisible(false)}>
              Confirm Location
            </Button>
          </View>
        </View>
      </Modal>

      {/* Image Picker Modal */}
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
    </View>
  );
};

export default VendorEditBranch;
