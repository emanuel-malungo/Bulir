import { Image, Text, View } from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <>
      {/* Logo and Brand */}
      <View className="mt-16 mb-4 flex-row items-center justify-center gap-3">
        <Image
          source={require("../../assets/images/bulir.png")}
          className="w-16 h-16"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-900">Bulir</Text>
      </View>

      {/* Welcome Text */}
      <View className="mb-10">
        <Text className="text-3xl text-center text-gray-900 mb-2">
          {title}
        </Text>
        <Text className="text-gray-500 text-center text-base">
          {subtitle}
        </Text>
      </View>
    </>
  );
}
