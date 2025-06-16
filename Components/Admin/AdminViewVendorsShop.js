import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ColorSpace } from 'react-native-reanimated';

const AdminViewVendorsShop = ({ navigation, route }) => {
  const vendorData = route.params.vendor;
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await fetch(`${url}/admin/vendor/${vendorData.vendor_ID}/shops`);
      const data = await response.json();
      if (data) {
        setShops(data);
        console.log(data)
       
      } 
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <View style={{ flex: 1, padding: 15 }}>
          <Text style={styles.title}>All Shops</Text>

          {shops.length > 0 ? (
            <FlatList
              data={shops}
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate('All Branches', {
                      shopdata: item,
                      vendordata: vendorData,
                    })
                  }
                  style={{ flex: 1, margin: 4, marginBottom: 20 }}
                >
                  <View style={styles.card}>
                    <MaterialIcons
                      name="storefront"
                      size={50}
                      color="#F8544B"
                      style={styles.icon}
                    />
                    <Text style={styles.shopName}>{item.name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.category}>
                      Category: {item.category_name}
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          ) : (
            <Text style={styles.description}>No Shop available</Text>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    width: '100%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5f0f0',
    elevation: 6,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  category: {
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    color: 'grey',
  },
});

export default AdminViewVendorsShop;
