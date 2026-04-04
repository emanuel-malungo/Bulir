import Splash from "@/components/layout/Splash";
import { Text, View, Image, TouchableOpacity, StatusBar, ImageBackground } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <ImageBackground
      source={require("@/assets/images/bg-abstract-white.png")}
      resizeMode="cover"
      className="flex-1 bg-white/"
    >
      {/* Overlay - Cor sobre a imagem de fundo */}
      <View className="absolute inset-0 bg-white/95" />

      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      
      <View className="flex-1 px-6 py-8 justify-between">
        {/* Header com Logo */}
        <View className="mt-12">
          <View className="flex-row items-center justify-center gap-3">
            <Image
              width={40}
              height={40}
              source={require("../assets/images/bulir.png")}
              className="w-[40px] h-[40px]"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-gray-900">
              Bulir
            </Text>
          </View>
        </View>

        {/* Conteúdo Principal - Crescer para ocupar espaço disponível */}
        <View className="flex-1 items-center justify-center">
          {/* Imagem - Responsiva */}
          <View className="mb-8 w-full max-w-sm">
            <Image
              source={require("../assets/images/avatar.png")}
              resizeMode="contain"
              className="w-screen h-72 max-h-80"
            />
          </View>

          {/* Textos */}
          <View className="w-full">
            <Text className="text-3xl md:text-3xl font-bold text-center text-gray-900 mb-3">
              Bem-vindo ao Bulir
            </Text>
            
            <Text className="text-sm md:text-base text-gray-600 text-center mt-3= leading-6">
              Conecte-se ao Bulir e agende serviços de prestadores de serviços de forma rápida e fácil. Encontre profissionais confiáveis para suas necessidades diárias.
            </Text>
          </View>
        </View>

        {/* Botões - Fixo no Rodapé */}
        <View className="w-full gap-4 mb-8">
          <TouchableOpacity 
            activeOpacity={0.85}
            className="bg-[#31ECC6] py-4 rounded-full shadow-lg"
          >
            <Text className="text-white text-base md:text-lg font-bold text-center">
              Entrar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.85}
            className="border-2 border-[#31ECC6] bg-white/40 py-4 rounded-full shadow-md"
          >
            <Text className="text-[#1a9788] text-base md:text-lg font-bold text-center">
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
