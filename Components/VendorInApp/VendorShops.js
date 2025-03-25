import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert, Pressable, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SelectList } from 'react-native-dropdown-select-list';
import { Button } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const VendorShops = ({ navigation, route }) => {
  const userdata = route.params.vendordetails;
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchShops();
    fetchCategories();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await fetch(`${url}/vendor/${userdata.vendor_id}/shops`);
      const data = await response.json();
      if(data.message!='No shops found for this vendor')
      {
        setShops(data.shops);
      }
      else{
        setShops([])
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${url}/shopcategories`);
      const data = await response.json();

      const formattedCategories = data.map((category) => ({
        key: category.id.toString(),
        value: category.name,
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const createShop = async () => {
    if (!shopName || !shopDescription || !selectedCategory) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const shopData = {
        vendors_ID: userdata.vendor_id,
        name: shopName,
        description: shopDescription,
        shopcategory_ID: selectedCategory,
      };

      const response = await fetch(`${url}/vendor/shop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Shop created successfully');
        setModalVisible(false);
        setShopName('');
        setShopDescription('');
        setSelectedCategory(null);
        fetchShops();
      } else {
        Alert.alert('Error', 'Failed to create shop');
      }
    } catch (error) {
      console.error('Error creating shop:', error);
      Alert.alert('Error', 'Failed to create shop');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
   
      <Text style={{color:'black', fontSize: 30, fontWeight: 'bold', marginBottom: 10 ,alignSelf:'center'}}>All Shops</Text>
      <Button
        onPress={() => setModalVisible(true)}
        mode="contained"
        uppercase={true}
        style={{
          backgroundColor: '#F8544B',
          alignSelf: 'center',
          borderRadius: 10,
          marginTop: 10,
          marginBottom:20,
          width: 200,
          height:50,
          alignItems:'center',
          justifyContent:'center',
          fontSize:20,
          fontWeight:'bold'
        }}
      >
        Create New Shop
      </Button>
      {/* Shops List */}
      <View style={{minHeight:200}}>
      <FlatList
      data={shops}
      numColumns={2}
      minHeight={30}
      keyExtractor={(item) => item.id.toString()}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      renderItem={({ item }) => (
        <Pressable onPress={() => navigation.navigate('Vendor Branches', { shop: item,vendordata:userdata })}>
          <View style={styles.card}>
        
            
              <MaterialIcons name="storefront" size={50} color="#F8544B" style={styles.icon} />
            
           
            <Text style={styles.shopName}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.category}>Category: {item.shopcategory_name}</Text>
          </View>
        </Pressable>
      )}
    /></View>
    
     
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View style={{ width: '90%', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Create Shop</Text>

            <TextInput
              placeholder="Shop Name"
              value={shopName}
              onChangeText={setShopName}
              style={{ borderBottomWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <TextInput
              placeholder="Shop Description"
              value={shopDescription}
              onChangeText={setShopDescription}
              style={{ borderBottomWidth: 1, padding: 10, marginBottom: 10 }}
            />

            {/* Dynamic Category Selection */}
            <SelectList
              boxStyles={{ paddingHorizontal: 20, width: 380 }}
              placeholder="Select Category"
              save="key"
              setSelected={setSelectedCategory}
              data={categories}
            />

            {/* Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 10 }}>
                <Text style={{ color: 'red', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={createShop}
                style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5 }}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    alignSelf:'center',
    width: 180,
    minHeight: 200,
    padding: 15,
    marginBottom: 10,
    marginRight:5,
    borderRadius: 10,
    backgroundColor: '#f5f0f0',
    elevation: 6,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    marginBottom: 10,
  },
  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
  },
  category: {
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
});
export default VendorShops;
