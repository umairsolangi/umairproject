import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {TextInput, ActivityIndicator} from 'react-native-paper';

const AdminAddMapping = ({navigation, route}) => {
  const {item, apivendor} = route.params;
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mappings, setMappings] = useState({});
  const [existingmapping, setExistingMapping] = useState([]);
  const [checkmapping, setCheckMapping] = useState(false);

  useEffect(() => {
    getVariables();
  }, []);

  const getVariables = async () => {
    try {
      const [variablesResponse, mappingsResponse] = await Promise.all([
        fetch(`${url}/variables`),
        fetch(`${url}/mappings/${item.id}/${apivendor.id}`),
      ]);

      const variablesData = await variablesResponse.json();
      const mappingsData = await mappingsResponse.json();

      if (variablesData.success) {
        setVariables(variablesData.data);
      }

      if (mappingsData.success) {
        setExistingMapping(mappingsData.data);
        setCheckMapping(true);

        const initialMappings = {};
        mappingsData.data.forEach(mapping => {
          initialMappings[mapping.tags] = mapping.api_values;
        });
        setMappings(initialMappings);
      }
    } catch (error) {
      console.error('Error fetching variables or mappings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMappingChange = (tag, value) => {
    setMappings(prev => ({...prev, [tag]: value}));
  };

  const handleUpdateMapping = async (tag, value, id) => {
    setMappings(prev => ({...prev, [tag]: value}));
    try {
      const response = await fetch(`${url}/admin/mapping/${id}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({api_values: value}),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Successfully submitted:', result);
        alert('Mapping Successfully Updated!');
      } else {
        console.error('Server error:', result);
        alert('Failed to update mapping');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting');
    }
  };

  const handleSave = async () => {
    const payload = {
      branch_ID: item.id,
      apivendor_ID: apivendor.id,
      mappings: variables.map(variable => ({
        variable_ID: variable.id,
        api_values: mappings[variable.tags] || '',
      })),
    };

    try {
      const response = await fetch(`${url}/admin/mappings/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert('Mappings saved successfully!');
      } else {
        alert('Failed to save mappings.');
      }
    } catch (error) {
      console.error('Error saving mappings:', error);
      alert('An error occurred while saving mappings.');
    }
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#FF5C5C" />
      </View>
    );
  }

  return (
    <ScrollView style={{padding: 20, backgroundColor: '#fff', flex: 1}}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          marginBottom: 20,
          color: '#FF5C5C',
        }}>
        {checkmapping ? 'Branch is Already Mapped' : 'Add Variable Mappings'}
      </Text>

      {variables.map(variable => {
        const existingMapping = existingmapping.find(
          mapping => mapping.variable_ID === variable.id,
        );
        return (
          <View key={variable.id} style={{marginBottom: 15}}>
            <Text style={{marginBottom: 5, color: '#555'}}>
              Tag:{' '}
              <Text style={{fontWeight: 'bold', color: '#000'}}>
                {variable.tags}
              </Text>
             
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Enter Mapping"
              value={
                mappings[variable.tags] !== undefined
                  ? mappings[variable.tags]
                  : existingMapping
                  ? existingMapping.api_values
                  : ''
              }
              onChangeText={text => handleMappingChange(variable.tags, text)}
            />
            {existingMapping && (
              <TouchableOpacity
                style={{
                  backgroundColor: 'grey',
                  padding: 8,
                  borderRadius: 5,
                  marginTop: 10,
                  alignItems: 'center',
                }}
                onPress={() =>
                  handleUpdateMapping(
                    variable.tags,
                    mappings[variable.tags],
                    existingMapping.id,
                  )
                }>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      {
  !checkmapping ? (
    <TouchableOpacity
      onPress={handleSave}
      style={{
        backgroundColor: '#FF5C5C',
        padding: 15,
        borderRadius: 10,
        marginBottom: 50,
        alignItems: 'center',
      }}>
      <Text style={{color: 'white', fontWeight: 'bold'}}>Save Mappings</Text>
    </TouchableOpacity>
  ) : <TouchableOpacity
      onPress={handleSave}
      style={{
        backgroundColor: 'white',
        padding: 1,
        borderRadius: 10,
        marginBottom: 50,
        alignItems: 'center',
      }}>
    </TouchableOpacity>
}

    </ScrollView>
  );
};

export default AdminAddMapping;
