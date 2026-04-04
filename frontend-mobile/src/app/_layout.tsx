import "@/assets/styles/global.css";
import { useAuthStore } from "@/modules/auth/auth.store";
import { ProtectedRouteMobile } from "@/modules/auth/protected-route-mobile";
import { QueryProvider } from "@/utils/query-client";
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
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

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

  const { checkAuth } = useAuthStore();

  // Inicializar verificação de autenticação ao abrir o app
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return (null);
  }

  return (
    <QueryProvider>
      <ProtectedRouteMobile>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </ProtectedRouteMobile>
    </QueryProvider>
  );
}
