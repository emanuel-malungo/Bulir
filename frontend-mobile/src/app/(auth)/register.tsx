import { AuthFooter } from "@/components/auth";
import { ErrorAlert, RoleSelector } from "@/components/common";
import { registerFormSchema } from "@/modules/auth/auth.schema";
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

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      nif: "",
      password: "",
      roleId: 2,
    },
  });

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => setApiError(null), 5000); 
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  const onSubmit = async (data: z.infer<typeof registerFormSchema>) => {
    setApiError(null);
    try {
      await AuthService.register({
        fullName: data.fullName,
        email: data.email,
        nif: data.nif,
        password: data.password,
        roleId: data.roleId,
      });
    } catch (error) {
      const message = useAuthStore.getState().error || "Erro ao registrar";
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
          
          <View className="mt-12 mb-8">
            <Image source={require("@/assets/images/bulir.png")} className="w-16 h-16" />
            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[4px] mb-2">
              Junte-se ao Bulir
            </Text>
            <Text className="text-[#0C2340] text-4xl font-black italic tracking-tighter uppercase leading-tight">
              Crie sua{"\n"}Conta
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
             {/* Role Selection */}
             <View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 ml-4">Tipo de Conta</Text>
              <Controller
                control={control}
                name="roleId"
                render={({ field: { onChange, value } }) => (
                  <RoleSelector
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              {errors.roleId && <Text className="text-red-500 text-[10px] font-bold mt-1 ml-4">{errors.roleId.message}</Text>}
            </View>

            {/* Full Name Field */}
            <View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-4">Nome Completo</Text>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, value } }) => (
                  <View className={`flex-row items-center bg-white border ${errors.fullName ? 'border-red-500' : 'border-gray-50'} rounded-[24px] px-6 h-16 shadow-sm shadow-black/5`}>
                    <Ionicons name="person-outline" size={20} color={errors.fullName ? "#ef4444" : "#9ca3af"} />
                    <TextInput
                      className="flex-1 ml-3 text-[#0C2340] font-bold text-sm"
                      placeholder="Seu Nome Completo"
                      placeholderTextColor="#9ca3af"
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              {errors.fullName && <Text className="text-red-500 text-[10px] font-bold mt-1 ml-4">{errors.fullName.message}</Text>}
            </View>

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

            {/* NIF Field */}
            <View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-4">NIF (Identificação Fiscal)</Text>
              <Controller
                control={control}
                name="nif"
                render={({ field: { onChange, value } }) => (
                  <View className={`flex-row items-center bg-white border ${errors.nif ? 'border-red-500' : 'border-gray-50'} rounded-[24px] px-6 h-16 shadow-sm shadow-black/5`}>
                    <Ionicons name="card-outline" size={20} color={errors.nif ? "#ef4444" : "#9ca3af"} />
                    <TextInput
                      className="flex-1 ml-3 text-[#0C2340] font-bold text-sm"
                      placeholder="123456789"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              {errors.nif && <Text className="text-red-500 text-[10px] font-bold mt-1 ml-4">{errors.nif.message}</Text>}
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

            {/* Register Button */}
            <TouchableOpacity 
              className="bg-[#0C2340] rounded-[24px] py-5 items-center justify-center mt-4 shadow-xl shadow-black/10 mb-8"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#31ECC6" />
              ) : (
                <Text className="text-white font-black uppercase text-xs tracking-[2px]">Criar Minha Conta</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="py-10">
            <AuthFooter
              text="Já tem conta?"
              linkText="Entrar agora"
              href="/(auth)"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
