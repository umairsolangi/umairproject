import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Pressable,
  Modal,
} from 'react-native';
import {TextInput, Button, RadioButton} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VendorAddItem = ({navigation, route}) => {
  const branchData = route.params.item;
  const shopCategoryId = route.params.shopcatagory;
  const shopdetails = route.params.shopdetails;

  const [shopCategory, setShopCategory] = useState(shopCategoryId || '');
  const [itemCategories, setItemCategories] = useState([]);
  const [itemCategory, setItemCategory] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [timesensitive, setTimesensitive] = useState('');
  const [preparationTime, setPreparationTime] = useState('');
  const [price, setPrice] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [itemPicture, setItemPicture] = useState(null);
  const [ImagemodalVisible, setImageModalVisible] = useState(false);

  useEffect(() => {
    if (shopCategory) {
      fetch(`${url}/itemcategories/${shopCategory}`)
        .then(res => res.json())
        .then(data => setItemCategories(data.categories || []))
        .catch(err => console.error('Error fetching item categories:', err));
    }
  }, [shopCategory]);

  useEffect(() => {
    if (itemCategory) {
      fetch(`${url}/PredefinedAttributes/${itemCategory}`)
        .then(res => res.json())
        .then(data => {
          setAttributes(data.attributes);
          setSelectedAttributes([]); // Reset attributes when category changes
        })
        .catch(err => console.error('Error fetching attributes:', err));

      fetch(`${url}/item-variations/${itemCategory}`)
        .then(res => res.json())
        .then(data => {
          setVariations(data.variations || []);
          setSelectedVariation(null); // Reset variation when category changes
        })
        .catch(err => console.error('Error fetching variations:', err));
    }
  }, [itemCategory]);

  const handleAttributeChange = (key, value) => {
    setSelectedAttributes(prev => {
      const existingIndex = prev.findIndex(attr => attr.key === key);

      if (existingIndex !== -1) {
        // Update existing attribute
        const updatedAttributes = [...prev];
        updatedAttributes[existingIndex].value = value;
        return updatedAttributes;
      } else {
        // Add new attribute
        return [...prev, {key, value}];
      }
    });
  };

  const handleImageSelection = async type => {
    const options = {mediaType: 'photo', quality: 1};
    let result;

    if (type === 'camera') {
      result = await ImagePicker.launchCamera(options);
    } else {
      result = await ImagePicker.launchImageLibrary(options);
    }

    if (!result.didCancel && result.assets?.length > 0) {
      setItemPicture(result.assets[0].uri);
    }
    setImageModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!name || !price || !itemCategory) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('timesensitive', timesensitive);
      formData.append('preparation_time', preparationTime);
      formData.append('description', description);
      formData.append('category_ID', itemCategory);
      formData.append('branches_ID', branchData.branch_id);
      formData.append('variation_name', selectedVariation);
      formData.append('price', price);
      formData.append('additional_info', additionalInfo);

      if (itemPicture) {
        formData.append('itemPicture', {
          uri: itemPicture,
          type: 'image/jpeg',
          name: 'item.jpg',
        });
      }

      formData.append('attributes', JSON.stringify(selectedAttributes));

      const response = await fetch(
        `${url}/vendor/${shopdetails.vendors_ID}/shop/${shopdetails.id}/branch/${branchData.branch_id}/item`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Item added successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Failed to add item.');
      }
    } catch (error) {
      console.error('Add Item Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView>
    <ScrollView style={styles.container}>
      <Pressable
        onPress={() => setImageModalVisible(true)}
        style={styles.imageUploadContainer}>
        {itemPicture ? (
          <Image source={{uri: itemPicture}} style={styles.image} />
        ) : (
          <View style={styles.uploadIconContainer}>
            <Icon name="cloud-upload" size={40} color="gray" />
            <Text style={styles.uploadText}>Upload Item Image</Text>
          </View>
        )}
      </Pressable>
      <TextInput
        label="Item Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        label="Price"
        mode="outlined"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
      />
      {/* Description */}
      <TextInput
        label="Description"
        mode="outlined"
        multiline
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      {/* Additional Info */}
      <TextInput
        label="Additional Info"
        mode="outlined"
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
        style={styles.input}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={itemCategory}
          onValueChange={setItemCategory}
          style={styles.picker}
          dropdownIconColor="#F8544B" // changes the dropdown arrow color (Android)
        >
          <Picker.Item label="Select Category" value="" />
          {itemCategories.map(cat => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Is Time Sensitive?</Text>
      <View style={styles.radioRow}>
        <RadioButton
          value="Yes"
          status={timesensitive === 'Yes' ? 'checked' : 'unchecked'}
          onPress={() => setTimesensitive('Yes')}
          color="#F8544B"
        />

        <Text style={styles.radioLabel}>Yes</Text>
        <RadioButton
          value="No"
          status={timesensitive === 'No' ? 'checked' : 'unchecked'}
          onPress={() => setTimesensitive('No')}
          color="#F8544B"
        />
        <Text style={styles.radioLabel}>No</Text>
      </View>
      {/* Preparation Time */}
      {timesensitive == 'Yes' && (
        <TextInput
          label="Preparation Time (minutes)"
          mode="outlined"
          keyboardType="numeric"
          value={preparationTime}
          onChangeText={setPreparationTime}
          style={styles.input}
        />
      )}

{Object.keys(attributes).length > 0 && (
  <>
    {Object.entries(attributes).map(([key, values]) => {
      const selectedValue =
        selectedAttributes.find(attr => attr.key === key)?.value || '';

      return (
        <View key={key} style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={value => handleAttributeChange(key, value)}
            style={styles.picker}
            dropdownIconColor="#F8544B"
          >
            <Picker.Item label={`Select ${key}`} value="" />
            {values.map((value, index) => (
              <Picker.Item key={index} label={value} value={value} />
            ))}
          </Picker>
        </View>
      );
    })}
  </>
)}

      {/* Variations */}
      {variations.length > 0 && (
        <>
          <Text style={styles.label}>Select Variation</Text>
          <RadioButton.Group
            onValueChange={setSelectedVariation}
            value={selectedVariation}>
            {variations.map(variation => (
              <View key={variation.name} style={styles.radioContainer}>
                <RadioButton value={variation.name} />
                <Text style={styles.radioLabel}>{variation.name}</Text>
              </View>
            ))}
          </RadioButton.Group>
        </>
      )}

      {/* Submit Button */}
      <Button
  mode="contained"
  onPress={handleSubmit}
  style={styles.submitButton}
  contentStyle={styles.submitButtonContent}
  labelStyle={styles.submitButtonLabel}
>
  Add Item
</Button>

      <Modal
        transparent={true}
        visible={ImagemodalVisible}
        animationType="slide">
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setImageModalVisible(false)}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>
              Select Image
            </Text>

            <Button
              mode="contained"
              icon="camera"
              onPress={() => handleImageSelection('camera')}
              style={{width: '70%', marginBottom: 10}}>
              Take Photo
            </Button>

            <Button
              mode="contained"
              icon="image"
              onPress={() => handleImageSelection('gallery')}
              style={{width: '70%', marginBottom: 10}}>
              Choose from Gallery
            </Button>

            <Button mode="text" onPress={() => setImageModalVisible(false)}>
              Cancel
            </Button>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 20, },
  branchName: {fontSize: 20, fontWeight: 'bold', marginTop: 10},
  input: {marginBottom: 5},
  picker: {marginVertical: 5},
  submitButton: {
    backgroundColor: '#F8544B',
    borderRadius: 12,
    marginVertical: 12,
    alignSelf: 'center',
    width: 290,
    elevation: 3, // adds subtle shadow on Android
  },
  submitButtonContent: {
    height: 48,
    justifyContent: 'center',
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  
  radioContainer: {
    flexDirection: 'row',
    alignItems:'center'
  },
  imageUploadContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0dfdc',
    borderRadius: 10,
    height: 140,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  uploadIconContainer: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioLabel: {
    fontSize: 16,
    color: '#000',
    marginRight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginLeft:4
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  picker: {
    height: 50,
    color: '#333',
    paddingHorizontal: 10,
  },
});

export default VendorAddItem;
