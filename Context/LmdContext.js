import React, {createContext, useContext, useState} from 'react';

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
  const DeliveryBoyOffONline = (val) => {
   setIsOnline(val)
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
