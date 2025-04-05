import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, Modal} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('ali@gmail.com');
  const [password, setPassword] = useState('0000');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const onPressButton = async () => {
    if (!email || !password) {
      setModalMessage('Please fill all fields');
      setModalVisible(true);
      return;
    }

    const user = { email, password };

    try {
      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user),
      });

      if (response.ok) {
        var data = await response.json();
        console.log(data);

        if (data.message === 'Login successful') {
          setModalMessage('Login Successful');
          
          setTimeout(() => {
            setModalVisible(false);
            if (data.user.role === 'vendor') {
              navigation.navigate('Vendor Dashboard', { vendordata: data.user });
            } else if (data.user.role === 'admin') {
              navigation.navigate('Admin Dashboard', { Admindata: data.user });
            } else {
              navigation.navigate('Customer Dashboard', { customerdata: data.user });
            }
          }, 1000);
        } else {
          setModalMessage('Invalid credentials');
          setModalVisible(true);
          setTimeout(() => {
            setModalVisible(false);
          }, 1000);
        }
      } else {
        setModalMessage('Login Failed');
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error login:', error);
      setModalMessage('Failed to Login');
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image source={require('../../Assets/Images/Logo2-png.png')} style={styles.logo} />

        <TextInput value={email} onChangeText={setEmail} mode="outlined" label="Email" placeholder="Enter Email" style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} mode="outlined" label="Password" placeholder="Enter Password" style={styles.input} secureTextEntry />

        <Button mode="contained" uppercase={true} onPress={onPressButton} style={styles.loginButton}>
          Login
        </Button>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don’t have an account?</Text>
          <Button onPress={() => navigation.navigate('Signup Options')} textColor='#F8544B'>
            SignUp
          </Button>
        </View>
      </View>

      {/* Modal for success or error messages */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
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
    marginTop:20
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
