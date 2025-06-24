import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VendorShowOrders = ({navigation, route}) => {
  const {branchData, ShopDetails, vendordata} = route.params;

  const [suborders, setSuborders] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    'All',
    'Pending Orders',
    'In-Progress Orders',
    'Ready Orders',
    'Confirmed Picked_Up',
    'In-Transit Orders',
    'Delivered Orders',
    'Confirmed Payment',
  ];

  useEffect(() => {
    fetchSuborders();
    return () => {
      setSelectedCategory('All');
    };
  }, []);

  const fetchSuborders = async () => {
    try {
      const response = await fetch(
        `${url}/vendor/${ShopDetails.vendors_ID}/suborders`,
      );
      const data = await response.json();

      if (data && data.orders) {
        const flattenedSuborders = [];

        data.orders.forEach(order => {
          const matchingSuborders = order.suborders.filter(
            suborder => suborder.branch_id === branchData.branch_id,
          );

          matchingSuborders.forEach(sub => {
            flattenedSuborders.push({
              ...sub,
              order_date: order.order_date,
              order_id: order.order_id,
              customer: order.customer,
              payment_status: order.payment_status,
              Suborder_Payment_status:sub.payment_status
            });
          });
        });

        setSuborders(flattenedSuborders);
        setFilteredItems(flattenedSuborders);
      }
    } catch (error) {
      console.error('Please Try Again:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    fetchSuborders();
    filterItems('All');
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
      case 'Confirmed Picked_Up':
        status = 'picked_up';
        break;
      case 'In-Transit Orders':
        status = 'handover_confirmed';
        break;
      case 'Delivered Orders':
        status = 'delivered';
        break;
      case 'Confirmed Payment':
        status = 'confirmed_by_vendor';
        break;
      default:
        status = '';
    }
    if (category === 'All') {
      setFilteredItems(suborders);
      return;
    }
    else if(status =='confirmed_by_vendor' ){
      const filtered = suborders?.filter(e => e.Suborder_Payment_status === status);
      setFilteredItems(filtered);
      return
    }
    const filtered = suborders?.filter(e => e.status === status);
    setFilteredItems(filtered);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() =>
          navigation.navigate('Order Details', {orderDetails: item,vendordetails:vendordata})
        }>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order# LMD-{item.suborder_id}</Text>
          <Text style={styles.orderTime}>Date: {item.order_date}</Text>
          <Text style={styles.orderTime}>Status: {item.status}</Text>
          <Text style={styles.orderTime}>Total: Rs {item.total}</Text>
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
            data={selectedCategory !== '' ? filteredItems : suborders}
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

export default VendorShowOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
