import React, {useEffect, useState} from 'react';
import {View, Text, Image, FlatList, Pressable, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const BranchApprove = () => {
  const [vendors, setVendors] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchBranches();
  }, [vendors]);

  const fetchBranches = async () => {
    try {
      const response = await fetch(`${url}/admin/branches/pendingBranches`);
      const data = await response.json();
      if (data) {
        setVendors(data.pending_branches);
      }
    } catch (error) {
      console.error('Error fetching Branches:', error);
    }
  };

  const renderBranches = ({item}) =>
    item.branch_approval_status !== 'approved' && (
      <View style={styles.card}>
        <Image source={{uri: item.branch_picture}} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.vendor_name}</Text>

          <Text style={styles.detail}>{item.branch_description}</Text>

          <Text style={styles.detail}>Catagory:{item.shop_category}</Text>
          <Text style={styles.detail}>
            Status: {item.branch_approval_status}
          </Text>

          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate('Branch Details', {vendor: item})
            }
            style={styles.button}>
            Preview
          </Button>
        </View>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={vendors}
        keyExtractor={item => item.vendor_id.toString()}
        renderItem={renderBranches}
      />
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
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: 'grey',
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
  },
});
