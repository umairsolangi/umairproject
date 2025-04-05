import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SelectList} from 'react-native-dropdown-select-list';
import {Button, TextInput, ActivityIndicator} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VendorBranches = ({navigation, route}) => {
  const ShopDetails = route.params.shop;
  const vendordata = route.params.vendordata;
  const [branches, setBranches] = useState([]);
  const [cities, setCities] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ImagemodalVisible, setImageModalVisible] = useState(false);

  // Form States
  const [latitude, setLatitude] = useState(33.6844);
  const [longitude, setLongitude] = useState(73.0479);
  const [description, setDescription] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [closingHours, setClosingHours] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [cityID, setCityID] = useState(null);
  const [areaName, setAreaName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [branchPicture, setBranchPicture] = useState(null);
  const [branchStatus, setBranchStatus] = useState('');

  useEffect(() => {
    fetchBranches();
    fetchCities();
  }, [branchStatus]);

  const fetchBranches = async () => {
    try {
      const response = await fetch(`${url}/shop/${ShopDetails.id}/branches`);
      const data = await response.json();
      if (data.message != 'No branches found for this shop.') {
        setBranches(data.branches);
      } else {
        setBranches([]);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`${url}/cities`);
      const data = await response.json();
      const formattedCities = data.map(city => ({
        key: city.id.toString(),
        value: city.name,
      }));
      setCities(formattedCities);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchCamera({mediaType: 'photo'});

      if (result.didCancel) {
        console.log('User canceled image selection');
      } else if (result.errorCode) {
        console.error('Error picking image:', result.errorMessage);
      } else if (result.assets && result.assets[0]) {
        setBranchPicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Unexpected error picking image:', error);
    }
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
      setBranchPicture(result.assets[0].uri);
    }
    setImageModalVisible(false);
  };

  const toggleSwitch = async branchId => {
    try {
      const response = await fetch(
        `${url}/Vendor/branches/${branchId}/togglestatus`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(`Branch is ${data.new_status}`);
        setBranchStatus(data.new_status);
      } else {
        Alert.alert('Error', data.message || 'Failed to update branch status');
      }
    } catch (error) {
      console.error('Error updating branch status:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const createBranch = async () => {
    console.log(
      'branch data:',
      latitude,
      longitude,
      openingHours,
      closingHours,
      contactNumber,
      cityID,
      areaName,
      ShopDetails.id,
      postalCode,
      branchPicture,
      description
    );
  
    if (
      !latitude ||
      !longitude ||
      !openingHours ||
      !closingHours ||
      !contactNumber ||
      !cityID ||
      !areaName
    ) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
  
    try {
      let formData = new FormData();
      formData.append('shops_ID', ShopDetails.id);
      formData.append('latitude', latitude.toFixed(6));  
      formData.append('longitude', longitude.toFixed(6)); 
      formData.append('description', description);
      formData.append('opening_hours', openingHours);
      formData.append('closing_hours', closingHours);
      formData.append('contact_number', contactNumber);
      formData.append('city_ID', cityID);
      formData.append('area_name', areaName);
      formData.append('postal_code', postalCode);
  
      if (branchPicture) {
        formData.append('branch_picture', {
          uri: branchPicture,
          name: 'branch.jpg',
          type: 'image/jpeg',
        });
      }
  
      const response = await fetch(`${url}/branches`, {
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data'},
        body: formData,
      });
  
      if (response.ok) {
        Alert.alert('Success', 'Branch created successfully');
        setModalVisible(false);
        fetchBranches();
      } else {
       Alert.alert('Error', 'Failed to create branch'); 
       
      }
    } catch (error) {
      console.log('Error creating branch:', error);
      Alert.alert('Error', 'Failed to create branch');
    }
  };
  

  return (
    <>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            size="large"
            color="black" /* style={{marginTop: 20,alignSelf:'center'}}  */
          />
        </View>
      ) : (
        <View style={{flex: 1, padding: 16, backgroundColor: 'white'}}>
          <View style={{marginBottom: 20}}>
            <Text
              style={{
                color: 'black',
                fontSize: 30,
                fontWeight: 'bold',
              }}>
              {ShopDetails.name}
            </Text>
            <Button
              onPress={() => setModalVisible(true)}
              mode="contained"
              style={{
                backgroundColor: '#F8544B',
                borderRadius: 5,
                width: 130,
                height: 40,
                alignSelf: 'flex-end',
              }}>
              Add branch
            </Button>
          </View>

          {branches.length > 0 ? (
            <FlatList
              data={branches}
              keyExtractor={item => item.branch_id.toString()}
              renderItem={({item}) => (
                <View
                  style={{
                    height: 140,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: '#f5f0f0',
                    marginBottom: 20,
                    borderRadius: 15,
                    width: '95%',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: {width: 0, height: 2},
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}>
                  {/* Branch Image */}
                  <Image
                    source={{uri: item.branch_picture}}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      backgroundColor: '#ddd',
                    }}
                    resizeMode="cover"
                  />

                  {/* Branch Details */}
                  <View style={{flex: 1, marginLeft: 20}}>
                    <Text
                      style={{fontSize: 18, fontWeight: 'bold', color: '#333'}}>
                      {item.description}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontStyle: 'italic',
                        color: '#666',
                      }}>
                      Status: {item.status}
                    </Text>

                    <Button
                      onPress={() =>
                        navigation.navigate('View Item', {
                          branchData: item,
                          ShopDetails,
                          vendordata,
                        })
                      }
                      mode="text"
                      textColor="grey"
                      labelStyle={{fontSize: 16, fontWeight: 'bold'}}
                      style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        marginTop: 5,
                        width: 130,
                        borderColor: 'grey',
                      }}>
                      View Items
                    </Button>
                    {/* Status Switch */}
                    <View
                      style={{
                        marginTop: 10,
                        alignItems: 'center',
                        position: 'absolute',
                        right: 0,
                        top: 10,
                      }}>
                      <Switch
                        value={item.status === 'active'}
                        onValueChange={() => toggleSwitch(item.branch_id)}
                        trackColor={{false: '#ccc', true: '#4CAF50'}}
                        thumbColor={
                          item.status === 'active' ? '#fff' : '#f4f3f4'
                        }
                        ios_backgroundColor="#3e3e3e"
                      />
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Edit Branch', {branchData: item})
                        }
                        style={{marginTop: 24}}>
                        <Icon name="edit" size={34} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={{fontSize: 15, textAlign: 'center', color: '#555'}}>
              {' '}
              No Branches available
            </Text>
          )}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide">
              <ScrollView>

            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  width: '100%',
                  backgroundColor: 'white',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginBottom: 10,
                    alignSelf: 'center',
                    color:'#F8544B'
                  }}>
                  Create Branch
                </Text>
                <Pressable
                  onPress={() => setImageModalVisible(true)}
                  style={styles.profileImage}>
                  {branchPicture ? (
                    <Image source={{uri: branchPicture}} style={styles.image} />
                  ) : (
                    <View style={styles.uploadIconContainer}>
                      <Icon name="cloud-upload" size={40} color="gray" />
                      <Text style={styles.uploadText}>Upload Image</Text>
                    </View>
                  )}
                </Pressable>
                <TextInput
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  mode="outlined"
                  style={{marginBottom: 10}}
                />
                <TextInput
                  label="Opening Hours (HH:MM)"
                  value={openingHours}
                  onChangeText={setOpeningHours}
                  mode="outlined"
                  keyboardType="numeric"
                  style={{marginBottom: 10}}
                />
                <TextInput
                  label="Closing Hours (HH:MM)"
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
                <SelectList
                  setSelected={setCityID}
                  data={cities}
                  placeholder="Select City"
                  dropdownTextStyles={{ color: "black" }}
                  inputStyles={{ color: 'black' }}    
                  boxStyles={{marginBottom: 10}}
                />
                <TextInput
                  label="Area Name"
                  value={areaName}
                  onChangeText={setAreaName}
                  mode="outlined"
                  style={{marginBottom: 10}}
                />
                <TextInput
                  label="Postal Code"
                  value={postalCode}
                  onChangeText={setPostalCode}
                  mode="outlined"
                  keyboardType="numeric"
                  style={{marginBottom: 10}}
                />

                <Button
                  mode="contained"
                  onPress={() => setMapModalVisible(true)}
                  style={{backgroundColor: '#4285F4', marginBottom: 10}}>
                  Select Location on Map
                </Button>

                <Button
                  mode="contained"
                  onPress={createBranch}
                  style={{backgroundColor: '#F8544B'}}>
                  Create Branch
                </Button>

                <Button
                  mode="text"
                  onPress={() => setModalVisible(false)}
                  style={{marginTop: 10}}>
                  Cancel
                </Button>
              </View>
            </View>
            </ScrollView>
          </Modal>
          
          <Modal
            visible={mapModalVisible}
            transparent={true}
            animationType="slide">
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
                }}
                >
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
                <Button
                  mode="contained"
                  style={{backgroundColor:'#F8544B'}}
                  onPress={() => setMapModalVisible(false)}>
                  Confirm Location
                </Button>
              </View>
            </View>
          </Modal>
          <Modal
            transparent={true}
            visible={ImagemodalVisible}
            animationType="slide">
            <Pressable
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'flex-end',
              }}
              onPress={() => setImageModalVisible(false)}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  alignItems: 'center',
                }}>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>
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

                <Button mode="text" onPress={() => setImageModalVisible(false)}>
                  Cancel
                </Button>
              </View>
            </Pressable>
          </Modal>
        </View>
      )}
    </>
  );
};

export default VendorBranches;
const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  uploadIconContainer: {
    alignItems: 'center',
  },
  uploadText: {
    color: 'gray',
    fontSize: 14,
    marginTop: 5,
  },
});
