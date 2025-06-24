import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {Card} from 'react-native-paper';

const VendorDashboard = ({navigation, route}) => {
  const userdata = route.params.vendordetails;
   
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${url}/vendor/${userdata.vendor_id}/summary`)
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching summary:', error);
        setLoading(false);
      });
  }, [userdata.id]);

  if (loading) {
    return (
      <View style={ss.loaderContainer}>
        <ActivityIndicator size="large" color="darkred" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={ss.mainContainer}>
      <View style={ss.headerBox}>
        <Text style={ss.greeting}>Hey! {userdata.name}</Text>
        <Text style={ss.subGreeting}>Welcome to Dashboard</Text>
        <Text style={ss.vendorType}>Vendor Type: {userdata.vendor_type}</Text>
      </View>

      <Card style={ss.card}>
        <Text style={ss.cardTitle}>Shop & Branches</Text>
        <View style={ss.row}>
          <Text style={ss.label}>Total Shops:</Text>
          <Text style={ss.value}>{summary.total_shops}</Text>
        </View>
        <View style={ss.row}>
          <Text style={ss.label}>Total Branches:</Text>
          <Text style={ss.value}>{summary.total_branches}</Text>
        </View>
        <View style={ss.row}>
          <Text style={ss.label}>Approved Branches:</Text>
          <Text style={ss.value}>{summary.total_approved_branches}</Text>
        </View>
      </Card>

      <Card style={ss.card}>
        <Text style={ss.cardTitle}>Orders</Text>
        <View style={ss.row}>
          <Text style={ss.label}>Total Orders:</Text>
          <Text style={ss.value}>{summary.total_orders}</Text>
        </View>
        <View style={ss.row}>
          <Text style={ss.label}>Total Suborders:</Text>
          <Text style={ss.value}>{summary.total_suborders}</Text>
        </View>
        <View style={ss.row}>
          <Text style={ss.label}>Delivered Suborders:</Text>
          <Text style={ss.value}>{summary.delivered_suborders}</Text>
        </View>
        <View style={ss.row}>
          <Text style={ss.label}>Pending Suborders:</Text>
          <Text style={ss.value}>{summary.pending_suborders}</Text>
        </View>
      </Card>

      <Card style={ss.card}>
        <Text style={ss.cardTitle}>Revenue</Text>
        <View style={ss.row}>
          <Text style={ss.label}>Total Revenue:</Text>
          <Text style={ss.value}>Rs {summary.total_revenue.toLocaleString()}</Text>
        </View>
        <View style={ss.row}>
          <Text style={ss.label}>Avg Revenue/Order:</Text>
          <Text style={ss.value}>Rs {summary.avg_revenue_per_order.toFixed(2)}</Text>
        </View>
      </Card>

      <Card style={ss.card}>
        <Text style={ss.cardTitle}>Organizations</Text>
        <View style={ss.row}>
          <Text style={ss.label}>Linked Organizations:</Text>
          <Text style={ss.value}>{summary.total_linked_organizations}</Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const ss = StyleSheet.create({
  mainContainer: {
    padding: 15,
    backgroundColor: '#f5f0f0',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
  },
  subGreeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  vendorType: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8544B',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    color: 'black',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8544B',
  },
});

export default VendorDashboard;
