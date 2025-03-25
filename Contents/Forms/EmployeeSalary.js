import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, RadioButton, Button, Card, Title } from 'react-native-paper';

const EmployeeSalary = () => {
  const [name, setName] = useState('');
  const [mob, setMobNo] = useState('');
  const [gender, setGender] = useState();
  const [maritalStatus, setMaritalStatus] = useState('');
  const [lecture, setLecture] = useState('');
  const [result, setResult] = useState('');

  function validate() {
    if (maritalStatus === 'married' && lecture === 'seniorlecture') {
      setResult(
        'BASIC SALARY: SALARY FOR MARRIED AND SENIOR LECTURER IS 50,000 AND ITS MARRIED BONUS IS 10%',
      );
    } else {
      setResult(
        'BASIC SALARY: 90,000 FOR JUNIOR LECTURER. IF MARRIED, STATUS THEN 15% BONUS IS ADDED',
      );
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Employee Salary Calculator</Title>

          <TextInput
            label="Name"
            mode="outlined"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            label="Mobile No"
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            value={mob}
            onChangeText={setMobNo}
          />

          <View style={styles.radioGroup}>
            <Text style={styles.groupLabel}>Gender:</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setGender(newValue)}
              value={gender}
            >
              <View style={styles.radioItem}>
                <RadioButton value="male" />
                <Text style={styles.radioLabel}>Male</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="female" />
                <Text style={styles.radioLabel}>Female</Text>
              </View>
            </RadioButton.Group>
          </View>

          <View style={styles.radioGroup}>
            <Text style={styles.groupLabel}>Marital Status:</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setMaritalStatus(newValue)}
              value={maritalStatus}
            >
              <View style={styles.radioItem}>
                <RadioButton value="married" />
                <Text style={styles.radioLabel}>Married</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="unmarried" />
                <Text style={styles.radioLabel}>Unmarried</Text>
              </View>
            </RadioButton.Group>
          </View>

          <View style={styles.radioGroup}>
            <Text style={styles.groupLabel}>Lecturer Type:</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setLecture(newValue)}
              value={lecture}
            >
              <View style={styles.radioItem}>
                <RadioButton value="seniorlecture" />
                <Text style={styles.radioLabel}>Senior Lecturer</Text>
              </View>
              <View style={styles.radioItem}>
                <RadioButton value="juniorlecturer" />
                <Text style={styles.radioLabel}>Junior Lecturer</Text>
              </View>
            </RadioButton.Group>
          </View>

          <Button
            mode="contained"
            onPress={validate}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Calculate Salary
          </Button>

          <Text style={styles.resultText}>{result}</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default EmployeeSalary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 10,
    elevation: 4,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff5722',
  },
  input: {
    marginBottom: 15,
  },
  radioGroup: {
    marginBottom: 15,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioLabel: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    marginTop: 15,
    backgroundColor: '#ff5722',
  },
  buttonContent: {
    paddingVertical: 10,
  },
  resultText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
});
