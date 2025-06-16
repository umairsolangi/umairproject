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
  Alert,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import StepIndicator from 'react-native-step-indicator';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomerShowPlaceOrderItem = ({route, navigation}) => {
  const {orderDetails} = route.params;
  console.log('item details id', orderDetails.items[0].item_detail_id);

  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(20);
  const [subtotal, setSubtotal] = useState(0);
  const [ordersLatestLocation, setOrderLatestLocation] = useState({});
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [count, setcount] = useState(0);
  const [checkRating, setCheckRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [deliveryboyrating, setdeliveryboyRating] = useState(0);
  const [deliveryboycomment, setdeliveryboyComment] = useState('');
  const [ImagemodalVisible, setImageModalVisible] = useState(false);
  const [ratingmodal, setratingmodal] = useState(false);
  const [checkItemRating, setCheckItemRating] = useState(false);
  const [checkDeliveryboyRating, setDeliveryBoyRating] = useState(false);
  const [itemforrating, setitemforrating] = useState([]);

  const deliveryCharges = 0;

  useEffect(() => {
    fetchratingstatus();
    if (count == 0) {
      fetchOrdersLateststatus();
    }
    if (orderDetails && orderDetails.items) {
      setOrderItems(orderDetails.items);
      const calcSubtotal = orderDetails.items.reduce(
        (acc, item) => acc + parseFloat(item.item_total),
        0,
      );
      setSubtotal(calcSubtotal);
    }
    if (ordersLatestLocation.status == 'reached_destination') {
      setErrorModalVisible(true);
      setErrorMessage('Please Confirm Order Delivery');
    }
  }, [orderDetails, ordersLatestLocation]);

  const fetchratingstatus = async () => {
    try {
      const ratingstatus = await fetch(
        `${url}/suborders/${orderDetails.suborder_id}/detailsForRatingStatus`,
      );

      const getitemforrating = await fetch(
        `${url}/suborders/${orderDetails.suborder_id}/detailsForRating`,
      );
      const itemdata = await getitemforrating.json();
      if (itemdata.items) {
        setitemforrating(itemdata.items);
      }

      const ratingdata = await ratingstatus.json();

      if (ratingdata.success) {
        setCheckRating(ratingdata.data.has_rated);
        setCheckItemRating(ratingdata.data.item_ratings.has_rated);
        setDeliveryBoyRating(ratingdata.data.delivery_boy_rating.has_rated);

        if (!ratingdata.data.has_rated) {
          setratingmodal(true);
        }
      }
    } catch (error) {
      console.error('Please Try Again:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersLateststatus = async () => {
    setcount(1);
    try {
      const locationRes = await fetch(
        `${url}/getLatestLocationBySuborderId/${orderDetails.suborder_id}`,
      );

      const locationData = await locationRes.json();

      if (locationData != 'No location found for this suborder.') {
        setOrderLatestLocation(locationData);
      }
    } catch (error) {
      console.error('Please Try Again:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelection = async type => {
    const options = {mediaType: 'photo', quality: 1};
    let result;

    if (type === 'camera') {
      result = await ImagePicker.launchCamera(options);
    } else {
      result = await ImagePicker.launchImageLibrary(options);
    }

    if (!result.didCancel && result.assets?.length > 0) {
      setImages(pre => [result.assets[0].uri, ...pre]);
    }
    setImageModalVisible(false);
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
    setErrorModalVisible(false);
    try {
      const response = await fetch(
        `${url}/customer/order/${orderDetails.suborder_id}/confirm-delivery`,
        {
          method: 'patch',
          headers: {'Content-Type': 'application/json'},
        },
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
          headers: {'Content-Type': 'application/json'},
        },
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

  const submitRating = async () => {
  const formData = new FormData();

  formData.append('suborders_ID', orderDetails.suborder_id);
  formData.append('itemdetails_ID', orderDetails.items[0].item_detail_id);
  formData.append('rating_stars', rating);
  formData.append('comments', comment);

  if (images && images.length > 0) {
    images.forEach((image, index) => {
      console.log('images url', image);

      formData.append('images[]', {
        uri: image,
        name: `image_${index}.jpg`,
         type: 'image/jpeg',
      });
    });
  }

  try {
    const response = await fetch(`${url}/itemrating`, {
      method: 'POST',
      body: formData,
      // DO NOT manually set headers like 'Content-Type': fetch handles it for FormData
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert('Thanks for your feedback!');
      setratingmodal(false);
    } else {
      console.log('Server error:', data);
      Alert.alert(data.message || 'Something went wrong.');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    Alert.alert('Error submitting rating.');
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
      {checkRating && checkDeliveryboyRating && checkItemRating &&(
        <Text>All Ready Rated</Text>
      )}
      <View style={{flexDirection: 'row', gap: 10}}>
        {(orderDetails.suborder_status === 'picked_up' ||
          orderDetails.suborder_status === 'assigned' ||
          orderDetails.suborder_status === 'handover_confirmed' ||
          orderDetails.suborder_status === 'in_transit' ||
          orderDetails.suborder_status === 'delivered') && (
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate('Live Tracking', {order: orderDetails})
            }
            style={[styles.acceptButton, {backgroundColor: '#F8544B'}]}>
            Track Order
          </Button>
        )}
        {orderDetails.suborder_status === 'delivered' &&
          orderDetails.suborder_payment_status == 'pending' && (
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
     {(
  (!checkRating || !checkDeliveryboyRating || !checkItemRating) &&
  ordersLatestLocation.status === 'delivered'
) && (
          <Modal
            transparent
            visible={ratingmodal}
            animationType="slide"
            onRequestClose={() => setErrorModalVisible(false)}>
            <ScrollView contentContainerStyle={{padding: 0}}>
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
                    margin: 20,
                    borderRadius: 20,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => setratingmodal(false)}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 1,
                    }}>
                    <Icon name="close" size={24} color="gray" />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: 'center',
                      marginBottom: 20,
                      color: 'black',
                      fontWeight: 'bold',
                    }}>
                    Rate Your Order
                  </Text>

                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 2,
                      alignItems: 'center',
                      padding: 20,
                      marginBottom: 10,
                      justifyContent:'center'
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        textAlign: 'center',
                        marginBottom: 0,
                        color: 'black',
                        fontWeight: 'bold',
                      }}>
                      Add Item Rating
                    </Text>

                    {itemforrating.map((item, index) => (
                      <View key={index} style={{alignItems:'center'}}>
                        <View
                          style={{
                            marginBottom: 16,
                            alignItems: 'center',
                            backgroundColor: '#f2f2f2',
                            padding: 10,
                            borderRadius: 10,
                            flexDirection:'row',
                            gap:10,
                            marginTop:10,
                            alignItems:'center'
                          }}>
                          <Image
                            source={{uri: item.itemPicture}}
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 10,
                            }}
                            resizeMode="cover"
                          />
                          <Text
                            style={{
                              marginTop: 8,
                              fontSize: 16,
                              color: '#333',
                            }}>
                            {item.item_name}
                          </Text>
                        </View>
                        <View
                          style={{flexDirection: 'row', marginVertical: 1}}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <TouchableOpacity
                              key={star}
                              onPress={() => setRating(star)}>
                              <Text
                                style={{
                                  fontSize: 30,
                                  color: star <= rating ? '#F8544B' : 'gray',
                                  marginHorizontal: 4,
                                }}>
                                ★
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>

                        <TextInput
                          placeholder="Leave a comment (optional)"
                          value={comment}
                          onChangeText={setComment}
                          style={{
                            width: '100%',
                            borderColor: '#ccc',
                            borderWidth: 1,
                            borderRadius: 1,
                            padding: 1,
                            marginTop: 10,
                            color: 'black',
                          }}
                          multiline
                          numberOfLines={3}
                        />

                        <View
                          style={{
                            backgroundColor: 'lightgrey',
                            margin: 10,
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          {images.length > 0 &&
                            images.map((image, index) => (
                              <Image
                                key={index}
                                source={{uri: image}}
                                style={{
                                  width: 70,
                                  height: 70,
                                  margin: 10,
                                  borderRadius: 10,
                                  resizeMode: 'cover',
                                }}
                              />
                            ))}
                        </View>
                        <Pressable
                          onPress={() => setImageModalVisible(true)}
                          style={{
                            width: 180,
                            height: 80,
                            borderRadius: 6,
                            backgroundColor: '#f0f0f0',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            borderWidth: 1,
                            borderColor: '#ccc',
                            marginVertical: 10,
                          }}>
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Icon name="cloud-upload" size={40} color="gray" />
                            <Text
                              style={{
                                color: 'gray',
                                fontSize: 14,
                                marginTop: 5,
                              }}>
                              Upload Image
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    ))}
                  </View>

                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 2,
                      alignItems: 'center',
                      padding: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        textAlign: 'center',
                        marginBottom: 0,
                        color: 'black',
                        fontWeight: 'bold',
                      }}>
                      Add Delivery Boy Rating
                    </Text>
                    <View style={{flexDirection: 'row', marginVertical: 10}}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <TouchableOpacity
                          key={star}
                          onPress={() => setdeliveryboyRating(star)}>
                          <Text
                            style={{
                              fontSize: 30,
                              color:
                                star <= deliveryboyrating ? '#F8544B' : 'gray',
                              marginHorizontal: 4,
                            }}>
                            ★
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Comments input */}
                    <TextInput
                      placeholder="Leave a comment (optional)"
                      value={deliveryboycomment}
                      onChangeText={setdeliveryboyComment}
                      style={{
                        width: '100%',
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 1,
                        padding: 1,
                        marginTop: 10,
                        color: 'black',
                      }}
                      multiline
                      numberOfLines={3}
                    />

                    {/* Image Upload Preview */}

                    {/* 
                  <Pressable
                    onPress={() => setImageModalVisible(true)}
                    style={{
                      width: 180,
                      height: 120,
                      borderRadius: 6,
                      backgroundColor: '#f0f0f0',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: '#ccc',
                      marginVertical: 10,
                    }}>
                    {image ? (
                      <Image
                        source={{uri: image}}
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'cover',
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Icon name="cloud-upload" size={40} color="gray" />
                        <Text
                          style={{
                            color: 'gray',
                            fontSize: 14,
                            marginTop: 5,
                          }}>
                          Upload Image
                        </Text>
                      </View>
                    )}
                  </Pressable> */}
                  </View>

                  {/* Rating stars */}

                  {/* Submit Button */}
                  <Button
                    mode="contained"
                    onPress={submitRating}
                    style={{marginTop: 20, backgroundColor: '#F8544B'}}>
                    Submit Rating
                  </Button>
                </View>
              </View>
            </ScrollView>
          </Modal>
        )}

      <Modal
        transparent={true}
        visible={ImagemodalVisible}
        animationType="slide">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setImageModalVisible(false)}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>
              Select Image
            </Text>

            <Button
              mode="contained"
              icon="camera"
              onPress={() => handleImageSelection('camera')}
              style={{width: '70%', marginBottom: 10}}>
              Take Photo
            </Button>

            <Button
              mode="contained"
              icon="image"
              onPress={() => handleImageSelection('gallery')}
              style={{width: '70%', marginBottom: 10}}>
              Choose from Gallery
            </Button>

            <Button mode="text" onPress={() => setImageModalVisible(false)}>
              Cancel
            </Button>
          </View>
        </Pressable>
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
    flex: 1,
  },
});
