import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Button} from 'react-native-paper';

const VendorShowOrderDetails = ({route, navigation}) => {
  const {orderDetails, vendordetails} = route.params;
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const deliveryCharges = 0;

  useEffect(() => {
    fetchOrderedItemDetails();
  }, []);

  const fetchOrderedItemDetails = async () => {
    try {
      const response = await fetch(
        `${url}/vendor/ordered-items/${vendordetails.vendor_id}/${orderDetails.shop_id}/${orderDetails.branch_id}/${orderDetails.suborder_id}`,
      );
      const data = await response.json();
      if (data && data.order_detail_info) {
        setOrderItems(data.order_detail_info);
        const total = data.order_detail_info.reduce(
          (sum, item) => sum + parseFloat(item.order_detail_total),
          0,
        );
        setSubtotal(total);
      } else {
        Alert.alert('Error', 'Order details not found.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to fetch order items.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async status => {
    try {
      let endpoint = '';
      if (status === 'in_progress') {
        endpoint = `/vendor/order/${orderDetails.suborder_id}/in-progress`;
      } else if (status === 'ready') {
        endpoint = `/vendor/order/${orderDetails.suborder_id}/ready`;
      } else if (status === 'handover_confirmed') {
        endpoint = `/vendor/order/${orderDetails.suborder_id}/handover`;
      }

      const response = await fetch(`${url}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        Alert.alert('Success', 'Order status updated successfully');
      } else {
        const errorData = await response.json();
        Alert.alert('Failed', errorData.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Status update error:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const confirmPayment = async () => {
    try {
      const response = await fetch(
        `${url}/vendor/confirm-payment/${orderDetails.suborder_id}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (response.ok) {
        Alert.alert('Success', 'Payment confirmed successfully');
      } else {
        Alert.alert('Error', 'Delivery boy has not confirmed payment yet');
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      Alert.alert('Error', 'Failed to confirm payment');
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemCard}>
      <View style={{flex: 1, marginRight: 10}}>
        <Text style={styles.itemTitle}>{item.item.item_name}</Text>
        {item.item.variation_name ? (
          <Text style={styles.itemSubText}>
            Variation: {item.item.variation_name}
          </Text>
        ) : null}
        {item.item.additional_info ? (
          <Text style={styles.itemSubText}>
            Info: {item.item.additional_info}
          </Text>
        ) : null}
        {item.item.attributes && item.item.attributes.length > 0 && (
          <View style={{marginTop: 4}}>
            {item.item.attributes.map((attr, idx) => (
              <Text style={styles.itemSubText} key={idx}>
                {attr.key}: {attr.value}
              </Text>
            ))}
          </View>
        )}
        <View style={styles.priceRow}>
          <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
          <Text style={styles.itemPrice}>Rs {item.order_detail_total}</Text>
        </View>
      </View>
      <Image source={{uri: item.item.item_picture}} style={styles.itemImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Order# LMD-{orderDetails.suborder_id}</Text>
      <Text style={styles.dateText}>Date: {orderDetails.order_date}</Text>
      {/* Customer Info Card */}
<View style={styles.customerCard}>
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    
    <View style={{marginLeft: 0, flex: 1}}>
      <Text style={{color:'black',fontSize:19,fontWeight:'bold'}}>
        Customer Details
      </Text>
      <Text style={styles.customerName}>
        {orderDetails.customer?.name || 'Customer'}
      </Text>
      <Text style={styles.customerPhone}>
        {orderDetails.customer?.phone_no || 'N/A'}
      </Text>
      <Text style={styles.customerAddress}>
        {orderDetails.customer?.address?.street || 'Street not provided'},
        {' '}
        {orderDetails.customer?.address?.city || 'City'}
      </Text>
    </View>
  </View>
</View>


      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2196F3"
          style={{marginTop: 20}}
        />
      ) : (
        <>
          <FlatList
            data={orderItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
          />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rs {subtotal}.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              Rs {subtotal + deliveryCharges}.00
            </Text>
          </View>

          <View style={styles.actionRow}>
            {orderDetails.status === 'pending' && (
              <Button
                mode="contained"
                onPress={() => updateOrderStatus('in_progress')}
                style={styles.acceptButton}>
                Accept
              </Button>
            )}
            {orderDetails.status === 'in_progress' && (
              <Button
                mode="contained"
                onPress={() => updateOrderStatus('ready')}
                style={[styles.acceptButton, {backgroundColor: '#ff4d4d'}]}>
                Move To Ready
              </Button>
            )}
            {orderDetails.status === 'picked_up' && (
              <Button
                mode="contained"
                onPress={() => updateOrderStatus('handover_confirmed')}
                style={[styles.acceptButton, {backgroundColor: '#ff4d4d'}]}>
                Handover To Rider
              </Button>
            )}
            {orderDetails.Suborder_Payment_status ===
              'confirmed_by_deliveryboy' && (
              <Button
                mode="contained"
                onPress={confirmPayment}
                style={[styles.acceptButton, {backgroundColor: '#ff4d4d'}]}>
                Confirm Payment
              </Button>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default VendorShowOrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#E6E6E6',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  dateText: {
    marginBottom: 10,
    color: '#333',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  itemSubText: {
    fontSize: 13,
    color: '#333',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  itemQty: {
    fontSize: 14,
    color: '#000',
  },
  itemPrice: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 5,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#000',
  },
  summaryValue: {
    fontSize: 16,
    color: '#000',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  actionRow: {
    marginTop: 15,
  },
  acceptButton: {
    backgroundColor: 'green',
    width: '100%',
    marginBottom: 10,
  },
  customerCard: {
    backgroundColor: '#fff',
    borderRadius: 1,
    padding: 12,
    marginBottom: 12,
 
  },
  customerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
  },
  customerPhone: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
  customerAddress: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
