import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
  Alert
} from 'react-native';
import {Button,} from 'react-native-paper';
import StepIndicator from 'react-native-step-indicator';

const CustomerShowPlaceOrderItem = ({route, navigation}) => {
  const {orderDetails} = route.params;
 

  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(20);
  const [subtotal, setSubtotal] = useState(0);
  const [ordersLatestLocation, setOrderLatestLocation] = useState({});
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [count, setcount] = useState(0);

  const deliveryCharges = 0;

  useEffect(() => {
    if(count==0)
    {
      fetchOrdersLateststatus()
    }
    if (orderDetails && orderDetails.items) {
      setOrderItems(orderDetails.items);
      const calcSubtotal = orderDetails.items.reduce(
        (acc, item) => acc + parseFloat(item.item_total),
        0,
      );
      setSubtotal(calcSubtotal);
    }
    if (ordersLatestLocation.status == 'in_transit') {
      setErrorModalVisible(true);
      setErrorMessage('Please Confirm Order Delivery')
    }
  }, [orderDetails,ordersLatestLocation]);

  const fetchOrdersLateststatus = async () => {
    setcount(1)
    try {
      const locationRes = await fetch(
        `${url}/getLatestLocationBySuborderId/${orderDetails.suborder_id}`,
      );

      const locationData = await locationRes.json();

      if (locationData != 'No location found for this suborder.') {
        setOrderLatestLocation(locationData);
        console.log('Order latest status',locationData)
      }
    } catch (error) {
      console.error('Please Try Again:', error);
    } finally {
      setLoading(false);
    }
  };

  const labels = [
    '    Pending      ',
    '    Processing   ',
    '      Ready      ',
    '    Assigned     ',
    '    Picked Up    ',
    '    In Transit   ',
    '    Delivered    ',
    '    Complete    ',
  ];

  const customStyles = {
    stepIndicatorSize: 28,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#ff4d4d',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#ff4d4d',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#ff4d4d',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#ff4d4d',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#ff4d4d',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: 'black',
    labelSize: 13,
    currentStepLabelColor: '#ff4d4d',
  };

  const getCurrentStep = status => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 0;
      case 'in_progress':
        return 1;
      case 'ready':
        return 2;
      case 'assigned':
        return 3;
      case 'picked_up':
        return 4;
      case 'in_transit':
        return 5;
      case 'delivered':
        return 6;
      case 'Compelete':
        return 7;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };




  const confirmorderdelivery = async () => {
    setErrorModalVisible(false)
        try {
          const response = await fetch(
            `${url}/customer/order/${orderDetails.suborder_id}/confirm-delivery`,
            {
              method: 'patch',
              headers: { 'Content-Type': 'application/json' },
            }
          );
  
          const data = await response.json();
          if (response.ok) {
            Alert.alert('Success', 'Order marked as delivered');
           
  
          } else {
            Alert.alert('Error', 'Delivery Boy Not Confirmed ');
          }
        } catch (error) {
          console.error('Error marking as delivered:', error.message);
        }

  };
   


  const confirmorderPayment = async () => {
        try {
          const response = await fetch(
            `${url}/customer/confirm-payment/${orderDetails.suborder_id}`,
            {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
            }
          );
  
          const data = await response.json();
          if (response.ok) {
            Alert.alert('Success', 'Payment Confirm Succeccfully');
            
  
          } else {
            Alert.alert('Error', 'Delivery Boy Not Confirmed Payment');
          }
        } catch (error) {
          console.error('Error marking as delivered:', error.message);
        }

  };


  const renderItem = ({item}) => (
    <View style={styles.itemCard}>
      <View style={{flex: 1, marginLeft: 10}}>
        <Text style={styles.itemTitle}>{item.item_name}</Text>
        {item.variation_name && (
          <Text style={styles.itemSubText}>
            Variation: {item.variation_name}
          </Text>
        )}
        {item.additional_info && (
          <Text style={styles.itemSubText}>Info: {item.additional_info}</Text>
        )}
        {item.attributes?.length > 0 && (
          <View style={{marginTop: 4}}>
            {item.attributes.map((attr, idx) => (
              <Text style={styles.itemSubText} key={idx}>
                {attr.key}: {attr.value}
              </Text>
            ))}
          </View>
        )}
        <View style={styles.priceRow}>
          <Text style={styles.itemQty}>Qty: {item.item_quantity}</Text>
          <Text style={styles.itemPrice}>Rs {item.item_total}</Text>
        </View>
      </View>
      <Image source={{uri: item.itemPicture}} style={styles.itemImage} />
    </View>
  );
  return loading ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="black" />
    </View>
  ) : (
    <View style={styles.container}>
      {orderDetails.suborder_status === 'cancelled' ? (
        <Text
          style={{
            color: 'red',
            fontWeight: 'bold',
            fontSize: 16,
            marginBottom: 10,
          }}>
          Order Cancelled
        </Text>
      ) : (
        <View style={{height: 70, marginBottom: 10}}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{alignItems: 'center'}}>
            <StepIndicator
              customStyles={customStyles}
              currentPosition={getCurrentStep(orderDetails.suborder_status)}
              labels={labels}
              stepCount={labels.length}
              direction="horizontal"
            />
          </ScrollView>
        </View>
      )}
<View style={{flexDirection:'row',gap:10}}>
      {(orderDetails.suborder_status === 'picked_up' ||
        orderDetails.suborder_status === 'assigned' ||
        orderDetails.suborder_status === 'handover_confirmed' ||
        orderDetails.suborder_status === 'in_transit'||
        orderDetails.suborder_status === 'delivered' ) && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Live Tracking', {order:orderDetails})}
          style={[styles.acceptButton,{backgroundColor:'#F8544B'}]}>
          Track Order
        </Button>
      )}
      {(orderDetails.suborder_status === 'delivered'&& orderDetails.suborder_payment_status=="pending")&&(
        <Button
        mode="contained"
        onPress={confirmorderPayment}
        style={styles.acceptButton}>
        Confirm Payment
      </Button>
      )}
</View>
      <Text style={styles.heading}>Order# LMD-{orderDetails.suborder_id}</Text>

      <FlatList
        data={orderItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <View style={{backgroundColor: '#ff4d4d', padding: 20, borderRadius: 10}}>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            Rs {subtotal + deliveryCharges}.00
          </Text>
        </View>
      </View>
      <Modal
        transparent
        visible={errorModalVisible}
        animationType="slide"
        onRequestClose={() => setErrorModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 20,
              alignItems: 'center',
            }}>
            
            <Text
              style={{
                fontSize: 16,
                marginTop: 10,
                textAlign: 'center',
                color: 'black',
              }}>
              {errorMessage}
            </Text>

            <Button
              mode="contained"
              onPress={confirmorderdelivery}
              style={{marginTop: 20, backgroundColor: '#F8544B'}}>
              OK
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomerShowPlaceOrderItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 5,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f0f0',
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
  acceptButton: {
    backgroundColor: 'green',
   flex:1
  },
});
