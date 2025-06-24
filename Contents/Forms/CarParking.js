import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, RadioButton, TextInput } from 'react-native-paper';

function CarParking() {
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [allVehicle, setAllVehicle] = useState([]);
  const [parkOutVehicle, setParkOutVehicle] = useState([]);
  const [countParkIn, setCountParkIn] = useState(0);
  const [countAmount, setCountAmount] = useState(0);
  const [message, setMessage] = useState('');

  const [tab, setTab] = useState('all');

  // Filter lists
  const allCars = allVehicle.filter(v => v.vehicleType === 'Car');
  const allBikes = allVehicle.filter(v => v.vehicleType === 'Bike');

  const handleParkIn = () => {
    if (!vehicleNo.trim()) {
      setMessage('Please enter vehicle number');
      return;
    }

    const exists = allVehicle.find(v => v.vehicleNo === vehicleNo.trim());
    if (exists) {
      setMessage('Vehicle is already parked');
      return;
    }

    const obj = {
      id: Date.now(),
      vehicleNo: vehicleNo.trim(),
      vehicleType
    };

    setAllVehicle(prev => [...prev, obj]);
    setCountParkIn(prev => prev + 1);
    setVehicleNo('');
    Alert.alert('Vehicle successfully parked');
  };

  const handleParkOut = id => {
    const vehicle = allVehicle.find(v => v.id === id);
    if (!vehicle) return;

    setParkOutVehicle(prev => [...prev, vehicle]);
    setAllVehicle(prev => prev.filter(v => v.id !== id));
    setCountParkIn(prev => prev - 1);
    setCountAmount(prev => prev + 50);
  };

  const renderVehicleItem = ({ item }) => (
    <View style={styles.vehicleCard}>
      <View>
        <Text style={styles.text}>{item.vehicleNo}</Text>
        <Text style={styles.text}>{item.vehicleType}</Text>
      </View>
      <Button
        onPress={() => handleParkOut(item.id)}
        mode="contained"
        style={styles.parkOutBtn}>
        Park Out
      </Button>
    </View>
  );

  const renderParkOutItem = ({ item }) => (
    <View style={styles.vehicleCard}>
      <Text style={styles.text}>
        Vehicle No: {item.vehicleNo}, Type: {item.vehicleType}
      </Text>
    </View>
  );

  let filteredList = [];
  if (tab === 'all') filteredList = allVehicle;
  else if (tab === 'cars') filteredList = allCars;
  else if (tab === 'bikes') filteredList = allBikes;
  else filteredList = parkOutVehicle;

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Car Parking System</Text>
      </View>

      <View style={styles.inputSection}>
        <TextInput
          label="Vehicle No"
          value={vehicleNo}
          onChangeText={setVehicleNo}
          mode="outlined"
          placeholder="Enter vehicle number"
          style={{ width: '90%' }}
        />
        <Text style={styles.message}>{message}</Text>
      </View>

      <View style={styles.radioSection}>
        <RadioButton
          value="Car"
          status={vehicleType === 'Car' ? 'checked' : 'unchecked'}
          onPress={() => setVehicleType('Car')}
        />
        <Text style={styles.radioText}>Car</Text>
        <RadioButton
          value="Bike"
          status={vehicleType === 'Bike' ? 'checked' : 'unchecked'}
          onPress={() => setVehicleType('Bike')}
        />
        <Text style={styles.radioText}>Bike</Text>
        <Button
          mode="contained"
          onPress={handleParkIn}
          style={styles.parkInBtn}>
          Park In
        </Button>
      </View>

      <View style={styles.tabSection}>
        <Button textColor='white' onPress={() => setTab('all')} style={tab === 'all' ? styles.activeTab : styles.inactiveTab}>All</Button>
        <Button textColor='white' onPress={() => setTab('cars')} style={tab === 'cars' ? styles.activeTab : styles.inactiveTab}>Cars</Button>
        <Button textColor='white' onPress={() => setTab('bikes')} style={tab === 'bikes' ? styles.activeTab : styles.inactiveTab}>Bikes</Button>
        <Button textColor='white' onPress={() => setTab('parkout')} style={tab === 'parkout' ? styles.activeTab : styles.inactiveTab}>Parked Out</Button>
      </View>

      <View style={styles.stats}>
        <Text style={styles.text}>Total Parked In: {countParkIn}</Text>
        <Text style={styles.text}>Earnings: Rs. {countAmount}</Text>
      </View>

      <FlatList
        data={filteredList}
        renderItem={tab === 'parkout' ? renderParkOutItem : renderVehicleItem}
        keyExtractor={item => item.id.toString()}
        style={{ marginTop: 10 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor:'white'
  },
  header: {
    height: 60,
    backgroundColor: 'darkred',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  inputSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  message: {
    marginTop: 5,
    color: 'darkred',
  },
  radioSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  radioText: {
    fontSize: 16,
    marginRight: 10,
    color:'black'
  },
  parkInBtn: {
    backgroundColor: 'darkgreen',
    borderRadius: 10,
    marginLeft: 10,
  },
  tabSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  activeTab: {
    backgroundColor: 'blue',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  inactiveTab: {
    backgroundColor: 'darkred',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  vehicleCard: {
    backgroundColor: '#eee',
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'darkred',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color:'black'
  },
  parkOutBtn: {
    backgroundColor: 'darkred',
    borderRadius: 10,
  },
});

export default CarParking;
