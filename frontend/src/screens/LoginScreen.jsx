import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("authToken");
  //       if (token) {
  //         navigation.replace("Main");
  //       }
  //     } catch (error) {
  //       console.log("error message", error);
  //     }
  //   };
  //   checkLoginStatus();
  // }, []);
  const handleLogin = async () => {
    const user = {
      email: email,
      password: password,
    };
    axios
      .post("https://8853-2404-8000-1004-8ef2-a198-fb1a-af7c-3052.ngrok-free.app /login", user)
      .then((response) => {
        console.log("ini responseeeeee", response);
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        navigation.replace("Main");
      })
      .catch((err) => {
        Alert.alert("Login error", "Invalid email");
        console.log(err);
      });
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff", alignItems: "center" }}
    >
      <View style={{ marginTop: 70 }}>
        <Image
          style={{ width: 150, height: 100 }}
          source={{
            uri: "https://www.frikko.com/wp-content/uploads/2019/03/amazon-logo-icon-png_44637.png",
          }}
        />
      </View>
      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginTop: 12,
              color: "#041e42",
            }}
          >
            Login to your account
          </Text>
        </View>
        <View style={{ marginTop: 70 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 30,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <MaterialIcons
              style={{ marginLeft: 8 }}
              name="email"
              size={24}
              color="grey"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "grey",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16,
              }}
              placeholder="Enter your email"
            />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 30,
              backgroundColor: "#D0D0D0",
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <AntDesign
              style={{ marginLeft: 8 }}
              name="lock1"
              size={24}
              color="grey"
            />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              style={{
                color: "grey",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16,
              }}
              placeholder="Enter your password"
            />
          </View>
        </View>

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>Keep me logged in</Text>
          <Text style={{ color: "#007fff", fontWeight: "500" }}>
            Forgot Password
          </Text>
        </View>

        <View style={{ marginTop: 80 }} />
        <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "#febe10",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 12 }}
        >
          <Text style={{ textAlign: "center", color: "grey", fontSize: 16 }}>
            Dont have an account? Sign Up
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
