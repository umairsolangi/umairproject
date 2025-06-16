import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  ActivityIndicator,
  Searchbar,
  Button,
} from 'react-native-paper';

const AdminShowAllApiVendors = ({ navigation, route }) => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVendors = async () => {
    try {
      const response = await fetch(`${url}/admin/api-vendors`);
      const data = await response.json();
      setVendors(data);
      setFilteredVendors(data);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVendors();
  };

  const onChangeSearch = query => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredVendors(vendors);
    } else {
      const filtered = vendors.filter(vendor =>
        vendor.cnic.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredVendors(filtered);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} color="#F8544B" size="large" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <Searchbar
        placeholder="Search by CNIC"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchbar}
        iconColor="#F8544B"
        inputStyle={{color: '#000'}}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {filteredVendors.map(vendor => (
          <Card key={vendor.vendor_ID} style={styles.card}>
            <View style={styles.header}>
              <Image
                source={{uri: vendor.profile_picture}}
                style={styles.avatar}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{vendor.name}</Text>
                <Text style={styles.type}>{vendor.vendor_type}</Text>
                <Text style={styles.status}>
                  Status:
                  <Text
                    style={
                      vendor.approval_status === 'approved'
                        ? styles.approved
                        : styles.pending
                    }>
                    {' ' + vendor.approval_status}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
              <View style={styles.details}>
                <Text style={styles.label}>
                  Email: <Text style={styles.value}>{vendor.email}</Text>
                </Text>
                <Text style={styles.label}>
                  Phone: <Text style={styles.value}>{vendor.phone_no}</Text>
                </Text>
                <Text style={styles.label}>
                  CNIC: <Text style={styles.value}>{vendor.cnic}</Text>
                </Text>
              </View>
              <View>
                <Button
                  mode="contained"
                  onPress={() =>
                    navigation.navigate('All Shops', {vendor})
                  }
                  style={styles.button}
                  labelStyle={styles.buttonLabel}>
                  Shops
                </Button>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 20,
  },
  searchbar: {
    margin: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 5,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8544B',
  },
  type: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 14,
    marginTop: 4,
  },
  approved: {
    color: 'green',
    fontWeight: 'bold',
  },
  pending: {
    color: 'orange',
    fontWeight: 'bold',
  },
  details: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  value: {
    fontWeight: '600',
    color: '#222',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
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
});

export default AdminShowAllApiVendors;
