import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {Card} from 'react-native-paper';

const AdminDashboard = ({navigation, route}) => {
  const userdata = route.params.admindata;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${url}/admin/admin-stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching stats:', error);
        setLoading(false);
      });
  }, []);

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
      </View>

      <Card style={ss.card}>
        <Text style={ss.cardTitle}>Users</Text>
        <View style={ss.row}>
          <Text style={ss.label}>Total Users:</Text>
          <Text style={ss.value}>{stats.total_users}</Text>
        </View>
        {Object.entries(stats.users_by_role).map(([role, count]) => (
          <View style={ss.row} key={role}>
            <Text style={ss.label}>{role.charAt(0).toUpperCase() + role.slice(1)}s:</Text>
            <Text style={ss.value}>{count}</Text>
          </View>
        ))}
      </Card>

      <Card style={ss.card}>
        <Text style={ss.cardTitle}>Orders</Text>
        <View style={ss.row}>
          <Text style={ss.label}>Total Orders:</Text>
          <Text style={ss.value}>{stats.total_orders}</Text>
        </View>
        {Object.entries(stats.orders_by_status).map(([status, count]) => (
          <View style={ss.row} key={status}>
            <Text style={ss.label}>{status.charAt(0).toUpperCase() + status.slice(1)}:</Text>
            <Text style={ss.value}>{count}</Text>
          </View>
        ))}
      </Card>

      <Card style={ss.card}>
        <Text style={ss.cardTitle}>Shops & Branches</Text>
        <View style={ss.row}>
          <Text style={ss.label}>Total Shops:</Text>
          <Text style={ss.value}>{stats.total_shops}</Text>
        </View>
        <View style={ss.row}>
          <Text style={ss.label}>Total Branches:</Text>
          <Text style={ss.value}>{stats.total_branches}</Text>
        </View>
        {Object.entries(stats.branches_by_approval).map(([status, count]) => (
          <View style={ss.row} key={status}>
            <Text style={ss.label}>{status.charAt(0).toUpperCase() + status.slice(1)} Branches:</Text>
            <Text style={ss.value}>{count}</Text>
          </View>
        ))}
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

export default AdminDashboard;
