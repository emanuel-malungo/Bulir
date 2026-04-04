import { Ionicons } from "@expo/vector-icons";
import {
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface InputProps extends TextInputProps {
  label?: string;
  icon?: IconName;
  error?: string;
  showPasswordToggle?: boolean;
  onPasswordToggle?: (visible: boolean) => void;
  showPassword?: boolean;
}

export function Input({
  label,
  icon,
  error,
  showPasswordToggle = false,
  onPasswordToggle,
  showPassword = false,
  secureTextEntry,
  ...props
}: InputProps) {
  return (
    <View>
      {label && (
        <Text className="text-gray-700 font-semibold mb-2 ml-1">{label}</Text>
      )}

      <View
        className={`flex-row items-center bg-white rounded-full px-4 h-14 border ${
          error ? "border-red-300" : "border-gray-300"
        }`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? "#dc2626" : "#9ca3af"}
          />
        )}

        <TextInput
          {...props}
          secureTextEntry={showPasswordToggle && !showPassword ? true : secureTextEntry}
          className={`flex-1 ${icon ? "ml-3" : ""} text-gray-900`}
          placeholderTextColor="#d1d5db"
        />

        {showPasswordToggle && onPasswordToggle && (
          <TouchableOpacity
            onPress={() => onPasswordToggle?.(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
