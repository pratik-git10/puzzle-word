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
import ThemedText from "@/components/ThemedText";
import { useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SubscribeModal from "@/components/SubscribeModal";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function Index() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].background;
  const textColor = Colors[colorScheme ?? "light"].text;
  const subscribeModalRef = useRef<BottomSheetModal>(null);

  const handlePresentSubscribeModal = () =>
    subscribeModalRef.current?.present();

  const { signOut } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <SubscribeModal ref={subscribeModalRef} />
      <Animated.View style={styles.header} entering={FadeInDown}>
        <Icon width={100} height={100} />
        <ThemedText style={styles.title}>ShabDa</ThemedText>
        <ThemedText style={styles.text}>
          Get 6 Chance to win the puzzle in 5 steps
        </ThemedText>
      </Animated.View>

      <View style={styles.menu}>
        <Link
          href={"/game"}
          style={[styles.btn, { backgroundColor: "#000" }]}
          asChild>
          <AnimatedTouchableOpacity entering={FadeInLeft}>
            <Text style={[styles.btnText, styles.primaryText]}>Start</Text>
          </AnimatedTouchableOpacity>
        </Link>

        <SignedOut>
          <Link
            href={"/login"}
            style={[styles.btn, { borderColor: textColor }]}
            asChild>
            <AnimatedTouchableOpacity entering={FadeInLeft.delay(100)}>
              <ThemedText style={styles.btnText}>Log in</ThemedText>
            </AnimatedTouchableOpacity>
          </Link>
        </SignedOut>

        <SignedIn>
          <AnimatedTouchableOpacity
            entering={FadeInLeft.delay(200)}
            style={[styles.btn, { borderColor: textColor }]}
            onPress={() => signOut()}>
            <ThemedText style={styles.btnText}>Sign Out</ThemedText>
          </AnimatedTouchableOpacity>
        </SignedIn>

        <AnimatedTouchableOpacity
          entering={FadeInLeft.delay(300)}
          onPress={handlePresentSubscribeModal}
          style={[styles.btn, { borderColor: textColor }]}>
          <ThemedText style={styles.btnText}>Subscribe</ThemedText>
        </AnimatedTouchableOpacity>
      </View>
      <Animated.View style={styles.footer} entering={FadeIn.delay(300)}>
        <Text style={styles.footerDate}>
          {format(new Date(), "MMMM d, yyyy")}
        </Text>
        <Text style={styles.footerLine}>Made with ❤️ from Everyone!</Text>
      </Animated.View>
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
  bullet: {
    fontSize: 16,
    marginBottom: 5,
  },
  primaryText: {
    color: "#fff",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#333",
    padding: 15,
    alignItems: "center",
  },
  footerLine: {
    color: "white",
  },
  footerDate: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
