import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { TextInput, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrganizationAddVehiclecatagory = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [charge, setCharge] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${url}/vehicle-categories`);
      const data = await response.json();
      if (data.status) {
        setCategories(data.data);
      } else {
        Alert.alert('Error', data.message || 'Failed to load categories');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleAddCategory = async () => {
    if (!name || !charge) {
      Alert.alert('Validation', 'Name and Per KM Charge are required');
      return;
    }

    const payload = {
      name,
      per_km_charge: parseFloat(charge),
      description,
    };

    try {
      const response = await fetch(`${url}/vehicle-categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && result.status) {
        Alert.alert('Success', 'Category added successfully');
        setModalVisible(false);
        setName('');
        setCharge('');
        setDescription('');
        fetchCategories();
      } else {
        Alert.alert('Error', result.message || 'Failed to add category');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.bold}>Name: {item.name}</Text>
      <Text style={styles.text}>Charge: Rs {item.per_km_charge} / km</Text>
      {item.description ? (
        <Text style={styles.text}>Description: {item.description}</Text>
      ) : null}
    </View>
  );

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, padding: 15, backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <Text style={styles.title}>Vehicle Categories</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="add-circle-outline" size={30} color="#F8544B" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={categories}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ color: 'gray' }}>No categories found</Text>}
        />

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add Vehicle Category</Text>

              <TextInput
                label="Category Name*"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Per KM Charge*"
                value={charge}
                onChangeText={setCharge}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                style={styles.input}
                multiline
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#F8544B' }]}
                  onPress={handleAddCategory}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#ccc' }]}
                  onPress={() => setModalVisible(false)}
                >
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

export default OrganizationAddVehiclecatagory;

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
