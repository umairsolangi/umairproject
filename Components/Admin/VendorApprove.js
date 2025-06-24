import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const VendorApprove = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all | approved | unapproved
  const navigation = useNavigation();

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterVendors(filter);
  }, [vendors, filter]);

  const fetchVendors = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await fetch(`${url}/admin/vendors`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setVendors(data);
      } else {
        setVendors([]);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVendors();
  };

  const filterVendors = (type) => {
    if (type === 'approved') {
      setFilteredVendors(vendors.filter(v => v.approval_status === 'approved'));
    } else if (type === 'unapproved') {
      setFilteredVendors(vendors.filter(v => v.approval_status !== 'approved'));
    } else {
      setFilteredVendors(vendors);
    }
  };

  const renderVendor = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.profile_picture }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.status}>Status: {item.approval_status}</Text>
        {item.approval_status !== 'approved' && (
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Vendor Details', { vendor: item })}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Preview
          </Button>
        )}
      </View>
    </View>
  );

  const FilterButton = ({ label, value }) => (
    <TouchableOpacity
      onPress={() => setFilter(value)}
      style={[
        styles.filterButton,
        filter === value && styles.filterButtonActive
      ]}
    >
      <Text style={[
        styles.filterText,
        filter === value && styles.filterTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        <FilterButton label="All" value="all" />
        <FilterButton label="Approved" value="approved" />
        <FilterButton label="Unapproved" value="unapproved" />
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#F8544B" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredVendors}
          keyExtractor={(item) => item.vendor_id.toString()}
          renderItem={renderVendor}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No vendors found.</Text>
          }
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#F8544B']}
              tintColor="#F8544B"
            />
          }
        />
      )}
    </View>
  );
};

export default VendorApprove;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    marginTop: 20,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    backgroundColor: '#ccc',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#F8544B',
    borderRadius: 8,
    paddingVertical: 4,
    width: 120,
  },
  buttonLabel: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 50,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#F8544B',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
