import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import {TextInput, Button, ActivityIndicator} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminAddVariables = () => {
  const [variables, setVariables] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newVariable, setNewVariable] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getallvaribles();
  }, []);

  const getallvaribles = async () => {
    try {
      const [variablesResponse] = await Promise.all([
        fetch(`${url}/variables`),
      ]);

      const variablesData = await variablesResponse.json();

      if (variablesData.success) {
        setVariables(variablesData.data);
      }
    } catch (error) {
      console.error('Error fetching variables:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddVariable = async() => {
    if (newVariable.trim() === '') return;

    const newItem = {
      'tags': newVariable,
    };
    try {
      const response = await fetch(`${url}/admin/add-variable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      const data = await response.json();

      if (data) {
        alert('Variable added successfully');
      } else {
        alert('Failed to save variable.');
      }
    } catch (error) {
      console.error('Error saving variable:', error);
      alert('An error occurred while saving varialbe.');
    }

    getallvaribles()
    setNewVariable('');
    setModalVisible(false);
  };
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator animating={true} color="#F8544B" size="large" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Header with Add button */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Variables</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="add-circle-outline" size={28} color="#FF5C5C" />
        </TouchableOpacity>
      </View>

      {/* FlatList for variables */}
      <FlatList
        data={variables}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.variableItem}>
            <Text style={styles.variableText}>{item.id}{' : '}{item.tags}</Text>
          </View>
        )}
      />

      {/* Modal for adding variable */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Variable</Text>
            <TextInput
              label="Variable Name"
              mode="outlined"
              value={newVariable}
              onChangeText={setNewVariable}
              style={{marginBottom: 20}}
            />
            <Button
              mode="contained"
              buttonColor="#FF5C5C"
              onPress={handleAddVariable}>
              Add Variable
            </Button>
            <Button
              mode="text"
             
              onPress={()=>setModalVisible(false)}>
              close
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdminAddVariables;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF5C5C',
  },
  variableItem: {
    backgroundColor: 'lightgrey',
    padding: 16,
    borderRadius: 2,
    marginBottom: 12,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  variableText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF5C5C',
  },
});
