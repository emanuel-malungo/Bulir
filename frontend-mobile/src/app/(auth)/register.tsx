import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  StatusBar, 
  ImageBackground, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ImageBackground
        source={require("@/assets/images/bg-abstract-white.png")}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="absolute inset-0 bg-white/95" />

        <StatusBar barStyle="dark-content" />

        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-6"
        >
          {/* Header */}
          <View className="mt-16 mb-8 flex-row items-center justify-center gap-3">
            <Image
              source={require("../../assets/images/bulir.png")}
              className="w-10 h-10"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-gray-900">Bulir</Text>
          </View>

          {/* Welcome Text */}
          <View className="mb-8 text-center">
            <Text className="text-3xl font-bold text-gray-900 mb-2">Crie sua conta</Text>
            <Text className="text-gray-500 text-base">Junte-se ao Bulir e comece a agendar serviços.</Text>
          </View>

          {/* Form */}
          <View className="gap-5">
            {/* Name Field */}
            <View>
              <Text className="text-gray-700 font-medium mb-2 ml-1">Nome completo</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
                <Ionicons name="person-outline" size={20} color="#9ca3af" />
                <TextInput
                  placeholder="Seu Nome"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 ml-3 text-gray-900"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Email Field */}
            <View>
              <Text className="text-gray-700 font-medium mb-2 ml-1">E-mail</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
                <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                <TextInput
                  placeholder="seu@email.com"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 ml-3 text-gray-900"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Field */}
            <View>
              <Text className="text-gray-700 font-medium mb-2 ml-1">Senha</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 ml-3 text-gray-900"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              activeOpacity={0.85}
              className="bg-[#31ECC6] py-4 rounded-full mt-4 shadow-lg shadow-[#31ECC6]/30"
              onPress={() => {/* Handle register */}}
            >
              <Text className="text-white text-lg font-bold text-center">Registrar</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-[1px] bg-gray-200" />
              <Text className="mx-4 text-gray-400 font-medium">ou continuar com</Text>
              <View className="flex-1 h-[1px] bg-gray-200" />
            </View>

            {/* Social Logins */}
            <View className="flex-row gap-4 mb-4">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center border border-gray-200 bg-white py-3.5 rounded-2xl">
                <Ionicons name="logo-google" size={20} color="#EA4335" />
                <Text className="ml-2 font-semibold text-gray-700">Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-1 flex-row items-center justify-center border border-gray-200 bg-white py-3.5 rounded-2xl">
                <Ionicons name="logo-apple" size={20} color="#000" />
                <Text className="ml-2 font-semibold text-gray-700">Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer - Login */}
          <View className="flex-row justify-center mt-auto py-8">
            <Text className="text-gray-500">Já tem uma conta? </Text>
            <Link href="/(auth)/index" asChild>
              <TouchableOpacity>
                <Text className="text-[#1a9788] font-bold">Entrar</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
