import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const AdminViewVendorBranches = ({route}) => {
  const navigation = useNavigation();
  const {vendordata, shopdata} = route.params;

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      const response = await fetch(
        `${url}/admin/vendor/${vendordata.vendor_ID}/shop/${shopdata.id}/branches`,
      );
      const data = await response.json();
      setBranches(data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      Alert.alert('Error', 'Failed to load vendor branches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const goToBranchDetails = branch_id => {
    navigation.navigate('API Form', {branch_id});
  };

  const renderBranchItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 3,
      }}>
      <Image
        source={{uri: item.branch_picture}}
        style={{width: 80, height: 80, borderRadius: 10}}
        resizeMode="cover"
      />
      <View style={{flex: 1, marginLeft: 10}}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
          {item.description}
        </Text>
        <Text style={{color: 'gray', marginBottom: 6}}>
          Status: {item.status}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            borderColor: 'black',
            borderWidth: 1,
            paddingVertical: 6,
            borderRadius: 6,
            paddingHorizontal: 12,
            alignSelf: 'flex-start',
          }}
          onPress={() =>  navigation.navigate('API Options', {item,vendordata})}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            Go to Integraton
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  return (
    <View style={{flex: 1, padding: 16, backgroundColor: 'white'}}>
     
      <FlatList
        data={branches}
        keyExtractor={item => item.id.toString()}
        renderItem={renderBranchItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AdminViewVendorBranches;
