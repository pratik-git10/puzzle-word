import { StyleSheet, Text, View } from "react-native";
import React from "react";

const GamePage = () => {
  return (
    <View style={styles.text}>
      <Text>GamePage View</Text>
    </View>
  );
};

export default GamePage;

const styles = StyleSheet.create({
  text: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
