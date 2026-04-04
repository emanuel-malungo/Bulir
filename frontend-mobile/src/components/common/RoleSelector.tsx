import { useRoles } from "@/modules/auth/useRoles";
import type { Ionicons as IconsType } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type IconName = React.ComponentProps<typeof IconsType>["name"];

interface RoleSelectorProps {
  value?: number;
  onChange?: (roleId: number) => void;
  error?: string;
  label?: string;
}

/**
 * Role Selector Component
 * Renders available roles for user selection (CLIENT, PROVIDER)
 * Uses useRoles hook to fetch roles from API
 */
export function RoleSelector({
  value,
  onChange,
  error,
  label = "Selecione seu tipo de conta",
}: RoleSelectorProps) {
  const { roles, isLoading, error: rolesError } = useRoles();

  const handleRoleSelect = (roleId: number) => {
    onChange?.(roleId);
  };

  const getRoleIcon = (roleName: string): IconName => {
    const name = roleName.toUpperCase();
    if (name.includes("PROVIDER")) return "briefcase-outline";
    if (name.includes("CLIENT")) return "person-outline";
    return "help-circle-outline";
  };

  if (isLoading) {
    return (
      <View className="gap-2">
        <Text className="text-sm font-semibold text-gray-700">{label}</Text>
        <View className="flex-row justify-center py-8">
          <ActivityIndicator size="large" color="#31ECC6" />
        </View>
      </View>
    );
  }

  return (
    <View className="gap-3">
      <Text className="text-sm font-semibold text-gray-700">{label}</Text>

      {/* Roles Grid - Side by Side */}
      <View className="flex-row gap-3">
        {roles.map((role) => {
          const isSelected = value === role.id;
          return (
            <TouchableOpacity
              key={role.id}
              onPress={() => handleRoleSelect(role.id)}
              activeOpacity={0.7}
              className="flex-1"
            >
              <View
                className={`
                  p-3 rounded-xl border flex-row items-center gap-2
                  ${
                    isSelected
                      ? "bg-[#31ECC6]/10 border-[#31ECC6]"
                      : "bg-white border-gray-200 "
                  }
                `}
              >
                {/* Role Icon */}
                <View
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${
                      isSelected
                        ? "bg-[#31ECC6]"
                        : "bg-gray-100"
                    }
                  `}
                >
                  <Ionicons
                    name={getRoleIcon(role.name)}
                    size={20}
                    color={isSelected ? "#fff" : "#6B7280"}
                  />
                </View>

                {/* Role Name */}
                <View className="flex-1">
                  <Text
                    className={`font-semibold text-xs ${
                      isSelected ? "text-[#31ECC6]" : "text-gray-900"
                    }`}
                    numberOfLines={1}
                  >
                    {role.name ? role.name == "PROVIDER" ? "Prestador" : "Cliente" : "Desconecido"}
                  </Text>
                </View>

                {/* Checkmark */}
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={16} color="#31ECC6" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Error Message */}
      {(error || rolesError) && (
        <Text className="text-xs text-red-600 font-medium">
          {error || rolesError}
        </Text>
      )}
    </View>
  );
}
