import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    TouchableOpacityProps
} from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  icon?: IconName;
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
}

const variantStyles = {
  primary: "bg-[#31ECC6] border-[#40d3c2]",
  secondary: "bg-gray-100 border-gray-200",
  danger: "bg-red-100 border-red-200",
  outline: "bg-white border-gray-300",
};

const variantTextStyles = {
  primary: "text-white",
  secondary: "text-gray-700",
  danger: "text-red-600",
  outline: "text-gray-900",
};

const disabledVariantStyles = {
  primary: "bg-gray-400 border-gray-500",
  secondary: "bg-gray-50 border-gray-100",
  danger: "bg-red-50 border-red-100",
  outline: "bg-gray-50 border-gray-200",
};

const sizeStyles = {
  small: "px-4 py-2",
  medium: "px-6 py-3",
  large: "px-6 py-4",
};

const sizeTextStyles = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
};

export function Button({
  label,
  loading = false,
  icon,
  variant = "primary",
  size = "large",
  fullWidth = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const baseStyle =
    variant === "primary" ? "border-b-4 border-x rounded-full" : "rounded-xl";

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      activeOpacity={0.85}
      className={`
        ${baseStyle}
        ${isDisabled ? disabledVariantStyles[variant] : variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        flex-row items-center justify-center gap-2
      `}
    >
      {loading ? (
        <ActivityIndicator
          size="large"
          color={variant === "primary" ? "white" : "#6B7280"}
        />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={
                isDisabled
                  ? "#9CA3AF"
                  : variant === "primary"
                    ? "white"
                    : variantTextStyles[variant]
              }
            />
          )}
          <Text
            className={`
              font-bold
              ${sizeTextStyles[size]}
              ${
                isDisabled
                  ? "text-gray-500"
                  : variantTextStyles[variant]
              }
            `}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
