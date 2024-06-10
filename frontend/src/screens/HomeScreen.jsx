import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { list } from "../mocks/list";
import { SliderBox } from "react-native-image-slider-box";
import { images } from "../mocks/images";
import { deals } from "../mocks/deals";
import { offers } from "../mocks/offers";
import axios from "axios";
import ProductItem from "../components/ProductItem";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { BottomModal, ModalContent, SlideAnimation } from "react-native-modals";
import { Entypo } from "@expo/vector-icons";
import Search from "../components/Search";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { UserType } from "../context/UserContext";

export default function HomeScreen() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("")
  console.log(selectedAddress)
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("jewelery");
  const [items, setItems] = useState([
    { label: "Men's clothing", value: "men's clothing" },
    { label: "jewelery", value: "jewelery" },
    { label: "electronics", value: "electronics" },
    { label: "women's clothing", value: "women's clothing" },
  ]);
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
      } catch (error) {
        console.log("error message", error);
      }
    };

    fetchProducts();
  }, []);

  const onGenderOpen = useCallback(() => {
    setCompanyOpen(false);
  }, []);

  const cart = useSelector((state) => state.cart.cart);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.post(
        `https://8853-2404-8000-1004-8ef2-a198-fb1a-af7c-3052.ngrok-free.app/addresses/${userId}`
      );
      const { addresses } = response.data;
      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };

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
  console.log("addresses", addresses);
  return (
    <>
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? 40 : 0,
          flex: 1,
          backgroundColor: "#fff",
          borderRadius: 3,
          height: 38,
        }}
      >
        <ScrollView>
          <Search />
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              padding: 10,
              backgroundColor: "#AFEEEE",
            }}
          >
            <Ionicons name="location-outline" size={24} color="black" />
            <Pressable>
            {selectedAddress ? (
              <Text>Deliver to {selectedAddress?.name} - {selectedAddress?.street}</Text>
            ):(

              <Text>Deliver to Alfan - Bintaro 298388</Text>
            )}
            </Pressable>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          </Pressable>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {list.map((item, index) => (
              <Pressable
                key={index}
                style={{
                  margin: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 50, height: 50, resizeMode: "contain" }}
                  source={{ uri: item.image }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: 500,
                    marginTop: 5,
                  }}
                >
                  {item?.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <SliderBox
            images={images}
            autoplay
            circleLoop
            dotColor={"#13274f"}
            inactiveDotColor={"#90a4ae"}
            imageComponentStyle={{ width: "100%" }}
          />
          <Text style={{ padding: 10, fontWeight: "bold", fontSize: 18 }}>
            Trending Products
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {deals.map((item, index) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item?.price,
                    carouselImages: item.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  })
                }
                style={{ marginVertical: 10, flexDirection: "row" }}
              >
                <Image
                  style={{ width: 180, height: 180, resizeMode: "contain" }}
                  source={{ uri: item.image }}
                />
              </Pressable>
            ))}
          </View>
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />
          <Text style={{ padding: 10, fontWeight: "bold", fontSize: 18 }}>
            Today's Deals
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {offers.map((item, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item.id,
                    title: item.title,
                    price: item?.price,
                    carouselImages: item.carouselImages,
                    color: item?.color,
                    size: item?.size,
                    oldPrice: item?.oldPrice,
                    item: item,
                  })
                }
                style={{
                  marginVertical: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{ width: 150, height: 150, resizeMode: "contain" }}
                  source={{ uri: item.image }}
                />
                <View
                  style={{
                    backgroundColor: "#e31837",
                    paddingVertical: 5,
                    width: 130,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {item?.offer} Off
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />
          <View
            style={{
              marginHorizontal: 10,
              width: "45%",
              marginTop: 20,
              marginBottom: open ? 50 : 15,
            }}
          >
            <DropDownPicker
              style={{
                borderColor: "#B7B7B7",
                height: 30,
                marginBottom: open ? 120 : 15,
              }}
              open={open}
              value={category} //genderValue
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              placeholder="choose category"
              placeholderStyle={styles.placeholderStyles}
              onOpen={onGenderOpen}
              // onChangeValue={onChange}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {products
              .filter((item) => item.category === category)
              .map((item, index) => (
                <ProductItem item={item} key={index} />
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideForm: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 400 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Choose Your Location
            </Text>
            <Text style={{ fontSize: 16, marginTop: 5, color: "grey" }}>
              Select a delivery location to see product availibility and
              delivery options
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {addresses?.map((item, index) => (
              <Pressable
              onPress={() => setSelectedAddress(item)}
                style={{
                  width: 140,
                  height: 140,
                  borderColor: "#d0d0d0",
                  borderWidth: 1,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 3,
                  marginRight: 15,
                  marginTop: 10,
                  backgroundColor: selectedAddress === item ? "#fbcec1" : "white"
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                    {item?.name} cok
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>
                <Text numberOfLines={1} style={{width: 130, fontSize: 13, textAlign: "center"}}>{item?.houseNo}, {item?.landmark}</Text>
                <Text numberOfLines={1} style={{width: 130, fontSize: 13, textAlign: "center"}}>{item?.street}</Text>
                <Text numberOfLines={1} style={{width: 130, fontSize: 13, textAlign: "center"}}>Indonesia, Jakarta</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Address");
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#d0d0d0",
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#0066b2",
                  fontWeight: "500",
                }}
              >
                Add an Address or pick-up point
              </Text>
            </Pressable>
          </ScrollView>

          <View style={{ flexDirection: "column", gap: 7, marginBottom: 30 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="location-pin" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Enter an Region pincode
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="locate-sharp" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Use My Current Location
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <AntDesign name="earth" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Deliver outside Indonesia
              </Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
}

const styles = StyleSheet.create({});
