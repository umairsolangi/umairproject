import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Card, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../../Context/LmdContext';

const CustomerShowOrderDetails = ({navigation, route}) => {
  const {orderInfo} = route.params;
  const customerdata = route.params.cutomerdata;
  const {clearCart} = useCart();


  const [modalVisible, setModalVisible] = useState(false);
  const subtotal = orderInfo.order_details.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0,
  );
  const serviceFee = 100;
  const total = subtotal + serviceFee;
  const placeOrder = async () => {
    if (!orderInfo) {
      alert('Order data is missing!');
      return;
    }

    const formattedOrder = {
      customer_id: orderInfo.customer_id,
      delivery_address_id: orderInfo.delivery_address.key, // Extracting the key as ID
      order_details: orderInfo.order_details.map(item => ({
        vendor_id: item.vendor_id,
        shop_id: item.shop_id,
        branch_id: item.branch_id,
        item_detail_id: item.item_detail_id,
        price: parseFloat(item.price), // Ensure price is a number
        quantity: parseInt(item.quantity, 10), // Ensure quantity is an integer
      })),
    };

    console.log('final data ', formattedOrder);
    try {
      const response = await fetch(`${url}/customers/place-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedOrder),
      });

      const result = await response.json();

      if (response.ok) {
        setModalVisible(true);
      } else {
        alert(`Error: ${result.message || 'Something went wrong!'}`);
      }
    } catch (error) {
      console.error('Order API Error:', error);
      alert('Failed to place order. Please try again later.');
    }
  };
  const backtoDashboard = () => {
    setModalVisible(false);
     clearCart();
    navigation.navigate('Customer Dashboard', {customerdata});
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.header}>Congratulation</Text>
      <Text style={styles.subHeader}>Your order placed successfully</Text>
      <Text style={styles.boldText}>Enjoy Our Service</Text>
      <Text style={styles.orderDetails}>Your Order Details</Text> */}

      {/* Order Summary Card */}
      <Card style={styles.summaryCard}>
        <Card.Content style={{marginVertical: 20}}>
          <Text style={styles.summaryTitle}>Summary</Text>

          <View style={[styles.orderItem, {flexDirection: 'column'}]}>
            <Text style={styles.totalText}>Delivery Address:</Text>
            <Text style={styles.itemName}>
              {orderInfo.delivery_address.value}
            </Text>
          </View>
          {/*  <View  style={[styles.orderItem,{flexDirection:'column'}]}>
              <Text style={styles.totalText}>Billing Address:</Text>
              <Text style={styles.itemName}>{orderInfo.Billing_address.value}</Text>
            </View>   */}
        </Card.Content>
        <Card.Content>
          {orderInfo.order_details.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <Text style={styles.itemName}> {item.item_name}</Text>
              <Text style={styles.itemPrice}>
                Rs.{parseFloat(item.price) * item.quantity}
              </Text>
            </View>
          ))}

          <View
            style={{
              width: '100%',
              height: 5,
              backgroundColor: '#F8544B',
            }}></View>

          {/* Subtotal, Service Fee, Total */}
          <View style={styles.orderItem}>
            <Text style={styles.summaryText}>Delivery Fee</Text>
            <Text style={styles.summaryText}>Rs.{serviceFee}</Text>
          </View>
          <View style={styles.orderItem}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>Rs.{subtotal}</Text>
          </View>
          <View
            style={{
              width: '100%',
              height: 5,
              backgroundColor: '#F8544B',
            }}></View>

          <View style={styles.orderItem}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>Rs.{total}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Schedule Order & Track Order Buttons */}
      {/* <TouchableOpacity onPress={() => console.log("Schedule Order")} style={styles.scheduleOrder}>
        <Text style={styles.scheduleText}>SCHEDULE ORDER</Text>
        <Icon name="heart-outline" size={20} color="black" />
      </TouchableOpacity> */}

      <Button
        mode="contained"
        style={styles.trackOrderButton}
        onPress={placeOrder}>
        Place Order
      </Button>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.header}>Congratulation</Text>
            <Text style={styles.subHeader}>Your order placed successfully</Text>
            <Text style={styles.boldText}>Enjoy Our Service</Text>

            <Button
              mode="contained"
              onPress={backtoDashboard}
              style={styles.closeButton}>
              OK
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default CustomerShowOrderDetails;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FCEAE8',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8544B',
    marginTop: 20,
  },
  subHeader: {
    fontSize: 16,
    marginVertical: 5,
    color: 'black',
  },
  boldText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDetails: {
    fontSize: 14,
    color: 'black',
    marginVertical: 10,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 5,
    borderRadius: 10,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    alignSelf: 'center',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  itemName: {
    fontSize: 16,
    color: 'black',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  summaryText: {
    fontSize: 16,
    color: 'black',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  scheduleOrder: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  scheduleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 5,
  },
  trackOrderButton: {
    backgroundColor: '#F8544B',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 15,
    width: '80%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8544B',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  boldText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'black',
  },
});
