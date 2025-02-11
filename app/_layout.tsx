import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  FrankRuhlLibre_300Light,
  FrankRuhlLibre_400Regular,
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_600SemiBold,
  FrankRuhlLibre_700Bold,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_900Black,
} from "@expo-google-fonts/frank-ruhl-libre";
import { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { TouchableOpacity, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@/utils/cache";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

// ✅ Ensure the environment variable is checked first
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // ✅ Prevent auto-hiding the splash screen inside useEffect
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  let [fontsLoaded] = useFonts({
    FrankRuhlLibre_300Light,
    FrankRuhlLibre_400Regular,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_600SemiBold,
    FrankRuhlLibre_700Bold,
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="login"
                  options={{
                    presentation: "modal",
                    headerShadowVisible: false,
                    headerTitle: "Login",
                    headerLeft: () => (
                      <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons
                          name="close"
                          size={26}
                          color={
                            colorScheme === "dark"
                              ? Colors.dark.gray
                              : Colors.light.gray
                          }
                        />
                      </TouchableOpacity>
                    ),
                  }}
                />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
