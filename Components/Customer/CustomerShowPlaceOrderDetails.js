import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {RefreshControl, ScrollView} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomerShowPlaceOrderDetails = ({navigation, route}) => {
  const {orderDetails} = route.params;

  const [orders, setOrders] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  

  const categories = [
    'All',
    'Pending Orders',
    'In-Progress Orders',
    'Ready Orders',
    'Completed'
  ];

  useEffect(() => {
    fetchOrders();
    return(()=>{
      setSelectedCategory('All')
    })
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${url}/orders/${orderDetails.id}/details`,
      );
      
      const data = await response.json();

      if (data && data.suborders) {
       

        setOrders(data.suborders);
        console.log(data.suborders)
        setFilteredItems(data.suborders);
      }
    } catch (error) {
      console.error('Please Try Again:', error);
    } finally {
      setLoading(false);
      setRefreshing(false)
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
    filterItems('All')
  };
  const filterItems = category => {
    console.log(category);
    setSelectedCategory(category);
    let status = '';
    switch (category) {
      case 'Pending Orders':
        status = 'pending';
        break;
      case 'Ready Orders':
        status = 'ready';
        break;
      case 'In-Progress Orders':
        status = 'in_progress';
        break;
      default:
        status = '';
    }
    if (category === 'All') {
      setFilteredItems(orders);
      return;
    }
    const filtered = orders?.filter(e => e.suborder_status === status);
    setFilteredItems(filtered);
  };

  const renderItem = ({item}) => {

    return (
      <TouchableOpacity style={styles.orderCard} 
      onPress={() => navigation.navigate('Items', {orderDetails: item})}

      >
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Sub Order# LMD-{item.suborder_id}</Text>
          <Text style={styles.orderTime}>Date: {orderDetails.order_date}</Text>
          <Text style={styles.orderTime}>Status: {item.suborder_status}</Text>
        </View>
        <Icon name="chevron-right" size={24} color="black" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <>
                <View style={{marginLeft:20,marginTop:10}}>
          <Text style={styles.heading}>Order# LMD-{orderDetails.id}</Text>
          <Text style={{fontSize:17,fontWeight:'bold',color:'black'}}>Total Amount: {orderDetails.total_amount}</Text>

         <Text style={styles.dateText}>Date: {orderDetails.order_date}</Text>

         </View>
          <View style={styles.categoryContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryButtons}>
                {categories.map(category => (
                  <Button
                    key={category}
                    mode={
                      selectedCategory === category ? 'contained' : 'outlined'
                    }
                    textColor={
                      selectedCategory === category ? 'white' : 'black'
                    }
                    buttonColor={
                      selectedCategory === category ? '#ff4d4d' : 'white'
                    }
                    onPress={() => filterItems(category)}
                    style={styles.categoryButton}>
                    {category}
                  </Button>
                ))}
              </View>
            </ScrollView>
          </View>
      
          <FlatList
            data={selectedCategory !== '' ? filteredItems : orders}
            keyExtractor={item => item.suborder_id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{paddingVertical: 10}}
            ListEmptyComponent={
              <Text style={styles.noDataText}>No orders found.</Text>
            }
            refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={onRefresh}
                          colors={['#F8544B']}
                          tintColor="#F8544B"
                        />
                      }
          />
        </>
      )}
    </View>
  );
};

export default CustomerShowPlaceOrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    height: 60,
    paddingVertical: 10,
  },
  categoryButtons: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  categoryButton: {
    borderColor: 'black',
    marginHorizontal: 5,
    borderRadius: 20,
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f0f0',
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  orderInfo: {
    flexDirection: 'column',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  orderTime: {
    fontSize: 14,
    color: '#444',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});
