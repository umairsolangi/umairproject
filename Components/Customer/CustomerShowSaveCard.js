import React, {useEffect, useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import {ActivityIndicator, Button, Card, Divider} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomerShowSaveCard = ({navigation, route}) => {
  const customerFullData = route.params.customerFullData;
  const cutomerdata=route.params.cutomerdata

  const [customerSavedCartDetails, setCustomerSavedCartDetails] =
    useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomerSavedCartDetails();
  }, []);

  const getCustomerSavedCartDetails = async () => {
    try {
      const response = await fetch(
        `${url}/cart/details?customer_id=${customerFullData.customer_id}`,
      );
      const data = await response.json();
      if (data) {
        setCustomerSavedCartDetails(data);
      }
    } catch (error) {
      console.error('Error fetching Cart Data:', error);
    } finally {
      setLoading(false);
    }
  };
  const deleteCartItem = async itemId => {
    try {
      await fetch(`${url}/cart/remove-item?cart_item_id=${itemId}`, {
        method: 'POST',
      });
      getCustomerSavedCartDetails(); // Refresh cart after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCheckout = () => {
    const orderDetails = customerSavedCartDetails.suborders.flatMap(suborder =>
      suborder.items.map(item => ({
        branch_id: suborder.branch_ID,
        itemPicture: item.itemPicture,
        item_detail_id: item.item_detail_id,
        item_name: item.item_name,
        price: item.price,
        quantity: item.quantity,
        shop_id: suborder.shop_ID,
        item_description: item.item_description,
        vendor_id: suborder.vendor_ID,
      })),
    );
    navigation.navigate('Cart Item', {orderDetails,cutomerdata})
    console.log(orderDetails);

  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="black" style={{marginTop: 20}} />
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
        {customerSavedCartDetails?.suborders.map((suborder, index) => (
          <View key={index}>
            {suborder.items.map((item, itemIndex) => (
              <Card key={itemIndex} style={styles.itemCard}>
                <Card.Content>
                  <View style={styles.itemContainer}>
                    <Image
                      source={{uri: item.itemPicture}}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>
                        {item.item_name} ({item.variation_name})
                      </Text>
                      <Text style={{color:'grey'}}>{item.item_description}</Text>
                    <Text style={{color:'black'}}>Quantity: {item.quantity}</Text>
                    <Text style={{color: '#28A745',fontWeight:'500'}}>Price: Rs/.{item.price}</Text>
                    </View>
                    <Ionicons
                      name="trash-outline"
                      size={24}
                      color="red"
                      onPress={() => deleteCartItem(item.id)}
                    />
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        ))}
      </ScrollView>
  
      {/* Fixed Bottom Checkout Button */}
      <View style={styles.checkoutContainer}>
        <Button
          mode="contained"
          onPress={handleCheckout}
          style={styles.checkoutButton}
          labelStyle={styles.buttonText}>
          Go To Checkout
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 10,
    padding: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'grey'
  },
  cartStatus: {
    fontSize: 16,
    color: 'gray',
  },
  suborderContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
  },
  vendorType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subTotal: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  itemCard: {
    marginBottom: 10,
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
    alignSelf: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color:'black'
  },
  divider: {
    marginTop: 10,
    backgroundColor: 'gray',
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: '#F8544B', // Blue for checkout
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text for contrast
  },
});

export default CustomerShowSaveCard;
