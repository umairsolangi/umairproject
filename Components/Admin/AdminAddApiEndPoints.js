import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Modal, FlatList} from 'react-native';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminAddApiEndPoints = ({navigation, route}) => {
  const {item, apivendor} = route.params;
  console.log('ApiVendor ID', apivendor.id);
  const [modalVisible, setModalVisible] = useState(false);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(null);
  const [isexistingmethdos, setExistingMethods] = useState(false);

  const [formData, setFormData] = useState({
    method_name: '',
    http_method: '',
    endpoint: '',
    description: '',
  });

  useEffect(() => {
    getMethodsTemplate();
  }, []);

  const getMethodsTemplate = async () => {
    try {
      const [templateRes, vendorMethodsRes] = await Promise.all([
        fetch(`${url}/admin/apimethod-templates`),
        fetch(`${url}/admin/apivendor/${apivendor.id}/methods`),
      ]);

      const [templateData, vendorMethodsData] = await Promise.all([
        templateRes.json(),
        vendorMethodsRes.json(),
      ]);

      let finalMethods = [];

      if (templateData.data) {
        setExistingMethods(vendorMethodsData.status);
        const templates = templateData.data;
        const vendorMethods = vendorMethodsData.status
          ? vendorMethodsData.methods
          : [];

        // Match template and vendor data
        finalMethods = templates.map(template => {
          const existing = vendorMethods.find(
            vm => vm.method_name === template.method_name,
          );

          return {
            method_name: template.method_name,
            http_method: template.http_method,
            endpoint: existing ? existing.endpoint : '',
            description: existing ? existing.description : '',
            isExisting: !!existing, // used for edit icon display
            id: existing?.id || null,
          };
        });

        setMethods(finalMethods);
        console.log('Final merged methods:', finalMethods);
      }
    } catch (error) {
      console.error('Error fetching methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const addclientendpoints = (methodDetails, index) => {
    setSelectedMethodIndex(index);
    setFormData({
      method_name: methodDetails.method_name,
      http_method: methodDetails.http_method,
      endpoint: methodDetails.endpoint || '',
      description: methodDetails.description || '',
    });
    setModalVisible(true);
  };

  const handleAddMethod = async val => {
    if (selectedMethodIndex !== null) {
      var updatedMethods = [...methods];
      updatedMethods[selectedMethodIndex].endpoint = formData.endpoint;
      updatedMethods[selectedMethodIndex].description = formData.description;
      setMethods(updatedMethods);
      var saveupdatedmethod = {
        method_name: updatedMethods[selectedMethodIndex].method_name,
        http_method: updatedMethods[selectedMethodIndex].http_method,
        endpoint: updatedMethods[selectedMethodIndex].endpoint,
        description: updatedMethods[selectedMethodIndex].description,
      };
      if (val == 'edit') {
        console.log('methodid', updatedMethods[selectedMethodIndex].id);

        try {
          const response = await fetch(
            `${url}/admin/apimethods/${updatedMethods[selectedMethodIndex].id}`,
            {
              method: 'put',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(saveupdatedmethod),
            },
          );

          const result = await response.json();

          if (response.ok) {
            console.log('Successfully submitted:', result);
            alert('API Methods Successfully Updated!');
          } else {
            console.error('Server error:', result);
            alert('Failed to update methods');
          }
        } catch (error) {
          console.error('Submission error:', error);
          alert('An error occurred while submitting');
        }
      }
    }

    setModalVisible(false);
    setFormData({
      method_name: '',
      http_method: '',
      endpoint: '',
      description: '',
      id: null,
    });
    setSelectedMethodIndex(null);
  };

  const handelsubmit = async () => {
    console.log('Submitting Methods:', methods);

    try {
      const response = await fetch(
        `${url}/admin/apivendor/${apivendor.id}/methods`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({methods}),
        },
      );

      const result = await response.json();

      if (response.ok) {
        console.log('Successfully submitted:', result);
        alert('API Methods Successfully submitted!');
      } else {
        console.error('Server error:', result);
        alert('Failed to update methods');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting');
    }
  };

  const renderItem = ({item, index}) => (
    <View
      style={{
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
      }}>
      <View style={{flex: 1}}>
        <Text style={{fontWeight: 'bold', color: '#FF5C5C'}}>
          Function Name: {item.method_name}
        </Text>
        <Text style={{color: '#555'}}>HTTP Method: {item.http_method}</Text>
        <Text style={{color: '#555'}}>Endpoint: {item.endpoint}</Text>
        <Text style={{color: '#555'}}>{item.description}</Text>

        <TouchableOpacity
          onPress={() => addclientendpoints(item, index)}
          style={{marginTop: 5}}>
          <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              textDecorationLine: 'underline',
            }}>
            {item.isExisting ? '' : 'Add Your Endpoints'}
          </Text>
        </TouchableOpacity>
      </View>

      {item.isExisting && (
        <TouchableOpacity onPress={() => addclientendpoints(item, index)}>
          <Icon name="edit" size={24} color="#FF5C5C" />
        </TouchableOpacity>
      )}
    </View>
  );
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#FF5C5C" />
      </View>
    );
  } else
    return (
      <View style={{flex: 1, padding: 20, backgroundColor: '#fff'}}>
        {isexistingmethdos && (
          <Text
            style={{
              color: 'red',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 10,
            }}>
            Methods are already inserted
          </Text>
        )}

        <FlatList
          data={methods}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{textAlign: 'center', color: '#888'}}>
              No methods added yet.
            </Text>
          }
        />

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 20,
            }}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 15,
                padding: 20,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#FF5C5C',
                  marginBottom: 10,
                }}>
                Add API Endpoints
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  color: 'grey',
                  marginBottom: 10,
                }}>
                Function Name:{formData.method_name}
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  color: 'grey',
                  marginBottom: 10,
                }}>
                HTTP Method:{formData.http_method}
              </Text>

              <TextInput
                mode="outlined"
                label="Endpoint"
                placeholder="/api/vendor/register"
                value={formData.endpoint}
                onChangeText={text =>
                  setFormData({...formData, endpoint: text})
                }
                style={{marginBottom: 10}}
              />
              <TextInput
                mode="outlined"
                label="Description"
                placeholder="Short description"
                value={formData.description}
                onChangeText={text =>
                  setFormData({...formData, description: text})
                }
                style={{marginBottom: 10}}
              />

              {isexistingmethdos ? (
                <TouchableOpacity
                  onPress={() => handleAddMethod('edit')}
                  style={{
                    backgroundColor: '#FF5C5C',
                    padding: 12,
                    borderRadius: 10,
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleAddMethod()}
                  style={{
                    backgroundColor: '#FF5C5C',
                    padding: 12,
                    borderRadius: 10,
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: '#ccc',
                  padding: 12,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {isexistingmethdos ? (
          <TouchableOpacity></TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handelsubmit}
            style={{
              backgroundColor: '#FF5C5C',
              padding: 14,
              borderRadius: 10,
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    );
};

export default AdminAddApiEndPoints;
