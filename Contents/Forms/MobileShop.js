import React, {useState} from 'react';
import {View, Text, Alert, FlatList, ScrollView} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {SelectList} from 'react-native-dropdown-select-list';

function MobileShop() {
  const [catagory, setCatagory] = useState([
    {key: 1, value: 'Samsung'},
    {key: 2, value: 'Iphone'},
    {key: 3, value: 'heviva'},
  ]);
  const [viewstockdetails, setstockdetails] = useState(false);

  const [mobilename, setMobilename] = useState('');
  const [mobilecatagory, setMobilecatagory] = useState('');
  const [mobilepice, setMobileprice] = useState('');
  const [mobilequantity, setMobilenQunatity] = useState('');
  const [id, setid] = useState(0);

  const [mobiledetails, setmobiledetails] = useState([]);

  const addnewmobile = () => {
    setid(id+1);
    const obj = {
      id: mobiledetails.length + 1,
      mobilename: mobilename,
      mobilecatagory: mobilecatagory,
      mobilepice: mobilepice,
      mobilequantity: mobilequantity,
    };
    setmobiledetails([...mobiledetails, obj]);

  };
  const deletitem=(id)=>{
    const newarry=mobiledetails.filter(e=>e.id!=id)
    setmobiledetails([...newarry])

  }

  const renderItem = ({item}) => {
   return (
    <>
      <View
        style={{
          backgroundColor: 'white',
          height: 250,
          padding:10,
          marginBottom:20,
          alignItems: 'start',
          justifyContent: 'start',
        }}>
        <Text style={{color: 'black', fontSize: 24}}>Mobile id:{item.id}</Text>
        <Text style={{color:"black", fontSize:24}}>Mobile name:{item.mobilename}</Text>
        <Text style={{color:"black", fontSize:24}}>Pirce: {item.mobilepice}</Text>
        <Text style={{color:"black", fontSize:24}}>Catagoyr:{item.mobilecatagory}</Text>
        <Text style={{color:"black", fontSize:24}}>Quantity:{item.mobilequantity}</Text>


        <Button
          mode="contained"
          uppercase={true}
          onPress={()=>deletitem(item.id)}
          style={{
            backgroundColor: 'darkgreen',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 0,
            width: 200,
          }}>
          Delete
        </Button>
      </View>
    </>
  );
  };

  return (
    <View style={{marginTop: 20, marginHorizontal: 10,marginVertical:100}}>
      <View style={{display: 'flex', gap: 10}}>
        <Text style={{fontSize:40, fontWeight:'bold', alignSelf:'center'}}>MobileStock Task</Text>
        <TextInput
          onChangeText={setMobilename}
          mode="outlined"
          label="Mobile Name"
          placeholder="Enter time"
          style={{width: 380}}
        />
        <SelectList
          boxStyles={{paddingHorizontal: 20, width: 380}}
          placeholder="Sourse"
          save="value"
          setSelected={setMobilecatagory}
          data={catagory}></SelectList>
        <TextInput
          onChangeText={setMobileprice}
          mode="outlined"
          label="Mobile price"
          placeholder="Enter time"
          style={{width: 380}}
        />
        <TextInput
          onChangeText={setMobilenQunatity}
          mode="outlined"
          label="Mobile Qunatity"
          placeholder="Enter time"
          style={{width: 380}}
        />
        <Button
          mode="contained"
          uppercase={true}
          onPress={addnewmobile}
          style={{
            backgroundColor: 'darkgreen',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 0,
            width: 200,
          }}>
          Add
        </Button>
        <Button
          mode="contained"
          uppercase={true}
          onPress={() => setstockdetails(!viewstockdetails)}
          style={{
            backgroundColor: 'darkgreen',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 10,
            marginLeft: 10,
            marginRight: 0,
            width: 200,
          }}>
          show stock
        </Button>
        {viewstockdetails && (
  <View style={{ marginTop: 20 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
      Stock Details
    </Text>
    <FlatList
      data={mobiledetails}
      renderItem={renderItem}
      style={{ backgroundColor: 'lightgreen', borderRadius: 10, padding: 10 }}
    />
  </View>
)}

      </View>
    </View>
  );
}

export default MobileShop;
