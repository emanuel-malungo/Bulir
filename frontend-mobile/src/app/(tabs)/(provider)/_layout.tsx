import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, Text, Platform } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface TabScreenConfig {
  name: string;
  title: string;
  icon: IconName;
}

const screens: TabScreenConfig[] = [
  { name: "index", title: "Painel", icon: "grid-outline" },
  { name: "services", title: "Serviços", icon: "briefcase-outline" },
  { name: "profile", title: "Perfil", icon: "person-outline" },
];

export default function ProviderLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        const currentScreen = screens.find((s) => s.name === route.name);

        return {
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 2,
            borderTopColor: "#F8F8F8",
            height: Platform.OS === 'ios' ? 95 : 85,
            paddingBottom: Platform.OS === 'ios' ? 35 : 15,
            paddingTop: 12,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabel: ({ focused }) => (
            <Text 
              className={`text-[9px] font-black uppercase tracking-widest mt-2 ${focused ? 'text-[#0C2340]' : 'text-gray-400'}`}
            >
              {currentScreen?.title}
            </Text>
          ),
          tabBarIcon: ({ focused }) => {
            const activeIcon = currentScreen?.icon.replace("-outline", "") as IconName;
            const iconName = focused ? activeIcon : currentScreen?.icon;
            
            return (
              <View className={`items-center justify-center w-12 h-12 rounded-[18px] mb-1 ${focused ? 'bg-[#31ECC6] border border-[#31ECC6]' : 'bg-transparent'}`}>
                <Ionicons
                  name={iconName || "home"}
                  size={20}
                  color={focused ? "#0C2340" : "#D1D5DB"}
                />
              </View>
            );
          },
          tabBarActiveTintColor: "#0C2340",
          tabBarInactiveTintColor: "#D1D5DB",
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
