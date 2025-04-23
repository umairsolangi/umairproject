import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';

const VendorAddOrganization = ({navigation, route}) => {
  const {vendordetails} = route.params;
  const [loading, setLoading] = useState(true);
  const [organizationdetails, setOrganizationdetails] = useState([]);
  const [requestedOrgs, setRequestedOrgs] = useState([]); // Track sent requests
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    getOrganizationDetails();
  }, []);

  const getOrganizationDetails = async () => {
    try {
      const response = await fetch(
        `${url}/vendor/${vendordetails.vendor_id}/available-organizations`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setOrganizationdetails(data.available_organizations);
        }
      }
    } catch (error) {
      console.error('Try Again', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async orgId => {
    const jsondata = {
      vendor_ID: vendordetails.vendor_id,
      organization_ID: orgId,
    };
    try {
      const response = await fetch(`${url}/organization/connect-vendor`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(jsondata),
      });
      const result = await response.json();
      if (response.ok) {
        setErrorMessage('Request Send successfully!');
        setErrorModalVisible(true);
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

    setRequestedOrgs(prev => [...prev, orgId]); // Disable button after request
    console.log('Request sent to:', orgId);
  };

  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 15,
        borderRadius: 10,
        elevation: 2,
      }}>
      <Image
        source={{uri: item.profile_picture}}
        style={{width: 60, height: 60, borderRadius: 30, marginRight: 10}}
      />
      <View style={{flex: 1}}>
        <Text style={{fontWeight: 'bold', fontSize: 16, color: 'black'}}>
          {item.name}
        </Text>
        <Text style={{color: 'gray'}}>{item.email}</Text>
        <Text style={{color: 'gray'}}>{item.phone_no}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleSendRequest(item.organization_id)}
        disabled={requestedOrgs.includes(item.organization_id)}
        style={{
          backgroundColor: requestedOrgs.includes(item.organization_id)
            ? 'gray'
            : '#4CAF50',
          paddingHorizontal: 15,
          paddingVertical: 8,
          borderRadius: 8,
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>
          {requestedOrgs.includes(item.organization_id)
            ? 'Requested'
            : 'Send Request'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="black" />
    </View>
  ) : (
    <>
      <FlatList
        contentContainerStyle={{padding: 15}}
        data={organizationdetails}
        keyExtractor={item => item.organization_id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 15,
              color: 'black',
            }}>
            Available Delivery Partners
          </Text>
        }
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20, color: 'black'}}>
            No delivery organizations available.
          </Text>
        }
      />
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
    </>
  );
};

export default VendorAddOrganization;
