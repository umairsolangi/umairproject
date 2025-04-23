import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Button} from 'react-native-paper';

const VendorShowOrderDetails = ({route, navigation}) => {
  const {orderDetails} = route.params;
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estimatedTime, setEstimatedTime] = useState(20);
  const [subtotal, setSubtotal] = useState(0);
  const deliveryCharges = 0;
console.log('order no 16 detaisl',orderDetails)
  useEffect(() => {
    fetchOrderedItemDetails();
  }, []);

  const fetchOrderedItemDetails = async () => {
    try {
      const response = await fetch(
        `${url}/suborders/${orderDetails.suborder_id}/details`,
      );
      const data = await response.json();
      if (data) {
        setOrderItems(data.order_details);
        const total = data.order_details.reduce(
          (sum, item) => sum + parseFloat(item.order_detail_total),
          0,
        );
        setSubtotal(total);
      }
    } catch (error) {
      console.error('Please Try Again:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async std => {
    const obj = {
      role: 'vendor',
      status: std,
    };
    try {
      const response = await fetch(
        `${url}/suborders/${orderDetails.suborder_id}/status`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(obj),
        },
      );
      Alert;

      if (response.ok) {
        Alert.alert('Success', 'Order Status Updated successfully');
      }
    } catch (error) {
      console.error('Error :', error);
      Alert.alert('Error', 'Failed');
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
      Alert;

      if (response.ok) {
        Alert.alert('Success', 'Confirm Payment successfully');
      }
      else{
        Alert.alert('Error', 'DeliveryBoy not Confirm Payment');

      }
    } catch (error) {
      console.error('Error :', error);
      Alert.alert('Error', 'Failed');
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemCard}>
      <View style={{flex: 1, marginLeft: 10}}>
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

  const handleTimeChange = val => {
    setEstimatedTime(prev => Math.max(0, prev + val));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Order# LMD-{orderDetails.suborder_id}</Text>
      <Text style={styles.dateText}>Date: {orderDetails.order_date}</Text>

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

          {/* <Text style={styles.estimateLabel}>Estimated Serving Time</Text>
          <View style={styles.estimateRow}>
            <TouchableOpacity style={styles.circleButton} onPress={() => handleTimeChange(-5)}>
              <Text style={styles.circleButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.timeText}>{estimatedTime} min</Text>
            <TouchableOpacity style={styles.circleButton} onPress={() => handleTimeChange(5)}>
              <Text style={styles.circleButtonText}>+</Text>
            </TouchableOpacity>
          </View> */}

          <View style={styles.actionRow}>
            {orderDetails.status == 'pending' && (
              <Button
                mode="contained"
                onPress={()=>updateOrderStatus('in_progress')}
                style={styles.acceptButton}>
                Accept
              </Button>
            )}
            {orderDetails.status == 'in_progress' && (
              <Button
                mode="contained"
                onPress={()=>updateOrderStatus('ready')}
                style={[styles.acceptButton, {backgroundColor: '#ff4d4d'}]}>
                Move To Ready
              </Button>
            )}
            {orderDetails.status == 'picked_up' && (
              <Button
                mode="contained"
                onPress={()=>updateOrderStatus('handover_confirmed')}
                style={[styles.acceptButton, {backgroundColor: '#ff4d4d'}]}>
                Handover To Rider
              </Button>
            )}
             {orderDetails.Suborder_Payment_status == 'confirmed_by_deliveryboy' && (
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
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#000',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    color: '#000',
    flex: 1,
    textAlign: 'center',
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
  estimateLabel: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  circleButton: {
    backgroundColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
  },
  circleButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  timeText: {
    fontSize: 18,
    color: '#000',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  acceptButton: {
    backgroundColor: 'green',
    width: '100%',
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
});
