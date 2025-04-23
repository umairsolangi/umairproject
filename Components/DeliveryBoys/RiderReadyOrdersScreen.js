import React, { useState } from 'react';
import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getDistance} from 'geolib';
import {Card} from 'react-native-paper';
import {useCart} from '../../Context/LmdContext';

const RiderReadyOrdersScreen = ({navigation, route}) => {
  const {readyOrder} = useCart();
  const [acceptedOrder,setAcceptedOrder]=useState([])
  const {Userdetails} = route.params;
  console.log('Rider order');

  const ratePerKm = 20;

  const calculateCharges = (pickup, delivery) => {
    const distanceMeters = getDistance(
      {
        latitude: parseFloat(pickup.latitude),
        longitude: parseFloat(pickup.longitude),
      },
      {
        latitude: parseFloat(delivery.latitude),
        longitude: parseFloat(delivery.longitude),
      },
    );
    const km = distanceMeters / 1000;
    const charges = km * ratePerKm;
    return {km: km.toFixed(2), charges: charges.toFixed(0)};
  };

  const handelAcceptorder = async order => {
    setAcceptedOrder((pre)=>[...pre,order])
    console.log('Accepted order',acceptedOrder)

    try {
      const response = await fetch(
        `${url}/deliveryboy/${Userdetails.delivery_boy_id}/accept-order/${order.suborder_id}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (response.ok) {
        Alert.alert('Success', 'Order Accepted successfully');
        navigation.navigate('Rider Orders',{Userdetails})
      }
    } catch (error) {
      console.error('Error :', error);
      Alert.alert('Error', 'Failed');
    }
  };

  return (
    <ScrollView style={{padding: 10, backgroundColor: '#fff'}}>
      {readyOrder.map(order => {
        const pickup = order.shop.branch.pickup_location;
        const delivery = order.customer.delivery_address;
        const {km, charges} = calculateCharges(pickup, delivery);

        return (
          <Card
            key={order.suborder_id}
            style={{
              marginBottom: 15,
              backgroundColor: '#faebeb',
              borderRadius: 12,
              padding: 10,
            }}>
            {/* Pickup Info */}
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 0,
                alignItems: 'center',
              }}>
              <View style={{alignItems: 'center', padding: 10}}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={30}
                  color="#F8544B"
                  style={{marginRight: 10}}
                />
                <Text style={{fontWeight: 'bold', color: 'black'}}>Pickup</Text>
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
                  Order ID: {order.suborder_id}
                </Text>
                <Text
                  style={{fontWeight: 'bold', fontSize: 14, color: '#F8544B'}}>
                  {order.shop.name}
                </Text>
                <Text style={{color: '#555',fontWeight:'bold'}}>
                  {order.shop.branch.name},{' '}
                  {order.shop.branch.pickup_location.city}
                </Text>
              </View>
            </View>

            {/* Delivery Info */}
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 0,
                alignItems: 'center',
              }}>
              <View style={{alignItems: 'center', padding: 10}}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={30}
                  color="#4CAF50"
                  style={{marginRight: 10}}
                />
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  Deliver
                </Text>
              </View>
              <View>
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  {order.customer.name}
                </Text>
                <Text style={{fontSize: 12, color: '#555'}}>
                  {order.customer.phone}
                </Text>
                <Text style={{color: '#555',fontWeight:'bold'}}>
                  {order.customer.delivery_address.street},{' '}
                  {order.customer.delivery_address.city}
                </Text>
              </View>
            </View>

            <Text style={{marginBottom: 8, color: '#444'}}>
              Delivery Distance:{' '}
              <Text style={{fontWeight: 'bold'}}>{km} km</Text>
              {'\n'}
              Delivery Charges:{' '}
              <Text style={{fontWeight: 'bold'}}>Rs {charges}</Text>
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: '#F8544B',
                padding: 10,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => handelAcceptorder(order)}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                Accept Order
              </Text>
            </TouchableOpacity>
          </Card>
        );
      })}
    </ScrollView>
  );
};

export default RiderReadyOrdersScreen;
