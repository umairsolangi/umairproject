import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {Button} from 'react-native-paper';
import {SelectList} from 'react-native-dropdown-select-list';

const ViewProduct = ({navigation, route}) => {

  const userdata = route.params.userdata;

  const [itemCatagory, setItemCatagory] = useState('');
  const [itemList, setItemList] = useState([]);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('red');

  const data = [
    {key: '1', value: 'Mobiles'},
    {key: '2', value: 'Electronics'},
    {key: '3', value: 'Fast Food'},
    {key: '4', value: 'Computers'},
    {key: '5', value: 'Diary Products'},
    {key: '6', value: 'Drinks'},
  ];


  useEffect(()=>{
    searchitem()
  },[])


  const searchitem = async () => {
    try {
      const response = await fetch(`${url}/getallitem?userID=${userdata.userID}`);

      if (response.ok) {
        var data = await response.json();
        if(data!='Record Not found'){
          setItemList(data)
          console.log(data);
        }
        else{
          setMessage('Record Not found')
        }
       
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

  const searchbycatagory=async()=>{
    var obvprice=itemList.filter(e=>e.itemPrice>1000)
    setItemList(obvprice)
    console.log(obvprice)
   /*  try {
      const response = await fetch(`${url}/searchbycatagoryitem?userID=${userdata.userID}&price=${price}`);

      if (response.ok) {
        var data = await response.json();
        if(data.length > 0){
          setItemList(data)
          console.log(data);
        }
        else{
          setItemList(data)
          setMessage('Record Not found')
        }
      } else {
        const errorText = await response.text();
        setMessage(`${errorText}`);
        setMessageColor('red');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setMessage('An error occurred. Please try again.');
      setMessageColor('red');
    } */
    setTimeout(() => {
      setMessage('');
    }, 1000);
  }

  const deleteItem=async(id)=>{
    try {
      const response = await fetch(`${url}/deleteitem?itemID=${id}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        
        setItemList((prevItems) => prevItems.filter((item) => item.itemID !== id));
        
          setMessage('Item deleted successfully')
          setMessageColor('green')
        
      } 
      else {
        const errorText = await response.text();
        setMessage(`${errorText}`);
        setMessageColor('red');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setMessage('An error occurred. Please try again.');
      setMessageColor('red');
    }
    setTimeout(() => {
      setMessage('');
    }, 1000);

  }

  const editItem=async(id)=>{
    const item=itemList.filter(i=>i.itemID==id)
    navigation.navigate('EditProduct', {item})
    
    /* try {
      const response = await fetch(`${url}/deleteitem?itemID=${id}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        
        setItemList((prevItems) => prevItems.filter((item) => item.itemID !== id));
        
          setMessage('Item deleted successfully')
          setMessageColor('green')
        
      } 
      else {
        const errorText = await response.text();
        setMessage(`${errorText}`);
        setMessageColor('red');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setMessage('An error occurred. Please try again.');
      setMessageColor('red');
    } */
    setTimeout(() => {
      setMessage('');
    }, 1000);

  }

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: '#F8544B',
          borderColor: 'black',
          borderRadius: 5,
          padding: 10,
          marginTop: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          
          <Image
            source={{uri: `${imgURL}/${item.itemImage}`}}
            style={{
              width: 150,
              height: 150,
              backgroundColor: 'gray',
              borderRadius: 10,
            }}
          />
          <View>
            <Text
              style={{
                color: 'white',
                borderRadius: 5,
                paddingLeft: 10,
                fontSize: 15,
              }}>
              {item.itemCategory}
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 25,
                fontWeight: 'bold',
                paddingLeft: 10,
              }}>
              {item.itemName}
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontWeight: 'bold',
                paddingLeft: 10,
              }}>
              units:{item.itemUnit}
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontWeight: 'bold',
                paddingLeft: 10,
              }}>
              price:{item.itemPrice}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: 20,
                paddingLeft: 10,
              }}>
              <Button
                mode="contained"
                uppercase={true}
                onPress={() => editItem(item.itemID)}
                style={{
                  backgroundColor: 'darkgreen',
                  borderRadius: 10,
                  marginEnd: 10,
                  width: 100,
                }}>
                Edit
              </Button>
              <Button
                onPress={() => deleteItem(item.itemID)}
                mode="contained"
                rippleColor="yellow"
                uppercase={true}
                style={{
                  backgroundColor: 'darkred',
                  borderRadius: 10,
                  width: 100,
                }}>
                Delete
              </Button>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={ss.mainContainer}>
       <View style={{flexDirection: 'row'}}>
        {/* <SelectList
          boxStyles={{paddingHorizontal: 20, width: 280}}
          placeholder="Search By Catagory"
          save="value"
          setSelected={setItemCatagory}
          data={data}></SelectList> */}
        <Button
          onPress={searchbycatagory}
          mode="contained"
          uppercase={true}
          style={{
            backgroundColor: 'black',
            borderRadius: 10,
            marginLeft: 10,
          }}>
          Search
        </Button>
      </View> 
      <Text style={{marginTop:20,alignSelf: 'center', color: messageColor}}>{message}</Text>
      <FlatList
        data={itemList}
        renderItem={renderItem}
        style={{marginTop: 10, marginBottom: 50}}
      />
    </View>
  );
};
const ss = StyleSheet.create({
  mainContainer: {
    marginTop: 50,
    marginVertical: 10,
    marginHorizontal: 10,
  },
});

export default ViewProduct;
