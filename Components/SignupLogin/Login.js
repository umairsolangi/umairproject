import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('ar@gmail.com');
  const [password, setPassword] = useState('0000');

  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onPressButton = async () => {
    if (!email || !password) {
      setModalMessage('Please fill all fields');
      setModalVisible(true);
      return;
    }

    const user = {email, password};

    try {
      setLoading(true);
      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        if (data.message === 'Login successful') {
          if (data.user.role === 'vendor') {
            navigation.navigate('Vendor Dashboard', {vendordata: data.user});
          } else if (data.user.role === 'admin') {
            navigation.navigate('Admin Dashboard', {Admindata: data.user});
          } else if (data.user.role === 'customer') {
            navigation.navigate('Customer Dashboard', {
              customerdata: data.user,
            });
          } else if (data.user.role === 'organization') {
            navigation.navigate('Organization Dashboard', {
              customerdata: data.user,
            });
          } else if (data.user.role === 'deliveryboy') {
            navigation.navigate('Rider Dashboard', {userdata: data.user});
          }
        }
      } else {
        setErrorMessage('Login Failed');
        setErrorModalVisible(true);
        setTimeout(() => setErrorModalVisible(false), 3000);
      }
    } catch (error) {
      setErrorMessage('Failed to Login:', error);
      setErrorModalVisible(true);
      setTimeout(() => setErrorModalVisible(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require('../../Assets/Images/Logo2-png.png')}
          style={styles.logo}
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          label="Email"
          placeholder="Enter Email"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          label="Password"
          placeholder="Enter Password"
          style={styles.input}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#F8544B"
            style={{marginTop: 30}}
          />
        ) : (
          <Button
            mode="contained"
            uppercase={true}
            onPress={onPressButton}
            style={styles.loginButton}>
            Login
          </Button>
        )}

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don’t have an account?</Text>
          <Button
            onPress={() => navigation.navigate('Signup Options')}
            textColor="#F8544B"
            style={{marginLeft: -10}}>
            SignUp
          </Button>
        </View>
      </View>

      <Modal
        transparent
        visible={errorModalVisible}
        animationType="slide"
        onRequestClose={() => setErrorModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                marginTop: 10,
                textAlign: 'center',
                color: 'black',
              }}>
              {errorMessage}
            </Text>

            <Button
              mode="contained"
              onPress={() => setErrorModalVisible(false)}
              style={{marginTop: 20, backgroundColor: '#F8544B'}}>
              OK
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 260,
    height: 200,
  },
  input: {
    width: 300,
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: '#F8544B',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 30,
    width: 150,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Login;
