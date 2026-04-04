import { Ionicons } from "@expo/vector-icons";
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
    ActivityIndicator,
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
      Alert.alert("Sucesso", `Kz ${numAmount.toLocaleString("pt-AO", { minimumFractionDigits: 2 })} adicionado à carteira!`);
      handleClose();
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err?.message || "Falha ao adicionar fundos"
      );
    }
  };

  const quickAmounts = [1000, 2000, 5000, 10000];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(12, 35, 64, 0.6)" }}>
        {/* Overlay */}
        <Pressable onPress={handleClose} className="flex-1" />

        {/* Modal Sheet */}
        <View className="bg-white rounded-t-[40px] px-6 pb-10 pt-8 border-t-2 border-emerald-50">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
              {/* Header */}
              <View className="flex-row items-center justify-between mb-8">
                <View>
                  <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    Carteira Digital
                  </Text>
                  <Text className="text-[#0C2340] text-2xl font-black uppercase italic tracking-tighter">
                    Adicionar Fundos
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={handleClose}
                  className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="close" size={24} color="#0C2340" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View className="gap-8">
                {/* Input */}
                <View className="gap-3">
                  <Text className="text-[#0C2340] font-black uppercase text-[10px] tracking-widest ml-1">
                    Quanto deseja carregar?
                  </Text>
                  <View className="flex-row items-center bg-gray-50 border-2 border-gray-100 rounded-[28px] px-6 h-20 gap-4">
                    <View className="w-12 h-12 bg-[#31ECC6] rounded-[18px] items-center justify-center">
                       <Text className="text-[#0C2340] font-black italic">Kz</Text>
                    </View>
                    <TextInput
                      placeholder="0,00"
                      placeholderTextColor="#9ca3af"
                      value={amount}
                      onChangeText={(text) => {
                        setAmount(text);
                        setError("");
                      }}
                      keyboardType="decimal-pad"
                      editable={!isLoading}
                      className="flex-1 text-[#0C2340] text-3xl font-black italic tracking-tighter"
                    />
                  </View>
                  {error && (
                    <Text className="text-red-500 text-[10px] font-bold uppercase ml-4">{error}</Text>
                  )}
                </View>

                {/* Quick Amounts */}
                <View className="gap-4">
                  <Text className="text-[#0C2340] font-black uppercase text-[10px] tracking-widest ml-1">
                    Sugestões
                  </Text>
                  <View className="flex-row flex-wrap gap-3">
                    {quickAmounts.map((quickAmount) => {
                      const isSelected = amount === quickAmount.toString();
                      return (
                        <TouchableOpacity
                          key={quickAmount}
                          onPress={() => {
                            setAmount(quickAmount.toString());
                            setError("");
                          }}
                          disabled={isLoading}
                          className="flex-1 min-w-[45%] h-14 rounded-[20px] items-center justify-center border-2"
                          style={{
                            backgroundColor: isSelected ? "#31ECC6" : "#fff",
                            borderColor: isSelected ? "#31ECC6" : "#f3f4f6",
                          }}
                        >
                          <Text className={`font-black italic text-sm ${isSelected ? 'text-[#0C2340]' : 'text-gray-400'}`}>
                            Kz {quickAmount.toLocaleString("pt-AO")}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Footer Actions */}
                <View className="flex-row gap-4 mt-4">
                  <TouchableOpacity
                    onPress={handleClose}
                    className="flex-1 py-5 rounded-[24px] bg-gray-50 items-center border border-gray-100"
                    disabled={isLoading}
                  >
                    <Text className="text-gray-400 font-black uppercase text-[10px] tracking-widest">
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={isLoading}
                    className="flex-[1.5] py-5 rounded-[24px] bg-[#0C2340] items-center flex-row justify-center gap-3 shadow-lg shadow-[#0C2340]/20"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#31ECC6" size="small" />
                    ) : (
                      <Ionicons name="flash" size={16} color="#31ECC6" />
                    )}
                    <Text className="text-white font-black uppercase text-[10px] tracking-widest">
                      {isLoading ? "Processando" : "Confirmar Carga"}
                    </Text>
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
