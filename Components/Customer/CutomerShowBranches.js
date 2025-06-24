import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, IconButton, Modal} from 'react-native-paper';
import {Pressable, ScrollView} from 'react-native-gesture-handler';
import {useCart} from '../../Context/LmdContext';

const CutomerShowBranches = ({navigation, route}) => {
  const cutomerdata = route.params.customerFullData;
  const {orderDetails, cartCount} = useCart();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Allcatagories, setAllcatagories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [customerFullData, setCustomerFullData] = useState({});
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    console.log('test user data', cutomerdata);
    fetchBranches();
    getAllshopcatagories();
  }, []);

  const getAllshopcatagories = async () => {
    try {
      const response = await fetch(`${url}/shopcategories`);
      const data = await response.json();
      if (data) {
        setAllcatagories([{id: 'all', name: 'All'}, ...data]);
      }
    } catch (error) {
      console.error('Reload Page');
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch(
        `${url}/customer/main-screen/${cutomerdata.id}`,
      );
      const data = await response.json();
      if (data) {
        if (cutomerdata.name === 'testcustomer1') {
          const apibranches = data.filter(
            item => item.vendor_type === 'API Vendor',
          );

          setBranches(apibranches);
          setFilteredItems(apibranches);
        } else {
          setBranches(data);
          setFilteredItems(data);
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = id => {
    if (id === 'all') {
      setFilteredItems(branches);
      return;
    }
    const filtered = branches.filter(
      e => String(e.shopcategory_ID) === String(id),
    );
    setFilteredItems(filtered);
  };

  const handleSearch = text => {
    setSearchText(text);

    const filtered = branches.filter(item =>
      item.shop_category_name.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredItems(filtered);
  };
  const renderBranch = ({item}) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('Branch Menu', {item})}>
      <Image source={{uri: item.branch_picture}} style={styles.image} />
      {/* <TouchableOpacity style={styles.heartIcon}>
        <Icon name="heart-outline" size={24} color="black" />
      </TouchableOpacity> */}
      <View style={styles.info}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={styles.name}>{item.shop_name}</Text>
            <Text style={styles.name}>({item.branch_description})</Text>
            <Text style={[styles.category, {color: 'gray'}]}>
              {item.shop_category_name}
            </Text>
          </View>
          <View>
            <View style={styles.ratingContainer}>
           
              <Text style={[styles.rating, {color: 'gray'}]}>
                {' '}

                Reviews-({item.reviews_count})
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator
            size="large"
            color="black" /* style={{marginTop: 20,alignSelf:'center'}}  */
          />
        </View>
      ) : (
        <>
          <View style={{backgroundColor: '#FA4A4A', flexDirection: 'column'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
              }}>
              <View>
                <Text style={styles.header}>Hey {cutomerdata.name}</Text>
                <Text style={styles.subHeader}>Restaurants near you</Text>
              </View>
              <Text
                style={{
                  width: 30,
                  height: 30,
                  fontSize: 15,
                  fontWeight: 'bold',
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  backgroundColor: 'black',
                  color: 'white',
                  textAlign: 'center',
                  textAlignVertical: 'center', // may not work on iOS
                  lineHeight: 30, // ensures vertical centering
                  zIndex: 1,
                  borderRadius: 15,
                }}>
                {cartCount}
              </Text>

              <TouchableOpacity
                style={styles.cartButton}
                onPress={() =>
                  navigation.navigate('Cart Item', {orderDetails, cutomerdata})
                }>
                <Icon name="cart-outline" size={30} color="#FA4A4A" />
              </TouchableOpacity>
            </View>
            <View style={{marginBottom: 10, paddingHorizontal: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'white',
                  borderRadius: 10,
                  paddingHorizontal: 10,
                }}>
                <TextInput
                  placeholder="Search"
                  placeholderTextColor="white"
                  style={{
                    flex: 1,
                    color: 'white',
                    backgroundColor: 'transparent',
                  }}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  value={searchText}
                  onChangeText={handleSearch}
                />
                <IconButton
                  icon="magnify"
                  size={24}
                  iconColor="white"
                  style={{backgroundColor: 'black', padding: 5}}
                  onPress={() => handleSearch(searchText)}
                />
              </View>
            </View>

            {/* Category Filter Buttons */}
            <View style={{height: 50, marginBottom: 12}}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryButtons}>
                  {Allcatagories.map((category, index) => (
                    <Button
                      key={index}
                      mode="outlined"
                      textColor="white"
                      onPress={() => filterItems(category.id)}
                      style={styles.categoryButton}>
                      {category.name}
                    </Button>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 10,
              flex: 1,
            }}>
            {/* Branch List */}
            <FlatList
              data={filteredItems}
              ListEmptyComponent={() => (
                <View style={{alignItems: 'center', marginTop: 20}}>
                  <Text
                    style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
                    No items available in this category
                  </Text>
                </View>
              )}
              renderItem={renderBranch}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.branch_id.toString()}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#edf0ee', minHeight: 300, flex: 1},
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
  },
  subHeader: {
    fontSize: 18,
    color: 'white',
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f5f0f0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
  },
  image: {width: '100%', height: 200, borderRadius: 10},
  heartIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
  },
  info: {padding: 10},
  name: {fontSize: 15, fontWeight: 'bold', color: 'black'},

  ratingContainer: {flexDirection: 'row', alignItems: 'center', marginTop: 5},
  rating: {fontSize: 14, marginLeft: 5},
  categoryButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButton: {
    borderColor: 'white',
    marginHorizontal: 5,
  },
  cartButton: {
    backgroundColor: 'white',
    padding: 3,
    borderRadius: 5,
    marginRight: 20,
  },
});

export default CutomerShowBranches;
