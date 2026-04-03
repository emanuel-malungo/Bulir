import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";
import {
  Rubik_300Light,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "@/assets/styles/global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Poppins
    Poppins_100: Poppins_100Thin,
    Poppins_200: Poppins_200ExtraLight,
    Poppins_300: Poppins_300Light,
    Poppins_400: Poppins_400Regular,
    Poppins_500: Poppins_500Medium,
    Poppins_600: Poppins_600SemiBold,
    Poppins_700: Poppins_700Bold,
    Poppins_800: Poppins_800ExtraBold,
    Poppins_900: Poppins_900Black,
    // Rubik
    Rubik_300: Rubik_300Light,
    Rubik_400: Rubik_400Regular,
    Rubik_500: Rubik_500Medium,
    Rubik_600: Rubik_600SemiBold,
    Rubik_700: Rubik_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return (null);
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
