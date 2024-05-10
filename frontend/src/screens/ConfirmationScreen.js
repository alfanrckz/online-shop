import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";

const ConfirmationScreen = () => {
  const steps = [
    { title: "Address", content: "Address Form" },
    { title: "Delivery", content: "Delivery Options" },
    { title: "Payment", content: "Payment Details" },
    { title: "Place Order", content: "Order Summary" },
  ];
  return (
    <ScrollView style={{ marginTop: 55 }}>
      <Text>ConfirmationScreen</Text>
    </ScrollView>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({});
