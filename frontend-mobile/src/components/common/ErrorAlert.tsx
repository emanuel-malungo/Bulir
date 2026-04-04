import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface ErrorAlertProps {
  message: string;
  title?: string;
  dismissible?: boolean;
  icon?: "alert-circle" | "warning" | "close-circle";
}

export function ErrorAlert({
  message,
  title,
  dismissible = false,
  icon = "alert-circle",
}: ErrorAlertProps) {
  if (!message) return null;

  return (
    <View className="bg-red-50 border border-red-300 rounded-lg px-4 py-3 mb-6">
      <View className="flex-row gap-3 items-start">
        <Ionicons name={icon} size={20} color="#dc2626" />
        <View className="flex-1">
          {title && (
            <Text className="text-red-800 font-semibold mb-1">{title}</Text>
          )}
          <Text className="text-red-700 text-sm font-mono">{message}</Text>
        </View>
      </View>
    </View>
  );
}
