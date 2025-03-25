import React, {useEffect, useState} from 'react';
import {View, Text, Alert, FlatList, Image, StyleSheet} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase(
  {name: 'UserInfo.db', location: 'default'},
  () => console.log('Database opened successfully!'),
  (error) => console.error('Error opening database:', error)
);

function UseImageFromGallery() {
  useEffect(() => {
    db.transaction((txt) => {
      txt.executeSql(
        'CREATE TABLE IF NOT EXISTS Users (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, City TEXT, Age TEXT, Department TEXT)',
        [],
        () => console.log('Table successfully created'),
        (error) => console.error('Error creating table:', error)
      );
    });
  }, []);

  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [department, setDepartment] = useState('');
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  // Function to pick an image
  const getImage = () => {
    ImagePicker.launchCamera({mediaType: 'photo'}, (resp) => {
      if (resp.didCancel) {
        console.log('User canceled image selection');
      } else if (resp.assets && resp.assets[0]) {
        setImageUri(resp.assets[0].uri);
      } else {
        console.error('Error picking image:', resp.errorMessage);
      }
    });
  };

  // Function to add a user
  const addPerson = () => {
    if (!name || !city || !age || !department) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    db.transaction((txt) => {
      txt.executeSql(
        'INSERT INTO Users (Name, City, Age, Department) VALUES (?, ?, ?, ?)',
        [name, city, age, department],
        () => {
          console.log('Data successfully inserted');
          Alert.alert('Success', 'User added successfully!');
          setName('');
          setCity('');
          setAge('');
          setDepartment('');
          fetchUsers(); // Refresh user list
        },
        (error) => console.error('Error inserting data:', error)
      );
    });
  };

  // Function to fetch users from the database
  const fetchUsers = () => {
    db.transaction((txt) => {
      txt.executeSql(
        'SELECT * FROM Users',
        [],
        (txt, results) => {
          const rows = results.rows;
          const usersList = [];
          for (let i = 0; i < rows.length; i++) {
            usersList.push(rows.item(i));
          }
          setUsers(usersList);
          setShowUsers(true);
        },
        (error) => console.error('Error fetching data:', error)
      );
    });
  };

  // Function to delete a user
  const deleteUser = (id) => {
    db.transaction((txt) => {
      txt.executeSql(
        'DELETE FROM Users WHERE Id = ?',
        [id],
        () => {
          console.log('User deleted successfully');
          Alert.alert('Success', 'User deleted successfully!');
          fetchUsers(); // Refresh user list
        },
        (error) => console.error('Error deleting user:', error)
      );
    });
  };

  // Render each user item
  const renderItem = ({item}) => (
    <View style={styles.userCard}>
      <Text style={styles.userText}>Name: {item.Name}</Text>
      <Text style={styles.userText}>City: {item.City}</Text>
      <Text style={styles.userText}>Age: {item.Age}</Text>
      <Text style={styles.userText}>Department: {item.Department}</Text>
      <Button
        mode="contained"
        onPress={() => deleteUser(item.Id)}
        style={styles.deleteButton}>
        Delete
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information</Text>
      <Image
        source={{uri: imageUri}}
        style={styles.image}
      />
      <Button
        mode="contained"
        onPress={getImage}
        style={styles.button}>
        Upload Image
      </Button>
      <TextInput
        value={name}
        onChangeText={setName}
        mode="outlined"
        label="Name"
        placeholder="Enter Name"
        style={styles.input}
      />
      <TextInput
        value={city}
        onChangeText={setCity}
        mode="outlined"
        label="City"
        placeholder="Enter City"
        style={styles.input}
      />
      <TextInput
        value={age}
        onChangeText={setAge}
        mode="outlined"
        label="Age"
        placeholder="Enter Age"
        style={styles.input}
      />
      <TextInput
        value={department}
        onChangeText={setDepartment}
        mode="outlined"
        label="Department"
        placeholder="Enter Department"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={addPerson}
        style={styles.button}>
        Add User
      </Button>
      <Button
        mode="contained"
        onPress={fetchUsers}
        style={styles.button}>
        Show Users
      </Button>

      {showUsers && (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.Id.toString()}
          style={styles.userList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    backgroundColor: 'gray',
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
    backgroundColor: 'darkgreen',
  },
  input: {
    marginBottom: 10,
    width: '100%',
  },
  userList: {
    marginTop: 20,
    backgroundColor: 'lightgreen',
    borderRadius: 10,
    padding: 10,
  },
  userCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: 'red',
  },
});

export default UseImageFromGallery;
