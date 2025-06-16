import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import {TextInput, RadioButton, Button} from 'react-native-paper';

const Adminintegrationform = ({route}) => {
  const {item} = route.params;

  const [formData, setFormData] = useState({
    api_base_url: '',
    api_auth_method: '',
    api_key: '',
    api_version: '',
    response_format: 'JSON',
    vendor_integration_status: 'Active',
    branches_ID: item.id,
  });

  const [loading, setLoading] = useState(true);
  const [alreadyIntegrated, setAlreadyIntegrated] = useState(false);
  const [integrationDetails, setIntegrationDetails] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    
    fetchIntegrationDetails();
  }, []);

  const handleChange = (key, value) => {
    setFormData({...formData, [key]: value});
  };
  const fetchIntegrationDetails = async () => {
      try {
        const response = await fetch(`${url}/admin/api-vendor/${item.id}`);
        const json = await response.json();
        if (json.status) {
          setAlreadyIntegrated(true);
          setIntegrationDetails(json.data);
        } else {
          setAlreadyIntegrated(false);
        }
      } catch (error) {
        console.error('API call failed:', error);
        setAlreadyIntegrated(false);
      } finally {
        setLoading(false);
      }
    };

  const handleOpenIntegration = () => {
    setFormData({
      api_base_url: integrationDetails.api_base_url,
      api_auth_method: integrationDetails.api_auth_method,
      api_key: integrationDetails.api_key,
      api_version: integrationDetails.api_version,
      response_format: "JSON",
      vendor_integration_status: 'Active',
      branches_ID: item.id,
    });
    setModalVisible(true);
  };
  const handelsubmit = async () => {
    try {
      const response = await fetch(`${url}/admin/apivendor/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const json = await response.json();
      if (json.status) {
        Alert.alert('Success', json.message || 'Integration successful');
      } else {
        Alert.alert('Failed', json.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submit failed:', error);
      Alert.alert('Error', 'Failed to submit data');
    }
  };

   const handelupdateapivendor = async() => {
    console.log('updated data',formData)

     try {
      const response = await fetch(`${url}/admin/apivendor/${integrationDetails.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const json = await response.json();
      if (json.status) {
        Alert.alert('Success', json.message || 'Integration successful');
      } else {
        Alert.alert('Failed', json.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submit failed:', error);
      Alert.alert('Error', 'Failed to submit data');
    }
fetchIntegrationDetails()
    setModalVisible(false)
   
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5C5C" />
      </View>
    );
  }

  if (alreadyIntegrated) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageTitle}>
            Your Site is already integrated
          </Text>
        <View style={styles.messagesubContainer}>
          
          <Text style={styles.messageText}>
            Base URL: {integrationDetails.api_base_url}
          </Text>
         
          <Text style={styles.messageText}>
            Auth Method: {integrationDetails.api_auth_method}
          </Text>
          <Text style={styles.messageText}>
            API Key: {integrationDetails.api_key}
          </Text>
          <Text style={styles.messageText}>
            API Version: {integrationDetails.api_version}
          </Text>
          <Text style={styles.messageText}>
            Response Format: {integrationDetails.response_format}
          </Text>
          <Text style={styles.messageText}>
            Status: {integrationDetails.vendor_integration_status}
          </Text>
          <View
            style={{
              alignSelf: 'flex-end',
              position: 'absolute',
              top: 110,
              right: 20,
            }}>
            <Button
              mode="contained"
              onPress={handleOpenIntegration}
              style={styles.button}
              labelStyle={styles.buttonLabel}>
              Edit
            </Button>
          </View>
        </View>
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit API Details</Text>
              {[
                'api_base_url',
                'api_auth_method',
                'api_key',
                'api_version',
              ].map(field => (
                <TextInput
                  key={field}
                  label={field.replace(/_/g, ' ')}
                  value={formData[field]}
                  onChangeText={text => handleChange(field, text)}
                  style={styles.input}
                  mode="outlined"
                />
              ))}

              {/* Radio buttons for response_format */}
             {/*  <View style={styles.radioGroup}>
                <Text style={styles.radioLabel}>Response Format</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    handleChange('response_format', value)
                  }
                  value={formData.response_format}>
                  <View style={styles.radioItem}>
                    <RadioButton value="JSON" />
                    <Text style={{color: 'black'}}>JSON</Text>
                  </View>
                  {/* <View style={styles.radioItem}>
                    <RadioButton value="XML" />
                    <Text style={{color: 'black'}}>XML</Text>
                  </View> 
                </RadioButton.Group>
              </View>*/}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handelupdateapivendor}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
               <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.actionButton]}
            >
              <Text style={[styles.actionButtonText, { color: 'black' }]}>Close</Text>
            </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={{flex:1,justifyContent:'center'}}>
            {['api_base_url', 'api_auth_method', 'api_key', 'api_version'].map(
        field => (
          <TextInput
            key={field}
            label={field.replace(/_/g, ' ')}
            value={formData[field]}
            onChangeText={text => handleChange(field, text)}
            style={styles.input}
            mode="outlined"
          />
        ),
      )}

      {/* Radio buttons for response_format */}
     {/*  <View style={styles.radioGroup}>
        <Text style={styles.radioLabel}>Response Format</Text>
        <RadioButton.Group
          onValueChange={value => handleChange('response_format', value)}
          value={formData.response_format}>
          <View style={styles.radioItem}>
            <RadioButton value="JSON" />
            <Text style={{color: 'black'}}>JSON</Text>
          </View>
          {/* <View style={styles.radioItem}>
            <RadioButton value="XML" />
            <Text style={{color: 'black'}}>XML</Text>
          </View> 
        </RadioButton.Group>
      </View> */}

      <TouchableOpacity style={styles.submitButton} onPress={handelsubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
        </View>
      
    </ScrollView>
  );
};

export default Adminintegrationform;

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding: 16,
    
  },
  input: {
    marginBottom: 12,
    
  },
  submitButton: {
    backgroundColor: '#FF5C5C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesubContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#f5f0f0',
    elevation: 6,
  },
  messageTitle: {
    marginTop:20,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F8544B',
  },
  messageText: {
    fontSize: 13,
    marginBottom: 4,
    color: 'grey',
  },
  radioGroup: {
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#F8544B',
    borderRadius: 8,
    paddingVertical: 4,
    width: 120,
  },
  buttonLabel: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF5C5C',
    textAlign: 'center',
  },
  actionButton: {
    
   
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
