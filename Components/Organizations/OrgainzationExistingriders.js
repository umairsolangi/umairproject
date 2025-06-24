import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert} from 'react-native';

const OrgainzationExistingriders = ({route}) => {
    const {organizationdetails}=route.params
    console.log('organizationdetais',organizationdetails)
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRiders = async () => {
    try {
      const response = await fetch(`${url}/organizations/${organizationdetails.organization_id}/deliveryboys`);
      const data = await response.json();
      if (response.ok && data?.delivery_boys) {
        setRiders(data.delivery_boys);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch riders');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Image source={{uri: item.profile_picture}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.text}>{item.phone_no}</Text>
        <Text style={styles.text}>{item.email}</Text>
        <Text style={styles.text}>{item.city}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        data={riders}
        keyExtractor={item => item.delivery_boy_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{padding: 10}}
        ListEmptyComponent={<Text style={styles.emptyText}>No riders found.</Text>}
      />
    </View>
  );
};

export default OrgainzationExistingriders;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  text: {
    fontSize: 13,
    color: '#444',
  },
  status: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  },
});
