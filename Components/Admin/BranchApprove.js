import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';

const BranchApprove = () => {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all | approved | unapproved
  const navigation = useNavigation();

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    filterBranches(filter);
  }, [branches, filter]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/admin/branches/pendingBranches`);
      const data = await response.json();
      if (data && Array.isArray(data.pending_branches)) {
        setBranches(data.pending_branches);
      } else {
        setBranches([]);
      }
    } catch (error) {
      console.error('Error fetching Branches:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBranches();
  };

  const filterBranches = (type) => {
    if (type === 'approved') {
      setFilteredBranches(branches.filter(branch => branch.branch_approval_status === 'approved'));
    } else if (type === 'unapproved') {
      setFilteredBranches(branches.filter(branch => branch.branch_approval_status !== 'approved'));
    } else {
      setFilteredBranches(branches);
    }
  };

  const renderBranch = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.branch_picture }} style={styles.image} />
      <View style={styles.info}>
                <Text style={styles.detail}>Owner: {item.vendor_name}</Text>

        <Text style={styles.name}>{item.shop_name}</Text>
        <Text style={styles.detail}>{item.branch_description}</Text>
        <Text style={styles.detail}>Status: {item.branch_approval_status}</Text>
        {item.branch_approval_status !== 'approved' && (
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Branch Details', { vendor: item })}
            style={styles.button}>
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
      <Text
        style={[
          styles.filterText,
          filter === value && styles.filterTextActive
        ]}
      >
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
          data={filteredBranches}
          keyExtractor={item => item.branch_id.toString()}
          renderItem={renderBranch}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No branches found.</Text>
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
      )}
    </View>
  );
};

export default BranchApprove;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
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
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: 'grey',
    alignSelf: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    marginTop: 5,
    backgroundColor: '#F8544B',
    borderRadius: 10,
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
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
