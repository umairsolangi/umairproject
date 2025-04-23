import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ActivityIndicator, IconButton} from 'react-native-paper';
import MessageModal from '../CommonComponents/MessageModal';
import { RefreshControl } from 'react-native-gesture-handler';



const CustomerShowAddress = ({navigation, route}) => {
  const {cutomerdata} = route.params;
  const [customerAddress, setCustomerAddress] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCustomerAddress();
  }, []);
  const getCustomerAddress = async () => {
    try {
      const response = await fetch(
        `${url}/customers/${cutomerdata.id}/addresses`,
      );
      const data = await response.json();
      if (response.ok) {
        if (data.addresses) {
          setCustomerAddress(data.addresses);
          <MessageModal
            errorModalVisibleVal={true}
            errorMessage={'Api call'}
          />;
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
      setRefreshing(false)
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    getCustomerAddress();
  };
  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.iconSection}>
        <View style={[styles.circleIcon, {backgroundColor: item.color + '20'}]}>

        {item.address_type=='Home'?
        <MaterialCommunityIcons
        name={'home-outline'}
        size={24}
        color={'#00BFFF'}
      />:
      <MaterialCommunityIcons
            name={'gift-outline'}
            size={24}
            color={'#DDA0DD'}
          />
      }
          
        </View>
      </View>

      <View style={styles.addressSection}>
        <Text style={styles.label}>{item.address_type}</Text>
        <Text style={styles.address}>{`${item.street},${item.city},${item.country}`}</Text>
      </View>

      <View style={styles.actions}>
      
        <MaterialCommunityIcons 
      onPress={() => {}}
            name={'pencil-outline'}
            size={20}
            color={'grey'}
          />
        <MaterialCommunityIcons 
      onPress={() => {}}
            name={'trash-can-outline'}
            size={20}
            color={'#F8544B'}
          />
      </View>
    </View>
  );

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator
        size="large"
        color="black" /* style={{marginTop: 20,alignSelf:'center'}}  */
      />
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.heading}>My Address</Text>
      <FlatList
        data={customerAddress}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#F8544B']}
              tintColor="#F8544B"
            />
          }
      />

      <TouchableOpacity style={styles.addBtn}  onPress={() => navigation.navigate('Add Address', {cutomerdata})}>
        <Text style={styles.addBtnText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomerShowAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: 'black',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f0f0',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
  },
  iconSection: {
    marginRight: 10,
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressSection: {
    flex: 1,
  },
  label: {
    fontWeight: '700',
    marginBottom: 2,
    color: '#444',
  },
  address: {
    color: '#666',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap:10
  },
  addBtn: {
    backgroundColor: '#F8544B',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
