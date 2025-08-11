import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import {RefreshControl} from 'react-native';
import {Button} from 'react-native-paper';

const OrgReceiveVendorReq = ({navigation, route}) => {
  const {organizationdetails} = route.params;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Approved', 'Unapproved'];

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(
        `${url}/pending-vendor-requests/${organizationdetails.organization_id}`,
      );
      const Data = await response.json();
      if (Data.pending_requests) {
        setRequests(Data.pending_requests);
      }
    } catch (error) {
      console.error('Error fetching vendor requests:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendingRequests();
  };

  const filteredRequests = useMemo(() => {
    if (selectedCategory === 'All') return requests;
    if (selectedCategory === 'Approved') return requests.filter(r => r.approval_status === 'approved');
    if (selectedCategory === 'Unapproved') return requests.filter(r => r.approval_status !== 'approved');
    return requests;
  }, [requests, selectedCategory]);

  const renderRequestItem = ({item}) => (
    <View style={styles.card}>
      <View style={{flex: 1}}>
        <Text style={styles.name}>{item.vendor_name}</Text>
        <Text style={styles.text}> {item.vendor_email}</Text>
        <Text style={styles.text}>{item.vendor_phone}</Text>
        <Text style={styles.status}>Status: {item.approval_status}</Text>
      </View>

      {item.approval_status !== 'approved' && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Vendors Details', {vendor: item})}
          style={styles.previewButton}>
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return loading ? (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="black" />
    </View>
  ) : (
    <View style={{flex: 1, padding: 10}}>
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <Button
              mode={selectedCategory === item ? 'contained' : 'outlined'}
              textColor={selectedCategory === item ? 'white' : 'black'}
              buttonColor={selectedCategory === item ? '#F8544B' : 'white'}
              onPress={() => setSelectedCategory(item)}
              style={styles.categoryButton}>
              {item}
            </Button>
          )}
        />
      </View>

      <FlatList
        data={filteredRequests}
        keyExtractor={item => item.request_id.toString()}
        renderItem={renderRequestItem}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20, color: 'black'}}>
            No pending requests found.
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F8544B']}
            tintColor="#F8544B"
          />
        }
      />
    </View>
  );
};

export default OrgReceiveVendorReq;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    paddingBottom: 10,
  },
  categoryButton: {
    marginHorizontal: 5,
    borderRadius: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    paddingLeft: 20,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    color: '#555',
    marginTop: 2,
  },
  status: {
    marginTop: 4,
    color: '#888',
    fontStyle: 'italic',
  },
  previewButton: {
    marginTop: 5,
    backgroundColor: '#F8544B',
    borderRadius: 10,
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  previewText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
