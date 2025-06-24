import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TextInput, Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {SelectList} from 'react-native-dropdown-select-list';

const RiderAddvehicle = ({route}) => {
  const {Userdetails} = route.params;
  const [vehicles, setVehicles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [plateNo, setPlateNo] = useState('');
  const [color, setColor] = useState('');
  const [vehicleCategoryId, setVehicleCategoryId] = useState('');
  const [model, setModel] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
    

    fetchData();
  }, []);

  const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, vehiclesRes] = await Promise.all([
          fetch(`${url}/vehicle-categories`),
          fetch(`${url}/deliveryboy/${Userdetails.delivery_boy_id}/vehicles`)
        ]);

        const categoriesData = await categoriesRes.json();
        const vehiclesData = await vehiclesRes.json();

        if (categoriesData.status) {
          const categoryList = categoriesData.data.map(item => ({
            key: item.id,
            value: item.name
          }));
          setCategories(categoryList);
        } else {
          Alert.alert('Error', categoriesData.message || 'Failed to load categories');
        }

        if (vehiclesRes.ok) {
          setVehicles(vehiclesData.vehicles || []);
        } else {
          Alert.alert('Error', vehiclesData.message || 'Failed to fetch vehicles');
        }
      } catch (error) {
        console.error('Error in Promise.all:', error);
        Alert.alert('Error', 'Something went wrong while loading data');
      } finally {
        setLoading(false);
      }
    };
  const handleAddVehicle = async () => {
    if (!plateNo || !vehicleCategoryId) {
      Alert.alert('Validation', 'Plate No and Vehicle Category are required');
      return;
    }

    const payload = {
      plate_no: plateNo,
      color,
      vehicle_type: vehicleCategoryId,
      model,
    };

    try {
      const response = await fetch(
        `${url}/deliveryboys/${Userdetails.delivery_boy_id}/vehicle`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Vehicle added');
        setModalVisible(false);
        fetchData();
        setPlateNo('');
        setColor('');
        setVehicleCategoryId('');
        setModel('');
      } else {
        Alert.alert('Error', result.message || 'Failed to add vehicle');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong');
    } 
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.bold}>Plate No: {item.plate_no}</Text>
      <Text style={styles.text}>Color: {item.color}</Text>
      <Text style={styles.text}>Category ID: {item.vehicle_type}</Text>
      <Text style={styles.text}>Model: {item.model}</Text>
    </View>
  );

  return (
    <PaperProvider theme={theme}>
      <View style={{flex: 1, padding: 15, backgroundColor: '#fff'}}>
        <View style={styles.header}>
          <Text style={styles.title}>My Vehicles</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="add-circle-outline" size={30} color="#F8544B" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={vehicles}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{color: 'gray'}}>No vehicles found</Text>
          }
        />

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add Vehicle</Text>

              <TextInput
                label="Plate No*"
                value={plateNo}
                onChangeText={setPlateNo}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Color"
                value={color}
                onChangeText={setColor}
                mode="outlined"
                style={styles.input}
              />
              <SelectList
                setSelected={setVehicleCategoryId}
                data={categories}
                placeholder="Select Vehicle Type*"
                boxStyles={{marginBottom: 10, borderColor: '#ccc'}}
                 dropdownTextStyles={{color: 'black'}}
              inputStyles={{color: 'black'}}
              />
              <TextInput
                label="Model"
                value={model}
                onChangeText={setModel}
                mode="outlined"
                style={styles.input}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#F8544B'}]}
                  onPress={handleAddVehicle}
                  disabled={loading}>
                  <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: '#ccc'}]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
};

export default RiderAddvehicle;

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F8544B',
    text: 'black',
    placeholder: '#888',
  },
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  card: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    color: 'black',
  },
  text: {
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'black',
  },
  input: {
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
