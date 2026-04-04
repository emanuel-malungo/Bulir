import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export function AuthFooter({ text, linkText, href }: AuthFooterProps) {
  return (
    <View className="flex-row justify-center mt-auto py-8">
      <Text className="text-gray-500">{text} </Text>
      <Link href={href} asChild>
        <TouchableOpacity>
          <Text className="text-[#1a9788] font-bold">{linkText}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
