import { AuthFooter } from "@/components/auth";
import { ErrorAlert } from "@/components/common";
import { loginSchema } from "@/modules/auth/auth.schema";
import { AuthService } from "@/modules/auth/auth.services";
import { useAuthStore } from "@/modules/auth/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => setApiError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setApiError(null);
    try {
      await AuthService.login(data.email, data.password);
    } catch (error) {
      const message = useAuthStore.getState().error || "Erro ao fazer login";
      setApiError(message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" translucent />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-8"
        >
          {/* Decorative Element */}
          
          <View className="mt-20 mb-12">
            <Image source={require("@/assets/images/bulir.png")} className="w-16 h-16" />
            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[4px] mb-2">
              Bem-vindo de volta
            </Text>
            <Text className="text-[#0C2340] text-4xl font-black italic tracking-tighter uppercase leading-tight">
              Acesse sua{"\n"}Conta
            </Text>
          </View>

          {/* Error Message */}
          {apiError && (
            <View className="mb-6">
              <ErrorAlert message={apiError} />
            </View>
          )}

          {/* Form */}
          <View className="gap-5">
            {/* Email Field */}
            <View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-4">Endereço de Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <View className={`flex-row items-center bg-white border ${errors.email ? 'border-red-500' : 'border-gray-50'} rounded-[24px] px-6 h-16 shadow-sm shadow-black/5`}>
                    <Ionicons name="mail-outline" size={20} color={errors.email ? "#ef4444" : "#9ca3af"} />
                    <TextInput
                      className="flex-1 ml-3 text-[#0C2340] font-bold text-sm"
                      placeholder="seu@email.com"
                      placeholderTextColor="#9ca3af"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              {errors.email && <Text className="text-red-500 text-[10px] font-bold mt-1 ml-4">{errors.email.message}</Text>}
            </View>

            {/* Password Field */}
            <View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-4">Sua Senha</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <View className={`flex-row items-center bg-white border ${errors.password ? 'border-red-500' : 'border-gray-50'} rounded-[24px] px-6 h-16 shadow-sm shadow-black/5`}>
                    <Ionicons name="lock-closed-outline" size={20} color={errors.password ? "#ef4444" : "#9ca3af"} />
                    <TextInput
                      className="flex-1 ml-3 text-[#0C2340] font-bold text-sm"
                      placeholder="••••••••"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={onChange}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9ca3af" />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && <Text className="text-red-500 text-[10px] font-bold mt-1 ml-4">{errors.password.message}</Text>}
            </View>

            <TouchableOpacity className="self-end mr-2">
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Esqueceu a senha?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity 
              className="bg-[#0C2340] rounded-[24px] py-5 items-center justify-center mt-4 shadow-xl shadow-black/10"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#31ECC6" />
              ) : (
                <Text className="text-white font-black uppercase text-xs tracking-[2px]">Entrar Agora</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-auto py-10">
            <AuthFooter
              text="Ainda não tem conta?"
              linkText="Cadastre-se"
              href="/(auth)/register"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
