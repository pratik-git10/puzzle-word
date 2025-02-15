import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Icon from "@/assets/images/wordle-icon.svg";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import * as MailComposer from "expo-mail-composer";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/utils/FirebaseConfig";

const end = () => {
  const { win, word, gameField } = useLocalSearchParams<{
    win: string;
    word: string;
    gameField?: string;
  }>();

  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      updateHighscore();
    }
  }, [user]);

  const updateHighscore = async () => {
    console.log("updated score", user);
    if (!user) return;

    const docRef = doc(FIRESTORE_DB, `highscore/${user.id}`);
    const docSnap = await getDoc(docRef);

    let newScore = {
      played: 1,
      wins: win === "true" ? 1 : 0,
      lastGame: win === "true" ? "win" : "loss",
      currentStreak: win === "true" ? 1 : 0,
    };

    if (docSnap.exists()) {
      const data = docSnap.data();

      newScore = {
        played: data.played + 1,
        wins: win === "true" ? data.wins + 1 : data.wins,
        lastGame: win === "true" ? "win" : "loss",
        currentStreak:
          win === "true" && data.lastGame === "win"
            ? data.currentStreak + 1
            : win === "true"
            ? 1
            : 0,
      };
    }

    await setDoc(docRef, newScore);
  };
  const [userScore, setUserScore] = useState<any>();

  // share game logic
  const shareGame = async () => {
    // Check if email is available
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("Error", "Email composer is not available on this device.");
      return;
    }

    // Generate game text instead of complex HTML for better compatibility
    const game = JSON.parse(gameField || "[]");
    const wordLetters = word.split("");
    const imageText: string[] = [];

    game.forEach((row: string[]) => {
      const rowIcons = row.map((letter, index) => {
        if (letter === wordLetters[index]) return "🟩";
        if (wordLetters.includes(letter)) return "🟨";
        return "⬜";
      });
      imageText.push(rowIcons.join(""));
    });

    // Create plain-text content for better email compatibility
    const textBody = `
      I just played Wordle! 🎯
      
      ${imageText.join("\n")}
      
      Can you beat me? 💪
    `;

    // Compose the email
    await MailComposer.composeAsync({
      subject: "I just played Wordle!",
      body: textBody,
      isHtml: false, // Use plain text for better compatibility
    });
  };

  const navigateRoute = () => {
    router.dismissAll();
    router.replace("/");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ alignSelf: "flex-end" }}
        onPress={navigateRoute}>
        <Ionicons
          name="close-circle-outline"
          size={30}
          color={Colors.light.gray}
        />
      </TouchableOpacity>
      <View style={styles.header}>
        {win === "true" ? (
          <Image source={require("@/assets/images/win.png")} />
        ) : (
          <Icon width={100} height={70} />
        )}

        <Text style={styles.title}>
          {win === "true" ? "Congratulations !" : "Better Luck Next Time"}
        </Text>

        <SignedOut>
          <Text style={styles.text}>Want to see your stats and Streaks?</Text>

          <Link href={"/login"} style={styles.btn} asChild>
            <TouchableOpacity>
              <Text style={styles.btnText}>Create a free Account</Text>
            </TouchableOpacity>
          </Link>

          <Link href={"/login"} asChild>
            <TouchableOpacity>
              <Text style={styles.btnLink}>Already have a Account? Log in</Text>
            </TouchableOpacity>
          </Link>
        </SignedOut>

        <SignedIn>
          <Text style={styles.text}>Stats</Text>
          <View style={styles.stats}>
            <View>
              <Text style={styles.score}>{userScore?.played}</Text>
              <Text style={styles.score}>played</Text>
            </View>
            <View>
              <Text style={styles.score}>{userScore?.wins}</Text>
              <Text style={styles.score}>Wins</Text>
            </View>
            <View>
              <Text style={styles.score}>{userScore?.currentstreak}</Text>
              <Text style={styles.score}>Current Streak</Text>
            </View>
          </View>
        </SignedIn>

        <View
          style={{
            height: StyleSheet.hairlineWidth,
            width: "100%",
            backgroundColor: "gray",
          }}
        />

        <TouchableOpacity onPress={shareGame} style={styles.iconBtn}>
          <Text style={styles.btnText}>Share</Text>
          <Ionicons name="share-social-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default end;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  playButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 4,
  },
  title: {
    fontSize: 30,
    fontFamily: "FrankRuhlLibre_800ExtraBold",
    textAlign: "center",
  },
  text: {
    fontSize: 26,
    textAlign: "center",
    fontFamily: "FrankRuhlLibre_500Medium",
  },
  btn: {
    marginTop: 5,
    justifyContent: "center",
    borderRadius: 15,
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    width: "100%",
    backgroundColor: "black",
  },
  btnText: {
    padding: 14,
    fontSize: 16,
    fontWeight: "semibold",
    color: "white",
  },
  btnLink: {
    textDecorationLine: "underline",
    fontSize: 16,
    paddingVertical: 15,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 20,
    paddingVertical: 20,
    width: "100%",
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  iconBtn: {
    marginVertical: 20,
    flexDirection: "row",
    backgroundColor: Colors.light.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    width: "70%",
  },
});
