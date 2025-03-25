import { View, Text } from 'react-native'
import React, {createContext,useState } from 'react'



export const VendorContext = createContext();

const VendorProvider = ({ children }) => {
    const [vendordetails, setVendorDetails] = useState(null);
  
    const fetchVendorDetails = async (vendorId) => {
      try {
        const response = await fetch(`${url}/vendor/${vendorId}`);
        if (response.ok) {
            var data = await response.json();
            if (data) {
              setvendordetails(data);
              console.log(data);
            }
          } else {
            const errorText = await response.text();
            setMessage(`${errorText}`);
            setMessageColor('red');
          }
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };
  
    return (
      <VendorContext.Provider value={{ vendordetails, fetchVendorDetails }}>
        {children}
      </VendorContext.Provider>
    );
  };
  
  export default VendorProvider;
  