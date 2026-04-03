import { View, ImageBackground, Image, Text, StatusBar, ActivityIndicator } from "react-native";

export default function Splash() {
  return (
      <ImageBackground
        source={require("@/assets/images/splash.png")}
        resizeMode="cover"
        className="flex-1"
      >
        {/* Overlay para melhorar contraste */}
        <View className="flex-1 bg-black/5 items-center justify-center">
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          {/* Logo + Nome */}
          <View className="flex-row items-center gap-3">
            <Image
              source={require("@/assets/images/bulir.png")}
              className="w-14 h-14"
              resizeMode="contain"
            />
            <Text className="text-4xl font-medium text-white">
              Bulir
            </Text>
          </View>
            {/* Loader */}
            <ActivityIndicator size="large" color="#ffff" className="mt-8" />

        </View>
      </ImageBackground>
  );
}