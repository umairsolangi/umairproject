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
const Customeraddratingtoitems = ({route, navigation}) => {
  const {order} = route.params;
  console.log('order for rating', order);
  const [loading, setLoading] = useState(true);

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
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemrating, setitemrating] = useState([]);
  const [deliveryboydetails, setdeliveryboydetails] = useState({});
  const [deliveryboymodal, setdeliveryboymodal] = useState(false);

  useEffect(() => {
    fetchratingstatus();
  }, []);

  const fetchratingstatus = async () => {
    try {
      const [ratingRes, itemRes] = await Promise.all([
        fetch(`${url}/suborders/${order.suborder_id}/detailsForRatingStatus`),
        fetch(`${url}/suborders/${order.suborder_id}/detailsForRating`),
      ]);

      const ratingdata = await ratingRes.json();
      const itemdata = await itemRes.json();

      if (itemdata.items) {
        setitemforrating(itemdata.items);
        setdeliveryboydetails(itemdata.delivery_boy_info);
      }

      if (ratingdata.success) {
        setCheckRating(ratingdata.data.has_rated);
        setCheckItemRating(ratingdata.data.item_ratings.has_rated);
        setDeliveryBoyRating(ratingdata.data.delivery_boy_rating.has_rated);
        console.log('item rating', ratingdata.data.item_ratings.has_rated);
        if (ratingdata.data) {
          setitemrating(ratingdata.data);
          console.log(ratingdata.data)
        }
      }
    } catch (error) {
      console.error('Fetch Rating Error:', error);
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

  const submitRating = async () => {
    try {
      // Submit Item Rating
      const formData = new FormData();

      formData.append('suborders_ID', order.suborder_id);
      formData.append('itemdetails_ID', selectedItem?.item_detail_id);
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

      const itemResponse = await fetch(`${url}/itemrating`, {
        method: 'POST',
        body: formData,
      });

      const itemResult = await itemResponse.json();

      if (itemResponse.ok) {
        Alert.alert('Thanks for your feedback!');
        setratingmodal(false);
        fetchratingstatus();
      } else {
        console.log('Item Rating Error:', itemResult);
        Alert.alert(itemResult.message || 'Failed to submit item rating.');
      }
    } catch (error) {
      console.error('Rating Submission Error:', error);
      Alert.alert('Error submitting rating. Please try again later.');
    }
  };

  const submitriderRating = async () => {
    if (deliveryboycomment && deliveryboyrating) {
      const deliveryboydata = {
        suborder_ID: order.suborder_id,
        rating_stars: deliveryboyrating,
        comments: deliveryboycomment,
      };
      try {
        const response = await fetch(`${url}/customer/rate-delivery-boy`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deliveryboydata),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert('Thanks for your feedback!');
          setdeliveryboymodal(false);
          fetchratingstatus()
        } else {
          console.log('Server error:', data);
          Alert.alert(data.message || 'Something went wrong.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert('Error submitting rating.');
      }
    }
  };
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  } else
    return (
      <View style={{flex: 1, padding: 15}}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: 'black',
          }}>
          Items to Rate
        </Text>
        <View style={styles.itemCard}>
          
          <View style={{flex: 1, marginLeft: 10}}>
            {deliveryboydetails.profile_picture && <Image
            source={{uri: deliveryboydetails.profile_picture}}
            style={styles.itemImage}
            resizeMode="cover"
          />}
            <Text style={styles.itemTitle}>{deliveryboydetails.name}</Text>
            <Text style={{color: 'black'}}>{deliveryboydetails.email}</Text>

            {checkDeliveryboyRating ? (
            
                      <View
                        style={{
                          marginTop: 10,
                          borderTopWidth: 1,
                          borderRadius: 1,
                          padding: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: 'green',
                            fontWeight: 'bold',
                          }}>
                          You already rated 
                        </Text>
                        {itemrating.delivery_boy_rating.rating_stars == 1 && (
                          <Text style={{color: 'black'}}>
                            Rating: ⭐ {itemrating.delivery_boy_rating.rating_stars}
                          </Text>
                        )}
                        {itemrating.delivery_boy_rating.rating_stars == 2 && (
                          <Text style={{color: 'black'}}>
                             ⭐⭐ {itemrating.delivery_boy_rating.rating_stars}
                          </Text>
                        )}
                        {itemrating.delivery_boy_rating.rating_stars == 3 && (
                          <Text style={{color: 'black'}}>
                             ⭐⭐⭐ {itemrating.delivery_boy_rating.rating_stars}
                          </Text>
                        )}
                        {itemrating.delivery_boy_rating.rating_stars== 4 && (
                          <Text style={{color: 'black'}}>
                             ⭐⭐⭐⭐ {itemrating.delivery_boy_rating.rating_stars}
                          </Text>
                        )}
                        {itemrating.delivery_boy_rating.rating_stars == 5 && (
                          <Text style={{color: 'black'}}>
                             ⭐⭐⭐⭐⭐ {itemrating.delivery_boy_rating.rating_stars}
                          </Text>
                        )}

                        <Text style={{color: 'black'}}>
                           {itemrating.delivery_boy_rating.comments}
                        </Text>
                        <Text style={{color: 'black'}}>
                           {itemrating.delivery_boy_rating.rating_date}
                        </Text>
                         
                         
                      </View>
            ) : (
              <Button
                mode="contained"
                textColor="black"
                onPress={() => {
                  setdeliveryboymodal(true);
                }}
                style={{backgroundColor: 'lightgrey', width: 200}}>
                Rate Delivery Boy
              </Button>
            )}
          </View>
        </View>
        {itemforrating.length === 0 ? (
          <Text style={{color: 'black'}}>No items found.</Text>
        ) : (
          <FlatList
            data={itemforrating}
            keyExtractor={item => item.item_detail_id.toString()}
            renderItem={({item}) => {
              const existingRating = itemrating?.item_ratings?.ratings.find(
                r => r.itemdetails_ID === item.item_detail_id,
              );

              return (
                <View style={styles.itemCard}>
                  <View style={{flex: 1, marginLeft: 10}}>
                    <Image
                      source={{uri: item.itemPicture}}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.itemTitle}>{item.item_name}</Text>
                    <Text style={{color: 'black'}}>
                      {item.item_description}
                    </Text>

                    {existingRating ? (
                      <View
                        style={{
                          marginTop: 10,
                          borderTopWidth: 1,
                          borderRadius: 1,
                          padding: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: 'green',
                            fontWeight: 'bold',
                          }}>
                          You already rated this item
                        </Text>
                        {existingRating.rating_stars == 1 && (
                          <Text style={{color: 'black'}}>
                            Rating: ⭐ {existingRating.rating_stars}
                          </Text>
                        )}
                        {existingRating.rating_stars == 2 && (
                          <Text style={{color: 'black'}}>
                             ⭐⭐ {existingRating.rating_stars}
                          </Text>
                        )}
                        {existingRating.rating_stars == 3 && (
                          <Text style={{color: 'black'}}>
                             ⭐⭐⭐ {existingRating.rating_stars}
                          </Text>
                        )}
                        {existingRating.rating_stars == 4 && (
                          <Text style={{color: 'black'}}>
                             ⭐⭐⭐⭐ {existingRating.rating_stars}
                          </Text>
                        )}
                        {existingRating.rating_stars == 5 && (
                          <Text style={{color: 'black'}}>
                             ⭐⭐⭐⭐⭐ {existingRating.rating_stars}
                          </Text>
                        )}

                        <Text style={{color: 'black'}}>
                           {existingRating.comments}
                        </Text>
                         <Text style={{color: 'black'}}>
                           {existingRating.rating_date}
                        </Text>
                         <View  style={{flexDirection:'row',gap:10}}>
                        {existingRating.images?.length > 0 &&
                          existingRating.images.map((img, index) => (
                            
                            <Image
                              key={index}
                              source={{uri: img}}
                              style={{
                                width: 50,
                                height: 50,
                                marginTop: 5,
                                borderRadius: 3,
                              }}
                            />
                          ))}
                        </View>
                      </View>
                    ) : (
                      <Button
                        mode="contained"
                        textColor="black"
                        onPress={() => {
                          setSelectedItem(item);
                          setratingmodal(true);
                        }}
                        style={{backgroundColor: 'lightgrey', width: 150}}>
                        Rate Item
                      </Button>
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}

        <Modal visible={ratingmodal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
                Rate {selectedItem?.item_name}
              </Text>

              <View style={{flexDirection: 'row', marginVertical: 1}}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
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
                  marginVertical: 10,
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
                  width: 120,
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
                    Upload Images
                  </Text>
                </View>
              </Pressable>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 15,
                }}>
                <Button onPress={() => setratingmodal(false)}>Cancel</Button>
                <Button onPress={submitRating} style={{marginLeft: 10}}>
                  Submit
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        <Modal visible={deliveryboymodal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
                Rate Delivery boy
              </Text>

              <View style={{flexDirection: 'row', marginVertical: 1}}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setdeliveryboyRating(star)}>
                    <Text
                      style={{
                        fontSize: 30,
                        color: star <= deliveryboyrating ? '#F8544B' : 'gray',
                        marginHorizontal: 4,
                      }}>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

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

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginTop: 15,
                }}>
                <Button onPress={() => setdeliveryboymodal(false)}>
                  Cancel
                </Button>
                <Button onPress={submitriderRating} style={{marginLeft: 10}}>
                  Submit
                </Button>
              </View>
            </View>
          </View>
        </Modal>
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
              <Text
                style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>
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

export default Customeraddratingtoitems;

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
  },
});
