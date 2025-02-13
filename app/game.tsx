import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import OnScreenKeyboard from "@/components/OnScreenKeyboard";
import { Ionicons } from "@expo/vector-icons";

const ROWS = 6;

const Page = () => {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].gameBg;
  const textColor = Colors[colorScheme ?? "light"].text;
  const grayColor = Colors[colorScheme ?? "light"].gray;
  const router = useRouter();

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(5).fill(""))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const addKey = (key: string) => {
    console.log("Addkey", addKey);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerIcon}>
              <Ionicons
                name="help-circle-outline"
                size={24}
                color={textColor}
              />
            </View>
          ),
        }}
      />
      <OnScreenKeyboard />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    flexDirection: "row",
    gap: 10,
  },
});
