import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AdminCustomDrawer = (props) => {
  const { navigation, route } = props;
  const admindata = route?.params?.Admindata
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          
          navigation.replace("Login");
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: "flex-start", padding: 5,marginBottom:20}}>
      {admindata?.image ? (
          <Image
            source={{ uri: admindata.image }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
        ) : (
          <Icon name="account-circle" size={80} color="gray" />
        )}
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>{admindata.name}</Text>
        <Text style={{ fontSize: 14, color: "gray" }}>{admindata.email}</Text>

      </View>

     
      <DrawerItemList {...props} />

  
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          padding: 15,
          backgroundColor: "#ff4d4d",
          margin: 20,
          borderRadius: 5,
          alignItems: "center",
          justifyContent:'flex-end'
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default AdminCustomDrawer;
