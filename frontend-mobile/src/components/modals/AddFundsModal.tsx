import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface AddFundsModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => Promise<void>;
  isLoading?: boolean;
}

export default function AddFundsModal({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}: AddFundsModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    setAmount("");
    setError("");
    onClose();
  };

  const handleConfirm = async () => {
    // Validar
    if (!amount || isNaN(Number(amount))) {
      setError("Insira um valor válido");
      return;
    }

    const numAmount = Number(amount);
    if (numAmount <= 0) {
      setError("O valor deve ser maior que zero");
      return;
    }

    if (numAmount > 1000000) {
      setError("Valor máximo de Kz 1.000.000");
      return;
    }

    try {
      await onConfirm(numAmount);
      Alert.alert("Sucesso", `Kz ${numAmount.toFixed(2)} adicionado à carteira!`);
      handleClose();
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err?.message || "Falha ao adicionar fundos"
      );
    }
  };

  const quickAmounts = [500, 1000, 2500, 5000];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        {/* Overlay */}
        <Pressable onPress={handleClose} className="flex-1" />

        {/* Modal Sheet */}
        <View className="bg-white rounded-t-3xl">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
              {/* Header */}
              <View className="px-6 pt-6 pb-4 border-b border-gray-200">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-2xl font-bold text-gray-900">
                    Adicionar Fundos
                  </Text>
                  <TouchableOpacity onPress={handleClose}>
                    <Ionicons name="close" size={28} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Content */}
              <View className="px-6 py-6 gap-6">
                {/* Input */}
                <View className="gap-2">
                  <Text className="text-gray-700 font-semibold">Valor (Kz)</Text>
                  <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-14 border border-gray-300">
                    <Text className="text-gray-600 font-bold text-lg mr-2">Kz</Text>
                    <TextInput
                      placeholder="0.00"
                      placeholderTextColor="#9CA3AF"
                      value={amount}
                      onChangeText={(text) => {
                        setAmount(text);
                        setError("");
                      }}
                      keyboardType="decimal-pad"
                      editable={!isLoading}
                      className="flex-1 text-gray-900 text-lg font-semibold"
                    />
                  </View>
                  {error && (
                    <Text className="text-red-500 text-sm">{error}</Text>
                  )}
                </View>

                {/* Quick Amounts */}
                <View className="gap-2">
                  <Text className="text-gray-700 font-semibold">Valores Rápidos</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {quickAmounts.map((quickAmount) => (
                      <TouchableOpacity
                        key={quickAmount}
                        onPress={() => {
                          setAmount(quickAmount.toString());
                          setError("");
                        }}
                        disabled={isLoading}
                        className="flex-1 bg-gray-100 rounded-lg py-3 items-center border border-gray-200"
                        style={{ minWidth: "48%" }}
                      >
                        <Text className="text-gray-900 font-semibold text-sm">
                          Kz {quickAmount}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Buttons */}
                <View className="flex-row gap-3 mt-4">
                  <TouchableOpacity
                    onPress={handleClose}
                    className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
                    disabled={isLoading}
                  >
                    <Text className="text-gray-700 font-bold text-sm">
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={isLoading}
                    className="flex-1 rounded-xl overflow-hidden"
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#31ECC6", "#1aa89a"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="py-3 items-center"
                    >
                      <Text className="text-white font-bold text-sm">
                        {isLoading ? "Processando..." : "Confirmar"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
}
