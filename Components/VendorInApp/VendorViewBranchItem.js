import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator, Button, IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VendorViewBranchItem = ({navigation, route}) => {
  const {branchData, ShopDetails, vendordata} = route.params;
  const [branchItem, setBranchItem] = useState([]);
  const [Allcatagories, setAllcatagories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getAllBranchItems();
    getAllshopSubcatagories();
  }, []);

  const getAllshopSubcatagories = async () => {
    try {
      const response = await fetch(
        `${url}/itemcategories/${ShopDetails.shopcategory_ID}`,
      );
      const data = await response.json();
      if (data) {
        setAllcatagories([{id: 'all', name: 'All'}, ...data.categories]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };
  const getAllBranchItems = async () => {
    try {
      const response = await fetch(
        `${url}/vendor/${ShopDetails.vendors_ID}/shop/${ShopDetails.id}/branch/${branchData.branch_id}/menu`,
      );
      const data = await response.json();
      if (data != 'No menu information found for this vendor/shop/branch') {
        setBranchItem(data);
        setFilteredItems(data);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };
  const filterItems = id => {
    if (id == 'all') {
      setFilteredItems(branchItem);
      return;
    }

    const filtered = branchItem?.filter(
      e => String(e.item_category_id) === String(id),
    );
    setFilteredItems(filtered);
  };
  const handleDeleteItem = itemId => {
    setBranchItem(prevItems =>
      prevItems.filter(item => item.item_id !== itemId),
    );
    setFilteredItems(prevItems =>
      prevItems.filter(item => item.item_id !== itemId),
    );
    Alert.alert('Success', 'Item deleted successfully!');
  };
  const handleSearch = text => {
    setSearchText(text);

    const filtered = branchItem.filter(item =>
      item.item_name.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredItems(filtered);
  };
  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.branchDetails}>
        <Text style={styles.branchName}>{branchData.description}</Text>
        {branchData.approval_status == 'approved' &&
          vendordata.vendor_type === 'In-App Vendor' && (
            <Button
              onPress={() =>
                navigation.navigate('Add Item', {
                  item: branchData,
                  shopcatagory: ShopDetails.shopcategory_ID,
                  shopdetails: ShopDetails,
                })
              }
              mode="contained"
              style={{
                backgroundColor: '#F8544B',
                borderRadius: 5,
                marginTop: 5,
                marginBottom: 5,
                width: 110,
                height: 40,
                padding: 0,
                flex: 1,
              }}>
              Add item
            </Button>
          )}
      </View>
      {/*  <TouchableOpacity style={styles.cartButton} onPress={showorderdetails}>
          <Icon name="shopping-cart" size={24} color="white" />
        </TouchableOpacity> */}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="black"
          style={{marginTop: 20, alignSelf: 'center'}}
        />
      ) : (
        <>
          <View style={{paddingHorizontal: 0, marginBottom: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 10,
                paddingHorizontal: 10,
              }}>
              <TextInput
                placeholder="Search"
                placeholderTextColor="black"
                style={{
                  flex: 1,
                  color: 'black',
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
                style={{backgroundColor: 'black', padding: 5, margin: 0}}
                onPress={() => handleSearch(searchText)}
              />
            </View>
          </View>
          <View style={{height: 50}}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryButtons}>
                {Allcatagories.map(category => (
                  <Button
                    key={category.id}
                    mode="outlined"
                    textColor="black"
                    onPress={() => filterItems(category.id)}
                    style={styles.categoryButton}>
                    {category.name}
                  </Button>
                ))}
              </View>
            </ScrollView>
          </View>

          <FlatList
            data={
              filteredItems.length > 0
                ? filteredItems
                : filteredItems.length === 0 && branchItem.length > 0
                ? []
                : branchItem
            }
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            minHeight={30}
            keyExtractor={item => (item.item_id)}
            ListEmptyComponent={() => (
              <View style={{alignItems: 'center', marginTop: 20}}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: 'gray'}}>
                  No items available in this category
                </Text>
              </View>
            )}
            renderItem={({item}) => (
              <View style={styles.productCard}>
                <View>
                  <Image
                    source={{uri: item.itemPicture}}
                    style={styles.productImage}
                  />
                  <Text style={styles.productName}>{item.item_name}</Text>
                  <Text style={styles.productType}>{item.variation_name}</Text>
                  <Text style={styles.productPrice}>Rs. {item.price}</Text>

                  <View style={styles.productBottomRow}>
                    <TouchableOpacity
                      onPress={() => handleDeleteItem(item.item_id)}>
                      <Icon name="delete" size={30} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Icon name="edit" size={28} color="darkgreen" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 10},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'yellow',
  },
  branchImage: {width: 150, height: 150, borderRadius: 10},
  branchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  branchName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    flex: 5,
    marginEnd: 10,
  },
  ratingContainer: {flexDirection: 'row', alignItems: 'center'},
  ratingText: {fontSize: 14, color: '#777'},
  minOrder: {fontSize: 14, color: '#777'},
  cartButton: {backgroundColor: '#F8544B', padding: 10, borderRadius: 10},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 10,
  },
  filterButton: {
    backgroundColor: '#F8544B',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  categoryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  selectedCategory: {backgroundColor: '#F8544B', borderColor: '#F8544B'},
  categoryText: {fontSize: 16, color: '#000'},
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    elevation: 3,
  },
  productImage: {width: '100%', height: 100, borderRadius: 10},
  productName: {fontSize: 16, fontWeight: 'bold', marginTop: 5, color: 'black'},
  productType: {fontSize: 14, color: '#777', color: 'grey'},
  productBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  productPrice: {fontSize: 16, fontWeight: 'bold', color: 'grey'},

  categoryButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButton: {
    borderColor: 'black',
    marginHorizontal: 5, // Add spacing between buttons
  },
});

export default VendorViewBranchItem;
