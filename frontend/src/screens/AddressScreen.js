import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { UserType } from "../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
export default function AddressScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      console.log("token", token);
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);

  console.log("userId", userId);
  const handleAddAddress = async () => {
    const address = { name, mobileNo, houseNo, street, landmark, postalCode };
    axios
      .post("http://192.168.18.87:8081/addresses", userId, address)
      .then((response) => {
        console.log("response", response);
        Alert.alert("Success", "Address added successfully");
        setName("");
        setMobileNo("");
        setHouseNo("");
        setStreet("");
        setLandmark("");
        setPostalCode("");

        setTimeout(() => {
          navigation.goBack();
        }, 500);
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to add address");
        console.log("error", error);
      });
  };

  return (
    <ScrollView style={{ marginTop: 50 }}>
      <View style={{ height: 50, backgroundColor: "#00ced1" }} />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 17, fontWeight: "bold" }}>
          Add a new address
        </Text>
        <TextInput
          placeholder="Indonesia"
          style={{
            padding: 10,
            borderColor: "#d0d0d0",
            borderWidth: 1,
            borderWidth: 1,
            marginTop: 10,
            borderRadius: 5,
          }}
        />
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Full Name (First and last name)
          </Text>
          <TextInput
            style={{
              padding: 10,
              borderColor: "#d0d0d0",
              borderWidth: 1,
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Mobile No</Text>
          <TextInput
            style={{
              padding: 10,
              borderColor: "#d0d0d0",
              borderWidth: 1,
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Mobile No"
            value={mobileNo}
            onChangeText={(text) => setMobileNo(text)}
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Flat, House No, Building, Company
          </Text>
          <TextInput
            style={{
              padding: 10,
              borderColor: "#d0d0d0",
              borderWidth: 1,
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder=""
            value={houseNo}
            onChangeText={(text) => setHouseNo(text)}
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Area, Street, Sector, Village
          </Text>
          <TextInput
            style={{
              padding: 10,
              borderColor: "#d0d0d0",
              borderWidth: 1,
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder=""
            value={street}
            onChangeText={(text) => setStreet(text)}
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Landmark</Text>
          <TextInput
            style={{
              padding: 10,
              borderColor: "#d0d0d0",
              borderWidth: 1,
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Eg near apollo hospital"
            value={landmark}
            onChangeText={(text) => setLandmark(text)}
          />
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Pincode</Text>
          <TextInput
            style={{
              padding: 10,
              borderColor: "#d0d0d0",
              borderWidth: 1,
              borderWidth: 1,
              marginTop: 10,
              borderRadius: 5,
            }}
            placeholder="Enter Pincode"
            value={postalCode}
            onChangeText={(text) => setPostalCode(text)}
          />
        </View>

        <Pressable
          onPress={handleAddAddress}
          style={{
            backgroundColor: "#ffc72c",
            padding: 19,
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Add Address</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
