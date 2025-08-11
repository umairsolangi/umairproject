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
import {ScrollView} from 'react-native';
import {ActivityIndicator, Button, IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useCart} from '../../Context/LmdContext';

const ShowItems = ({navigation, route}) => {
  const branchdata = route.params.item;
  const {addToCart} = useCart();
  const [branchItem, setBranchItem] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [Allcatagories, setAllcatagories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBrances, setLoadingBrances] = useState(true);

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
  fetchInitialData();
}, []);

const fetchInitialData = async () => {
  try {
    setLoading(true);
    setLoadingBrances(true);

    const [categoriesRes, itemsRes] = await Promise.all([
      fetch(`${url}/itemcategories/${branchdata.shopcategory_ID}`),
      fetch(
        `${url}/vendor/${branchdata.vendor_id}/shop/${branchdata.shop_id}/branch/${branchdata.branch_id}/menu`,
      ),
    ]);

    const categoriesData = await categoriesRes.json();
    const itemsData = await itemsRes.json();

    // Set categories
    if (categoriesData?.categories?.length) {
      setAllcatagories([{id: 'all', name: 'All'}, ...categoriesData.categories]);
    }

    // Set items
    if (itemsData && typeof itemsData !== 'string') {
      if (itemsData.error) {
    Alert.alert('Sorry', 'Vendor server is not reachable');
    return; // Stop further execution
  }
      setBranchItem(itemsData);
      setFilteredItems(itemsData);
    }
  } catch (error) {
    console.error('Error fetching initial data:', error);
  } finally {
    setLoading(false);
    setLoadingBrances(false);
  }
};

  const filterItems = id => {
    if (id == 'all') {
      setFilteredItems(branchItem);
      return;
    }

    const filtered = branchItem.filter(
      e => String(e.item_category_id) === String(id),
    );
    setFilteredItems(filtered);
  };

  const handlePress = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const addToCard = () => {
    const selecteditem = {
      vendor_id: branchdata.vendor_id,
      shop_id: branchdata.shop_id,
      branch_id: branchdata.branch_id,
      item_detail_id: selectedItem.itemdetail_id,
      price: selectedItem.price,
      quantity: quantity,
      itemPicture: selectedItem.itemPicture,
      item_name: selectedItem.item_name,
      shop_name: branchdata.shop_name,
      item_description: selectedItem.item_description,
    };
    addToCart(selecteditem);
    setModalVisible(false);
    setQuantity(1);
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
      <View style={styles.header}>
        <Image
          source={{uri: branchdata.branch_picture}}
          style={styles.branchImage}
        />
        <View style={styles.branchDetails}>
          <Text style={styles.branchName}>{branchdata.branch_description}</Text>
          <Text style={[styles.branchName, {fontSize: 15, fontWeight: '500'}]}>
            {branchdata.shop_description}
          </Text>

          <View style={styles.ratingContainer}>
            

            
           
             

                <Text style={styles.ratingText}>
                 
                Reviews-({branchdata.reviews_count}) 
                </Text>
              
          </View>
        </View>
        {/*  <TouchableOpacity style={styles.cartButton} onPress={showorderdetails}>
          <Icon name="shopping-cart" size={24} color="white" />
        </TouchableOpacity> */}
      </View>
      {loading && loadingBrances ? (
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

          {/* Products */}
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
            keyExtractor={item => item.item_id}
            ListEmptyComponent={() => (
              <View style={{alignItems: 'center', marginTop: 20}}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: 'gray'}}>
                  No items available in this category
                </Text>
              </View>
            )}
            renderItem={({item}) => (
              <View style={styles.productCard}>
                <Pressable onPress={() => handlePress(item)}>
                  <Image
                    source={{uri: item.itemPicture}}
                    style={styles.productImage}
                  />
                  <Text style={styles.productName}>{item.item_name}</Text>
                  <Text style={styles.productType}>{item.variation_name}</Text>
                  <View style={styles.productBottomRow}>
                    <Text style={styles.productPrice}>Rs. {item.price}</Text>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handlePress(item)}>
                      <Icon name="plus" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </Pressable>
              </View>
            )}
          />
        </>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: 'black',
                    marginBottom: 30,
                    alignSelf: 'center',
                    color: '#F8544B',
                  }}>
                  Item Details
                </Text>
                <Image
                  source={{uri: selectedItem.itemPicture}}
                  style={styles.modalImage}
                />
                <View>
                  {/*   <View style={[styles.ratingContainer, {marginTop: 20}]}>
                    <Icon name="star" size={16} color="gold" />
                    <Icon name="star" size={16} color="gold" />
                    <Text style={[styles.rating, {color: 'gray'}]}>
                      {' '}
                      4.9 (20)
                      {/* {item.rating} ({item.reviews_count} Ratings) 
                    </Text>
                  </View> */}
                </View>
                <Text style={styles.modalTitle}>{selectedItem.item_name}</Text>
                <Text style={{fontSize: 17, marginTop: 5, color: 'gray'}}>
                  {selectedItem.item_description}
                </Text>
                <Text style={styles.modalType}>
                  Size: {selectedItem.variation_name}
                </Text>
                <Text style={styles.modalPrice}>Rs/.{selectedItem.price}</Text>
                <View style={styles.quantityContainer}>
                  <Text
                    style={{fontSize: 20, fontWeight: 'bold', color: 'gray'}}>
                    Qty:
                  </Text>
                  <TouchableOpacity
                    onPress={decreaseQuantity}
                    style={styles.quantityButton}>
                    <Icon name="minus" size={15} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    onPress={increaseQuantity}
                    style={styles.quantityButton}>
                    <Icon name="plus" size={15} color="white" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={addToCard}>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 10},
  header: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  branchImage: {width: 150, height: 120, borderRadius: 10},
  branchDetails: {flex: 1, marginLeft: 10},
  branchName: {fontSize: 18, fontWeight: 'bold', color: 'black'},
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
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    elevation: 3,
    flex: 1,
  },
  productImage: {width: '100%', height: 100, borderRadius: 10},
  productName: {fontSize: 16, fontWeight: 'bold', marginTop: 5, color: 'black'},
  productType: {fontSize: 14, color: '#777'},
  productBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  productPrice: {fontSize: 16, fontWeight: 'bold', color: 'gray'},
  addButton: {backgroundColor: '#F8544B', padding: 8, borderRadius: 10},

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'flex-start',
    width: '97%',
  },
  modalImage: {width: '100%', height: 200, borderRadius: 10},
  modalTitle: {fontSize: 25, fontWeight: 'bold', marginTop: 10, color: 'black'},
  modalType: {color: 'black', marginTop: 5},
  modalPrice: {fontSize: 18, fontWeight: 'bold', marginTop: 5, color: 'gray'},
  addToCartButton: {
    backgroundColor: '#F8544B',
    paddingHorizontal: 50,
    padding: 20,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: '#F8544B',
  },
  closeButton: {marginTop: 10, padding: 10, alignSelf: 'center'},
  closeText: {color: 'red', fontWeight: 'bold'},
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityButton: {
    backgroundColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityText: {fontSize: 15, color: 'gray'},
  categoryButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButton: {
    borderColor: 'black',
    marginHorizontal: 5, // Add spacing between buttons
  },
});

export default ShowItems;
