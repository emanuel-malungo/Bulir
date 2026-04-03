import Splash from "@/components/layout/Splash";
import { Text, View, Image, TouchableOpacity, ScrollView, StatusBar } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

  return (
    <Splash />
  )

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="flex-1 px-6 py-8 justify-between">
          {/* Header com Logo */}
          <View className="pt-6">
            <View className="flex-row items-center justify-center gap-3 mb-12">
              <Image
                width={20}
                height={20}
                source={require("../assets/images/bulir.png")}
                className="w-[40px]"
                resizeMode="contain"
              />
              <Text className="text-3xl font-bold text-gray-900">
                Bulir
              </Text>
            </View>
          </View>

          {/* Conteúdo Principal */}
          <View className="flex-1 items-center justify-center">
            {/* Imagem */}
            <View className="mb-12">
              <Image
                width={80}
                height={80}
                source={require("../assets/images/dropshipping.png")}
                resizeMode="contain"
                className="w-[240px] h-[240px]"
              />
            </View>

            {/* Textos */}
            <View className="w-full">
              <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
                Faça sua reserva em{"\n"}
                <Text className="text-3xl font-bold text-[#31ECC6]">
                  um minuto
                </Text>
              </Text>
              
              <Text className="text-base text-gray-600 text-center mt-4 leading-6">
                Prático, rápido e do jeito{"\n"}que você precisa
              </Text>
            </View>
          </View>

          {/* Botões */}
          <View className="w-full gap-3 pb-6">
            <TouchableOpacity 
              activeOpacity={0.8}
              className="bg-[#31ECC6] py-4 rounded-full shadow-lg"
            >
              <Text className="text-white text-lg font-semibold text-center">
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              className="border-2 border-[#31ECC6] py-4 rounded-full"
            >
              <Text className="text-[#31ECC6] text-lg font-semibold text-center">
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
