import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import OnScreenKeyboard from "@/components/OnScreenKeyboard";
import { Ionicons } from "@expo/vector-icons";
import { allWords } from "@/utils/allWords";
import { words } from "@/utils/targetWords";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { transform } from "@babel/core";

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
  const [curCol, _setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const [word, setWord] = useState<string>(
    words[Math.floor(Math.random() * words.length)]
  );

  const wordLetters = word.split("");
  // console.log(word);

  const colStateRef = useRef(curCol);
  const setCurCol = (col: number) => {
    colStateRef.current = col;
    _setCurCol(col);
  };

  // add Key Function
  const addKey = (key: string) => {
    // console.log("Addkey", key);
    const newRows = [...rows.map((row) => [...row])];
    if (key === "ENTER") {
      checkWord();
    } else if (key == "BACKSPACE") {
      if (colStateRef.current === 0) {
        newRows[curRow][0] = "";
        setRows(newRows);
        return;
      }
      newRows[curRow][colStateRef.current - 1] = "";
      setCurCol(colStateRef.current - 1);
      setRows(newRows);
      return;
    } else if (colStateRef.current >= newRows[curRow].length) {
      return;
    } else {
      newRows[curRow][colStateRef.current] = key;
      setRows(newRows);
      setCurCol(colStateRef.current + 1);
    }
  };

  // Check Word Fuction
  const checkWord = () => {
    const currentWord = rows[curRow].join("");

    if (currentWord.length < word.length) {
      // console.log("Complete the word");
      shakeRow();
      return;
    }
    if (!allWords.includes(currentWord)) {
      // console.log("not a word");
      // shakeRow();
      // return;
    }
    flipRow();

    const newGreen: string[] = [];
    const newYellow: string[] = [];
    const newGray: string[] = [];

    currentWord.split("").forEach((letter, index) => {
      if (letter == wordLetters[index]) {
        newGreen.push(letter);
      } else if (wordLetters.includes(letter)) {
        newYellow.push(letter);
      } else {
        newGray.push(letter);
      }
    });
    setGreenLetters([...greenLetters, ...newGreen]);
    setYellowLetters([...yellowLetters, ...newYellow]);
    setGrayLetters([...grayLetters, ...newGray]);

    setTimeout(() => {
      if (currentWord === word) {
        // console.log("You won!");
        router.push(
          `/end?win=true&word=${word}&gameField=${JSON.stringify(rows)}`
        );
      } else if (curRow + 1 >= rows.length) {
        // console.log("game over");
        router.push(
          `/end?win=false&word=${word}&gameField=${JSON.stringify(rows)}`
        );
      }
    }, 2000);

    setCurRow(curRow + 1);
    setCurCol(0);
  };

  //Animation
  const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0));

  const rowStyles = Array.from({ length: ROWS }, (_, index) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offsetShakes[index].value }],
      };
    })
  );

  const tileRotates = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(0))
  );

  const cellBackgrounds = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue("transparent"))
  );

  const cellBorders = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(Colors.light.gray))
  );

  const tileStyles = Array.from({ length: ROWS }, (_, index) => {
    return Array.from({ length: 5 }, (_, tileIndex) =>
      useAnimatedStyle(() => {
        return {
          transform: [{ rotateX: `${tileRotates[index][tileIndex].value}deg` }],
          borderColor: cellBorders[index][tileIndex].value,
          backgroundColor: cellBackgrounds[index][tileIndex].value,
        };
      })
    );
  });

  const shakeRow = () => {
    const TIME = 80;
    const OFFSET = 10;

    offsetShakes[curRow].value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    );
  };

  const setCellColor = (cell: string, rowIndex: number, cellIndex: number) => {
    if (curRow >= rowIndex) {
      if (wordLetters[cellIndex] === cell) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBackgrounds[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(grayColor)
        );
      }
    } else {
      cellBackgrounds[rowIndex][cellIndex].value = withTiming("transparent", {
        duration: 1000,
      });
    }
  };

  const setBorderColor = (
    cell: string,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (curRow > rowIndex && cell !== "") {
      if (wordLetters[cellIndex] === cell) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.green)
        );
      } else if (wordLetters.includes(cell)) {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(Colors.light.yellow)
        );
      } else {
        cellBorders[rowIndex][cellIndex].value = withDelay(
          cellIndex * 200,
          withTiming(grayColor)
        );
      }
    }
    return Colors.light.gray;
  };

  const flipRow = () => {
    const TIME = 300;
    const OFFSET = 90;

    tileRotates[curRow].forEach((value, index) => {
      value.value = withDelay(
        index * 100,
        withSequence(
          withTiming(OFFSET, { duration: TIME }, () => {}),
          withTiming(0, { duration: TIME })
        )
      );
    });
  };

  useEffect(() => {
    if (curRow === 0) return;

    rows[curRow - 1].map((cell, cellIndex) => {
      setCellColor(cell, curRow - 1, cellIndex);
      setBorderColor(cell, curRow - 1, cellIndex);
    });
  }, [curRow]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* <Stack.Screen
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
      /> */}
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <Animated.View
            style={[styles.gameFieldRow, rowStyles[rowIndex]]}
            key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <Animated.View
                entering={ZoomIn.delay(50 * cellIndex)}
                style={[
                  styles.cell,
                  // {
                  //   backgroundColor: getCellColor(cell, rowIndex, cellIndex),
                  //   borderColor: getBorderColor(cell, rowIndex, cellIndex),
                  // },
                  tileStyles[rowIndex][cellIndex],
                ]}
                key={`cell-${rowIndex}-${cellIndex}`}>
                <Text
                  style={[
                    styles.cellText,
                    {
                      color: curRow > rowIndex ? "#fff" : textColor,
                    },
                  ]}>
                  {cell}
                </Text>
              </Animated.View>
            ))}
          </Animated.View>
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
    borderRadius: 5,
  },
  cellText: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
