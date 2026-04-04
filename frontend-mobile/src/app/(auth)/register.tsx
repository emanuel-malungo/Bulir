import { AuthFooter, AuthHeader } from "@/components/auth";
import { Button, ErrorAlert, Input, RoleSelector } from "@/components/common";
import { registerFormSchema } from "@/modules/auth/auth.schema";
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

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
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
            title="Crie sua conta"
            subtitle="Junte-se ao Bulir e comece a agendar."
          />

          {/* Error Message */}
          {apiError && (
            <ErrorAlert
              title="Erro ao registrar"
              message={apiError}
              icon="alert-circle"
            />
          )}

          {/* Form */}
          <View className="gap-4">
            {/* Role Selection */}
            <Controller
              control={control}
              name="roleId"
              render={({ field: { onChange, value } }) => (
                <RoleSelector
                  value={value}
                  onChange={onChange}
                  error={errors.roleId?.message}
                  label="Selecione seu tipo de conta"
                />
              )}
            />

            {/* Full Name Field */}
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Nome Completo"
                  icon="person-outline"
                  placeholder="Seu Nome Completo"
                  value={value}
                  onChangeText={onChange}
                  error={errors.fullName?.message}
                />
              )}
            />

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

            {/* NIF Field */}
            <Controller
              control={control}
              name="nif"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="NIF"
                  icon="card-outline"
                  placeholder="123456789"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  error={errors.nif?.message}
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

            {/* Register Button */}
            <Button 
              label="Criar Conta"
              loading={isLoading}
              disabled={isLoading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>

          <AuthFooter
            text="Já tem conta?"
            linkText="Entrar"
            href="/(auth)"
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

