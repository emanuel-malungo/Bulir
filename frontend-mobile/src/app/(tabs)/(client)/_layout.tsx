import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface TabScreenConfig {
  name: string;
  title: string;
  icon: IconName;
}

const screens: TabScreenConfig[] = [
  { name: "index", title: "Explorar", icon: "compass-outline" },
  { name: "services", title: "Serviços", icon: "search-outline" },
  { name: "reservations", title: "Reservas", icon: "calendar-outline" },
  { name: "profile", title: "Perfil", icon: "person-outline" },
];

export default function ClientLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => {
        const currentScreen = screens.find((s) => s.name === route.name);

        return {
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
            height: Platform.OS === 'ios' ? 88 : 72,
            borderRadius: 32,
            paddingBottom: Platform.OS === 'ios' ? 32 : 12,
            paddingTop: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            elevation: 10,
          },
          tabBarLabel: ({ focused }) => (
            <Text 
              className={`text-[8px] font-black uppercase tracking-[2px] mt-1.5 ${focused ? 'text-[#0C2340]' : 'text-gray-300'}`}
            >
              {currentScreen?.title}
            </Text>
          ),
          tabBarIcon: ({ focused }) => {
            const activeIcon = currentScreen?.icon.replace("-outline", "") as IconName;
            const iconName = focused ? activeIcon : currentScreen?.icon;
            
            return (
              <View className="items-center justify-center">
                <View 
                  className={`w-12 h-8 rounded-2xl items-center justify-center mb-0.5 ${focused ? 'bg-[#31ECC6]/10' : 'bg-transparent'}`}
                >
                  <Ionicons
                    name={iconName || "home"}
                    size={22}
                    color={focused ? "#31ECC6" : "#D1D1D6"}
                  />
                </View>
              </View>
            );
          },
          tabBarActiveTintColor: "#31ECC6",
          tabBarInactiveTintColor: "#D1D1D1",
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
