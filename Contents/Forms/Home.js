import React, {useState} from 'react';
import {View, Text, Alert, FlatList, ScrollView} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {Button, TextInput} from 'react-native-paper';

function Home() {
  const [viewsearch, setViewSearch] = useState(false);
  const [viewRoute, setViewRoute] = useState(false);
  const [busno, setBusno] = useState('');
  const [Departuretime, setDeparturetime] = useState('');
  const [soursevalue, setSoursevalue] = useState('');
  const [distinationvalue, setDistinationvalue] = useState('');
  const [routedetails, setRouteDetails] = useState([]);

  const [sourse, setSourse] = useState([
    {key: 1, value: 'Rawalpindi'},
    {key: 2, value: 'Islamabad'},
    {key: 3, value: 'Attock'},
    {key: 4, value: 'Lahor'},
  ]);
  const [distination, setDestination] = useState([
    {key: 1, value: 'Rawalpindi'},
    {key: 2, value: 'Islamabad'},
    {key: 3, value: 'Attock'},
    {key: 4, value: 'Lahor'},
  ]);

  const addtoarrylist = () => {
    if (soursevalue == distinationvalue) {
      return;
    } else {
      const routobj = {
        sourse: soursevalue,
        distination: distinationvalue,
        busno: busno,
        Departuretime: Departuretime,
      };
      console.log(routobj);
      setRouteDetails([...routedetails, routobj]);
      setSoursevalue('');
      setDistinationvalue('');
      setDeparturetime('');
      setBusno('');
    }
  };
  const renderItem = ({item}) => {
    return (
      <View style={{borderWidth:1,paddingVertical:10,backgroundColor:'#00008B',color:'white', borderColor:"darkblue",borderRadius:5, paddingLeft:10,fontSize:20,}}>
        <Text style={{color:'white'}}>Bus No:{item.busno} Departure Time:{item.Departuretime}</Text>
      </View>
    );
  };
  return (
    <View style={{backgroundColor: 'white', height: 1000, margin: 0}}>
      <View
        style={{
          backgroundColor: '#FFA500',
          height: 100,
          marginTop: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'black', fontSize: 30, fontWeight: 'bold'}}>
          Home
        </Text>
      </View>
      <Button
        onPress={() => setViewRoute(!viewRoute)}
        mode="contained"
        uppercase={true}
        style={{
          backgroundColor: 'darkgreen',
          borderRadius: 10,
          marginTop: 10,
          marginLeft: 20,
          marginRight: 20,
          width: 150,
        }}>
        New Route
      </Button>
      <Button
        onPress={() => setViewSearch(!viewsearch)}
        mode="contained"
        rippleColor="yellow"
        uppercase={true}
        style={{
          backgroundColor: 'darkblue',
          borderRadius: 10,
          marginTop: 10,
          marginLeft: 20,
          marginRight: 20,
          width: 150,
        }}>
        Search
      </Button>

      {viewRoute && (
        <>
          <View
            style={{
              backgroundColor: 'darkgreen',
              height: 70,
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 24}}>New Route</Text>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                alignItems: 'center',
              }}>
              <View
                style={{display: 'flex', alignItems: 'center', marginEnd: 20}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 24,
                  }}>
                  Sourse
                </Text>

                <SelectList
                  boxStyles={{paddingHorizontal: 20, width: 150}}
                  placeholder="Sourse"
                  save="value"
                  setSelected={setSoursevalue}
                  data={sourse}></SelectList>
              </View>

              <View style={{display: 'flex', alignItems: 'center'}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 24,
                  }}>
                  distination
                </Text>

                <SelectList
                  boxStyles={{paddingHorizontal: 20, width: 150}}
                  placeholder="Sourse"
                  save="value"
                  setSelected={setDistinationvalue}
                  data={distination}></SelectList>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{marginEnd: 10, width: 170}}>
                <TextInput
                  onChangeText={setBusno}
                  mode="outlined"
                  label="Bus No"
                  placeholder="Enter time"
                />
              </View>
              <View style={{width: 170}}>
                <TextInput
                  onChangeText={setDeparturetime}
                  mode="outlined"
                  label="Departure time"
                  placeholder="Enter time"
                />
              </View>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={addtoarrylist}
            rippleColor="yellow"
            uppercase={true}
            style={{
              backgroundColor: 'darkgreen',
              borderRadius: 10,
              marginTop: 10,
              marginLeft: 20,
              marginRight: 20,
            }}>
            Add
          </Button>
        </>
      )}

      {viewsearch && (
        <>
          <View
            style={{
              backgroundColor: 'darkblue',
              height: 70,
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 24}}>Search</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                alignItems: 'center',
              }}>
              <View
                style={{display: 'flex', alignItems: 'center', marginEnd: 20}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 24,
                  }}>
                  Sourse
                </Text>

                <SelectList
                  boxStyles={{paddingHorizontal: 20, width: 150}}
                  placeholder="Sourse"
                  save="value"
                  setSelected={setSoursevalue}
                  data={sourse}></SelectList>
              </View>

              <View style={{display: 'flex', alignItems: 'center'}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 24,
                  }}>
                  distination
                </Text>

                <SelectList
                  boxStyles={{paddingHorizontal: 20, width: 150}}
                  placeholder="Sourse"
                  save="value"
                  setSelected={setDistinationvalue}
                  data={distination}></SelectList>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={{margin: 0, width: 400}}>
                <FlatList data={routedetails} renderItem={renderItem} />
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default Home;
