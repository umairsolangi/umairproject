import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';

const VendorAddOrganization = ({navigation, route}) => {
  const {vendordetails} = route.params;
  const [loading, setLoading] = useState(true);
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [connectedOrganizations, setConnectedOrganizations] = useState([]);
  const [requestedOrgs, setRequestedOrgs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
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
          setAllOrganizations(data.available_organizations);
          setConnectedOrganizations(data.requested_or_connected_organizations);
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
        setRequestedOrgs(prev => [...prev, orgId]);
        setTimeout(() => {
          setErrorModalVisible(false);
        }, 1500);
      } else {
        const allErrors = Object.values(result.errors)
          .map(errorArr => errorArr[0])
          .join('\n');
        setErrorMessage(allErrors);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('Signup failed! Please try again later.');
      setErrorModalVisible(true);
    }
  };

  const filteredOrganizations = useMemo(() => {
    if (selectedCategory === 'All') {
      return [...connectedOrganizations, ...allOrganizations];
    } else if (selectedCategory === 'Connected') {
      return connectedOrganizations;
    } else {
      return allOrganizations;
    }
  }, [selectedCategory, allOrganizations, connectedOrganizations]);

  const renderItem = ({item}) => {
    const isConnected = connectedOrganizations.some(
      org => org.organization_id === item.organization_id,
    );
    const isRequested = requestedOrgs.includes(item.organization_id);

    return (
      <View style={styles.card}>
        <Image
          source={{
            uri: item.profile_picture ||
              'https://via.placeholder.com/60x60.png?text=No+Image',
          }}
          style={styles.image}
        />
        <View style={{flex: 1}}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.info}>{item.email}</Text>
          <Text style={styles.info}>{item.phone_no}</Text>
        </View>
        {!isConnected && (
          <TouchableOpacity
            onPress={() => handleSendRequest(item.organization_id)}
            disabled={isRequested}
            style={[styles.button, {backgroundColor: isRequested ? 'gray' : '#4CAF50'}]}>
            <Text style={styles.buttonText}>
              {isRequested ? 'Requested' : 'Send Request'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return loading ? (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="black" />
    </View>
  ) : (
    <>
      <View style={styles.categoryContainer}>
        {['All', 'Connected', 'Available'].map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[styles.categoryButton, selectedCategory === cat && styles.activeCategory]}
          >
            <Text style={selectedCategory === cat ? styles.activeText : styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        contentContainerStyle={{padding: 15}}
        data={filteredOrganizations}
        keyExtractor={item => item.organization_id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No delivery organizations found.</Text>
        }
      />

      <Modal
        transparent
        visible={errorModalVisible}
        animationType="slide"
        onRequestClose={() => setErrorModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
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

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  info: {
    color: 'gray',
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'black',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  activeCategory: {
    backgroundColor: '#F8544B',
  },
  categoryText: {
    fontSize:15,
    color: 'black',
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: 'black',
  },
});