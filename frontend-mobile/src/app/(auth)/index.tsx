import { AuthFooter, AuthHeader } from "@/components/auth";
import { Button, ErrorAlert, Input } from "@/components/common";
import { loginSchema } from "@/modules/auth/auth.schema";
import { AuthService } from "@/modules/auth/auth.services";
import { useAuthStore } from "@/modules/auth/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  View
} from "react-native";
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View className="flex-1 bg-white">
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-6"
        >
          <AuthHeader
            title="Bem-vindo de volta!"
            subtitle="Acesse sua conta para continuar."
          />

          {/* Error Message */}
          {apiError && <ErrorAlert message={apiError} />}

          {/* Form */}
          <View className="gap-6">
            {/* Email Field */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  icon="mail-outline"
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}
            />

            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Senha"
                  icon="lock-closed-outline"
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  showPasswordToggle
                  showPassword={showPassword}
                  onPasswordToggle={setShowPassword}
                />
              )}
            />

            {/* Login Button */}
            <Button 
              label="Entrar"
              loading={isLoading}
              disabled={isLoading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>

          <AuthFooter
            text="Ainda não tem conta?"
            linkText="Cadastre-se"
            href="/(auth)/register"
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
