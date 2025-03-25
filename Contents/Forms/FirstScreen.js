import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const FirstScreen = () => {

    const [count, setCount] = useState(10);
    return (
        <View>
            <View style={{ alignItems: 'center' }}>
                <Text style={{
                    textAlign: 'center', fontSize: 25,
                    color: 'orange', borderWidth: 2, width: '50%',
                }}>My Counter</Text>
            </View>
            <View>
                <Text style={myStyle.myText}>Count = {count}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: "center" }}>
                <View style={myStyle.myBtn}>
                    <Button title="Increment"
                        onPress={() => { setCount(count + 1) }}
                    ></Button>
                </View>
                <View style={myStyle.myBtn}>
                    <Button title="Decrement"></Button>
                </View>
            </View>
            <View>
                <Text style={{ textAlign: 'center' }}>Our First Class</Text>
            </View>
        </View>
    );
}
const myStyle = StyleSheet.create({
    myText: {
        textAlign: 'center', fontSize: 22,
        color: 'blue', borderWidth: 2,
    },
    myBtn: { marginLeft: 5, borderWidth: 1, },
});

export default FirstScreen;









