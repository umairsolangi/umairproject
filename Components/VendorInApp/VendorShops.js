import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SelectList} from 'react-native-dropdown-select-list';
import {Button, ActivityIndicator,  TextInput,} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const VendorShops = ({navigation, route}) => {
  const userdata = route.params.vendordetails;
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
    fetchCategories();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await fetch(`${url}/vendor/${userdata.vendor_id}/shops`);
      const data = await response.json();
      if (data.message != 'No shops found for this vendor') {
        setShops(data.shops);
      } else {
        setShops([]);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${url}/shopcategories`);
      const data = await response.json();

      const formattedCategories = data.map(category => ({
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
        headers: {'Content-Type': 'application/json'},
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
    <>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            size="large"
            color="black" /* style={{marginTop: 20,alignSelf:'center'}}  */
          />
        </View>
      ) : (
        <View style={{flex: 1, padding: 15,}}>
          <View
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 30,
                fontWeight: 'bold',
              }}>
              All Shops
            </Text>
            <Button
              onPress={() => setModalVisible(true)}
              mode="contained"
              style={{
                backgroundColor: '#F8544B',
                borderRadius: 5,
                width: 120,
                height: 40,
                alignSelf: 'flex-end',
              }}>
              Add Shop
            </Button>
          </View>
          {/* Shops List */}
          {shops.length > 0 ? (
            
              <FlatList
                data={shops}
                numColumns={2}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                  <Pressable
                    onPress={() =>
                      navigation.navigate('Vendor Branches', {
                        shop: item,
                        vendordata: userdata,
                      })
                    }
                    style={{flex:1,margin:4,marginBottom:20}}
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
                        Category: {item.shopcategory_name}
                      </Text>
                    </View>
                  </Pressable>
                )}
              />
           
          ) : (
            <Text style={styles.description}> No Shop available</Text>
          )}

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide">
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View
                style={{
                  width: '90%',
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 10,
                }}>
                <Text
                  style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
                  Create Shop
                </Text>

              
<TextInput
        mode="outlined"
        label="Shop Name"
        style={styles.input}
        value={shopName}
        onChangeText={setShopName}
        />
        <TextInput
        mode="outlined"
        label="Shop Description"
        style={styles.input}
        value={shopDescription}
        onChangeText={setShopDescription}
        />
            

                {/* Dynamic Category Selection */}
                <SelectList
                  boxStyles={{paddingHorizontal: 10}}
                  placeholder="Select Category"
                  save="key"
                  setSelected={setSelectedCategory}
                  dropdownTextStyles={{ color: "black" }}
                  inputStyles={{ color: 'black' }}    
                  data={categories}
                />

                {/* Buttons */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                  }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{padding: 10}}>
                    <Text style={{color: 'blue', fontSize: 16}}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={createShop}
                    style={{
                      backgroundColor: '#F8544B',
                      padding: 10,
                      borderRadius: 5,
                      width:'40%'
                    }}>
                    <Text style={{color: 'white', fontSize: 16,textAlign:'center'}}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  card: {
    flex:1,
    width: '100%',
    padding: 10,
   
   
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
    color:'black'
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
  },
  category: {
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    color:'grey'
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
});
export default VendorShops;
