import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface TabScreenConfig {
  name: string;
  title: string;
  icon: IconName;
}

const screens: TabScreenConfig[] = [
  { name: "index", title: "Início", icon: "home-outline" },
  { name: "services", title: "Serviços", icon: "search-outline" },
  { name: "reservations", title: "Reservas", icon: "calendar-outline" },
  { name: "profile", title: "Perfil", icon: "person-outline" },
];

export default function ClientLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        const currentScreen = screens.find((s) => s.name === route.name);

        return {
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#F0F0F0",
            height: 70,
            paddingTop: 8,
            paddingBottom: 12,
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 12,
          },
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => {
            const tabColor = focused ? "#31ECC6" : "#9CA3AF";

            return (
              <View className="items-center gap-1">
                <Ionicons
                  name={currentScreen?.icon || "home"}
                  size={26}
                  color={tabColor}
                />
                {focused && (
                  <View
                    className="h-1 rounded-full"
                    style={{
                      width: 20,
                      backgroundColor: "#31ECC6",
                    }}
                  />
                )}
              </View>
            );
          },
          tabBarActiveTintColor: "#31ECC6",
          tabBarInactiveTintColor: "#9CA3AF",
        };
      }}
    >
      {screens.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            title: screen.title,
          }}
        />
      ))}
    </Tabs>
  );
}