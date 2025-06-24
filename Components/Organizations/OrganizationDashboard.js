import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {Card} from 'react-native-paper';

const OrganizationDashboard = ({route}) => {
  const {organizationdetails}=route.params
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch(`${url}/organizations/${organizationdetails.organization_id}/organization-stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching organization stats:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="darkred" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.mainContainer}>
      <View style={styles.headerBox}>
        <Text style={styles.greeting}>Hey Organization Admin!</Text>
        <Text style={styles.subGreeting}>Welcome to Dashboard</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Team Overview</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Delivery Boys:</Text>
          <Text style={styles.value}>{stats.total_delivery_boys}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Vendors:</Text>
          <Text style={styles.value}>{stats.total_vendors}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Vendor Approval Status</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Approved:</Text>
          <Text style={styles.value}>{stats.vendor_approval_status.approved}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Pending:</Text>
          <Text style={styles.value}>{stats.vendor_approval_status.pending}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Rejected:</Text>
          <Text style={styles.value}>{stats.vendor_approval_status.rejected}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Orders</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Delivered Orders:</Text>
          <Text style={styles.value}>{stats.total_delivered_orders}</Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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

export default OrganizationDashboard;
