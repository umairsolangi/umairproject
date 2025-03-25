import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {SelectList} from 'react-native-dropdown-select-list';
import * as imagepicker from 'react-native-image-picker';

const EditProduct = ({navigation, route}) => {
  const itemdata = route.params.item[0];

  const data = [
    {key: '1', value: 'Mobiles'},
    {key: '2', value: 'Electronics'},
    {key: '3', value: 'Fast Food'},
    {key: '4', value: 'Computers'},
    {key: '5', value: 'Diary Products'},
    {key: '6', value: 'Drinks'},
  ];

  const [itemCatagory, setItemCatagory] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemUnit, setItemUnit] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');

  useEffect(() => {
   updatedvalue()
   
  },[]);

  const updatedvalue=()=>{
    setItemCatagory(itemdata.itemCatagory)
    setItemName(itemdata.itemName)
    setItemPrice(itemdata.itemPrice)
    setItemUnit(itemdata.itemUnit)
    setItemImage(`${imgURL}/${itemdata.itemImage}`)
    
  }

  const addimage = () => {
    imagepicker.launchCamera({mediaType: 'photo'}, resp => {
      if (resp.didCancel) {
        console.log('User canceled image selection');
      } else if (resp.assets && resp.assets[0]) {
        setItemImage(resp.assets[0].uri);
      } else {
        console.error('Error picking image:', resp.errorMessage);
      }
    });
  };

  const collectData = async () => {
    try {
      var formData = new FormData();
      const itemobj = {
        itemName: itemName,
        itemCategory: itemCatagory,
        itemPrice: itemPrice,
        itemUnit: itemUnit,
        userID: itemdata.userID,
        itemID:itemdata.itemID
      };
      console.log('updated item data:'+itemobj);
      formData.append('item', JSON.stringify(itemobj));
      var itemimage = {
        uri: itemImage,
        name: 'item.jpg',
        type: 'image/jpeg',
      };
      formData.append('file', itemimage);

      const response = await fetch(`${url}/updateitem`, {
        method: 'POST',
        headers: {'Content-Type': 'multipart/form-data'},
        body: formData,
      });

      if (response.ok) {
        setMessage('Item updated Successfully');
        setMessageColor('green');
        
      } else {
        const errorText = await response.text();
        setMessage(`${errorText}`);
        setMessageColor('red');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setMessage('An error occurred. Please try again.');
      setMessageColor('red');
    }
  };

  return (
    <View style={{marginTop: 20, marginHorizontal: 10, marginVertical: 100}}>
      <View style={{display: 'flex', gap: 10}}>
        <Text style={{fontSize: 40, fontWeight: 'bold', alignSelf: 'center'}}>
          Edit Product Details
        </Text>

        <Image
          source={{uri: itemImage}}
          style={{
            alignSelf: 'center',
            width: 150,
            height: 150,
            backgroundColor: 'gray',
            marginBottom: 10,
          }}
        />
        <Button
          mode="contained"
          onPress={addimage}
          uppercase={true}
          style={{
            backgroundColor: 'black',
            alignSelf: 'center',
            borderRadius: 10,

            marginLeft: 10,
            marginRight: 0,
            width: 300,
          }}>
          Click Here to Upload Img
        </Button>

        <TextInput
          value={itemName}
          onChangeText={setItemName}
          mode="outlined"
          label="Item Name"
          placeholder="Enter Item Name"
          style={{width: 380}}
        />
        <SelectList
          boxStyles={{paddingHorizontal: 20, width: 380}}
          placeholder="Select Catagory"
          save="value"
          setSelected={setItemCatagory}
          data={data}></SelectList>
        <TextInput
          value={itemPrice}
          onChangeText={setItemPrice}
          mode="outlined"
          label="Item price"
          placeholder="Enter Item Price"
          style={{width: 380}}
        />
        <TextInput
          value={itemUnit}
          onChangeText={setItemUnit}
          mode="outlined"
          label="Unit"
          placeholder="Enter Units"
          style={{width: 380}}
        />
        <Text style={{alignSelf: 'center', color: messageColor}}>
          {message}
        </Text>
        <Button
          onPress={collectData}
          mode="contained"
          uppercase={true}
          style={{
            backgroundColor: '#F8544B',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 0,
            width: 200,
          }}>
          update
        </Button>
      </View>
    </View>
  );
};

export default EditProduct;
