import React, {createContext, useContext, useState} from 'react';
import { Alert } from 'react-native';

const CartContext = createContext();

export const CartProvider = ({children}) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isOnline, setIsOnline] = useState(false);
  const [readyOrder, setReadyOrder] = useState([]);

  const addToCart = item => {
    setOrderDetails(prev => [...prev, item]);
    setCartCount(prev => prev + 1);
  };
  

  const clearCart = () => {
    setOrderDetails([]);
    setCartCount(0);
  };
  const DeliveryBoyOffONline = async (val, riderid) => {
  try {
    const response = await fetch(`${url}/deliveryboys/status/${riderid}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      
    });

    if (response.ok) {
      setIsOnline(val);
      console.log(`Delivery boy is now ${val ? 'Online' : 'Offline'}`);
    } else {
      const errRes = await response.json();
      console.error('Failed to update status:', errRes);
      Alert.alert('Error', 'Failed to update delivery boy status.');
    }
  } catch (error) {
    console.error('Network error:', error);
    Alert.alert('Network Error', error.message);
  }
};


  return (
    <CartContext.Provider
      value={{orderDetails, cartCount, addToCart, clearCart, isOnline, setIsOnline, readyOrder,
        setReadyOrder,DeliveryBoyOffONline}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
