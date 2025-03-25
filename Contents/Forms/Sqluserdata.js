import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';

// Open or create the database
const db = openDatabase(
  {name: 'MapB.db', location: 'default'},
  () => console.log('Database opened successfully!'),
  (error) => console.error('Error opening database:', error)
);

const Sqluserdata = () => {
  const [userName, setUserName] = useState('');
  const [userid, setuserID] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');
  const [userData, setUserData] = useState([]);
  const [userById, setUserById] = useState(null);

  // Create the table when the component is mounted
  useEffect(() => {
    db.transaction((txt) => {
      txt.executeSql(
        'CREATE TABLE IF NOT EXISTS person (Id INTEGER PRIMARY KEY, Name TEXT)',
        [],
        () => console.log('Table successfully created'),
        (error) => console.error('Error creating table:', error)
      );
    });
  }, []);

  // Function to add a person to the database
  const addPerson = () => {
    if (!userid || !userName) {
      setMessage('Please enter all fields');
      setMessageColor('red');
      return;
    }

    db.transaction((txt) => {
      txt.executeSql(
        'INSERT INTO person (Id, Name) VALUES (?, ?)',
        [parseInt(userid), userName],
        () => {
          console.log('Data successfully inserted');
          setMessage('Data inserted successfully!');
          setMessageColor('green');
          setuserID('');
          setUserName('');
        },
        (error) => {
          console.log(error.message);
          setMessage('Error inserting data');
          setMessageColor('red');
        }
      );
    });
  };

  // Function to show data by ID
  const showById = () => {
    if (!userid) {
      setMessage('Please enter a User ID');
      setMessageColor('red');
      return;
    }

    db.transaction((txt) => {
      txt.executeSql(
        'SELECT * FROM person WHERE Id = ?',
        [parseInt(userid)],
        (txt, results) => {
          if (results.rows.length > 0) {
            const user = results.rows.item(0);
            setUserById(user);
            setMessage('');
          } else {
            setUserById(null);
            setMessage('No user found with this ID');
            setMessageColor('red');
          }
        },
        (error) => {
          console.log(error.message);
          setMessage('Error fetching data');
          setMessageColor('red');
        }
      );
    });
  };

  // Function to show all data
  const showAllData = () => {
    db.transaction((txt) => {
      txt.executeSql(
        'SELECT * FROM person',
        [],
        (txt, results) => {
          const rows = [];
          for (let i = 0; i < results.rows.length; i++) {
            rows.push(results.rows.item(i));
          }
          setUserData(rows);
          setMessage('');
        },
        (error) => {
          console.log(error.message);
          setMessage('Error fetching all data');
          setMessageColor('red');
        }
      );
    });
  };

  return (
    <View
      style={{
        borderWidth: 2,
        borderRadius: 10,
        height: 800,
        margin: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <Text style={{fontSize: 40, fontWeight: 'bold', alignSelf: 'center'}}>
          User Data
        </Text>

        <TextInput
          value={userid}
          onChangeText={setuserID}
          mode="outlined"
          label="User ID"
          placeholder="Enter User ID"
          style={{width: 300}}
        />

        <TextInput
          value={userName}
          onChangeText={setUserName}
          mode="outlined"
          label="Your Name"
          placeholder="Enter Your Name"
          style={{width: 300}}
        />

        <Text style={{alignSelf: 'center', color: messageColor}}>{message}</Text>

        <Button
          mode="contained"
          uppercase={true}
          onPress={addPerson}
          style={{
            backgroundColor: 'darkgreen',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            width: 200,
          }}>
          Add Data
        </Button>

        <Button
          mode="contained"
          uppercase={true}
          onPress={showById}
          style={{
            backgroundColor: 'darkblue',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            width: 200,
          }}>
          Show By ID
        </Button>

        <Button
          mode="contained"
          uppercase={true}
          onPress={showAllData}
          style={{
            backgroundColor: 'darkred',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            width: 200,
          }}>
          Show All Data
        </Button>

        <ScrollView style={{marginTop: 20, width: 300}}>
          {userById && (
            <Text style={{fontSize: 18, marginBottom: 10}}>
              User Found: ID: {userById.Id}, Name: {userById.Name}
            </Text>
          )}
          {userData.length > 0 &&
            userData.map((user, index) => (
              <Text key={index} style={{fontSize: 16, marginBottom: 5}}>
                ID: {user.Id}, Name: {user.Name}
              </Text>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Sqluserdata;
