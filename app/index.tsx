import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Icon from "@/assets/images/wordle-icon.svg";
import { Link } from "expo-router";
import { format } from "date-fns";
import { Colors } from "@/constants/Colors";

export default function Index() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].background;
  const textColor = Colors[colorScheme ?? "light"].text;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon width={100} height={100} />
        <Text style={styles.title}>ShabDa</Text>
        <Text style={styles.text}>Get 6 Chance to win the ShabDa.</Text>
      </View>

      <View style={styles.menu}>
        <Link
          href="/game"
          style={[styles.btn, { backgroundColor: "#000" }]}
          asChild>
          <TouchableOpacity>
            <Text style={[styles.btnText, styles.primaryText]}>Start Game</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/game" style={styles.btn} asChild>
          <TouchableOpacity>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/game" style={styles.btn} asChild>
          <TouchableOpacity>
            <Text style={styles.btnText}>Subscribe</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerDate}>
          {format(new Date(), "MMMM d, yyyy")}
        </Text>
        <Text>Made with ❤️ from Everyone!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 40,
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: "FrankRuhlLibre_800ExtraBold",
  },
  text: {
    fontSize: 25,
    textAlign: "center",
  },
  menu: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  btn: {
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    width: "60%",
  },
  btnText: {
    padding: 14,
    fontSize: 18,
    fontWeight: "semibold",
    color: "#333",
  },

  primaryText: {
    color: "#fff",
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    textAlign: "center",
  },
  footerDate: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
