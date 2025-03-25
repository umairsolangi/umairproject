import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, Pressable, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const VendorApprove = () => {
  const [vendors, setVendors] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch(`${url}/admin/vendors`);
      const data = await response.json();
      if(data.message!='No vendors found.')
      {
        setVendors(data);
      }

    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const renderVendor = ({ item }) => (
    item.approval_status !== "approved" && (
      <View style={styles.card}>
        <Image source={{ uri: item.profile_picture }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}>Status: {item.approval_status}</Text>
  
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Vendor Details', { vendor: item })}
            style={styles.button}
          >
            Preview
          </Button>
        </View>
      </View>
    )
  );
  

  return (
    <View style={styles.container}>
      <FlatList
        data={vendors}
        keyExtractor={(item) => item.vendor_id.toString()}
        renderItem={renderVendor}
      />
    </View>
  );
};

export default VendorApprove;

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
    borderRadius: 40,
    marginRight: 10,
    backgroundColor:'grey'
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
