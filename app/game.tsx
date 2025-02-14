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
    new Array(ROWS).fill(new Array(5).fill("a"))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const addKey = (key: string) => {
    console.log("Addkey", key);
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
              <Ionicons name="podium-outline" size={24} color={textColor} />
              <Ionicons name="settings-sharp" size={24} color={textColor} />
            </View>
          ),
        }}
      />
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <View style={styles.gameFieldRow} key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <View style={styles.cell} key={`cell-${rowIndex}-${cellIndex}`}>
                <Text style={styles.cellText}>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <OnScreenKeyboard
        onKeyPressed={addKey}
        greenLetters={greenLetters}
        yellowLetters={yellowLetters}
        grayLetters={grayLetters}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
  },
  headerIcon: {
    flexDirection: "row",
    gap: 10,
  },
  gameField: {
    alignItems: "center",
    gap: 8,
  },
  gameFieldRow: {
    flexDirection: "row",
    gap: 8,
  },
  cell: {
    backgroundColor: "#fff",
    width: 62,
    height: 62,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
  },
  cellText: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
