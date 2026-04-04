import type { IServiceListItem } from "@/modules/service/service.types";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ScheduleServiceModalProps {
  visible: boolean;
  service: IServiceListItem | null;
  onClose: () => void;
  onConfirm: (data: { date: string; time: string }) => void;
  isLoading?: boolean;
}

export default function ScheduleServiceModal({
  visible,
  service,
  onClose,
  onConfirm,
  isLoading = false,
}: ScheduleServiceModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState<{
    date?: string;
    time?: string;
  }>({});

  const handleConfirm = () => {
    const newErrors: typeof errors = {};

    if (!selectedDate) {
      newErrors.date = "Selecione uma data";
    }
    if (!selectedTime) {
      newErrors.time = "Selecione um horário";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dateStr = selectedDate
      .toLocaleDateString('pt-BR')
      .split('/')
      .reverse()
      .join('-');
    
    const timeStr = selectedTime
      .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });

    onConfirm({
      date: dateStr,
      time: timeStr,
    });
  };

  const handleClose = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setShowDatePicker(false);
    setShowTimePicker(false);
    setErrors({});
    onClose();
  };

  const handleOpenDatePicker = () => {
    if (Platform.OS === "android") {
      // Android: Use imperative API (recomendado pela doc)
      DateTimePickerAndroid.open({
        value: selectedDate || new Date(),
        onValueChange: (event: any, date: Date) => {
          if (date) {
            setSelectedDate(date);
            if (errors.date) {
              setErrors({ ...errors, date: undefined });
            }
          }
        },
        onDismiss: () => {
          // Usuário cancelou sem selecionar
        },
        mode: "date",
        display: "calendar",
        minimumDate: new Date(),
        positiveButton: { label: "OK", textColor: "#31ECC6" },
        negativeButton: { label: "Cancelar", textColor: "#6B7280" },
      });
    } else {
      // iOS: Use component API
      setShowDatePicker(true);
    }
  };

  const handleOpenTimePicker = () => {
    if (Platform.OS === "android") {
      // Android: Use imperative API (recomendado pela doc)
      DateTimePickerAndroid.open({
        value: selectedTime || new Date(),
        onValueChange: (event: any, time: Date) => {
          if (time) {
            setSelectedTime(time);
            if (errors.time) {
              setErrors({ ...errors, time: undefined });
            }
          }
        },
        onDismiss: () => {
          // Usuário cancelou sem selecionar
        },
        mode: "time",
        display: "clock",
        is24Hour: true,
        minuteInterval: 15,
        positiveButton: { label: "OK", textColor: "#31ECC6" },
        negativeButton: { label: "Cancelar", textColor: "#6B7280" },
      });
    } else {
      // iOS: Use component API
      setShowTimePicker(true);
    }
  };

  const handleDateChange = (event: any, date: Date | undefined) => {
    if (Platform.OS === "ios") {
      if (event.type === "set" && date) {
        setSelectedDate(date);
        setShowDatePicker(false);
        if (errors.date) {
          setErrors({ ...errors, date: undefined });
        }
      } else if (event.type === "dismissed") {
        setShowDatePicker(false);
      }
    }
  };

  const handleTimeChange = (event: any, time: Date | undefined) => {
    if (Platform.OS === "ios") {
      if (event.type === "set" && time) {
        setSelectedTime(time);
        setShowTimePicker(false);
        if (errors.time) {
          setErrors({ ...errors, time: undefined });
        }
      } else if (event.type === "dismissed") {
        setShowTimePicker(false);
      }
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        {/* Overlay - touch pra fechar */}
        <Pressable 
          onPress={handleClose}
          className="flex-1"
        />

        {/* Modal Sheet - conteúdo branco */}
        <View className="bg-white rounded-t-3xl">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            {/* Header */}
            <View className="px-6 pt-6 pb-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-2xl font-bold text-gray-900">
                  Agendar Serviço
                </Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons name="close" size={28} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Service Info */}
            {service && (
              <View className="px-6 pt-6 pb-4 bg-gradient-to-br from-[#31ECC6]/10 to-transparent">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {service.name}
                </Text>
                <View className="flex-row items-center gap-1 mb-2">
                  <Ionicons name="person" size={12} color="#9CA3AF" />
                  <Text className="text-gray-600 text-xs">
                    {service.provider?.fullName}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="pricetag" size={12} color="#31ECC6" />
                  <Text className="font-bold text-[#31ECC6] text-xs">
                    R$ {typeof service.price === 'number' ? service.price.toFixed(2) : '0.00'}
                  </Text>
                </View>
              </View>
            )}

            {/* Form Content */}
            <View className="px-6 py-6">
              {/* Date Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-900 mb-2">
                  Data do Agendamento
                </Text>
                <TouchableOpacity
                  onPress={handleOpenDatePicker}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between"
                >
                  <Text className={selectedDate ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}>
                    {selectedDate
                      ? selectedDate.toLocaleDateString('pt-BR')
                      : "Selecione uma data"}
                  </Text>
                  <Ionicons name="calendar" size={20} color="#31ECC6" />
                </TouchableOpacity>
                {errors.date && (
                  <Text className="text-red-600 text-xs mt-1">{errors.date}</Text>
                )}
              </View>

              {/* Time Input */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-900 mb-2">
                  Horário
                </Text>
                <TouchableOpacity
                  onPress={handleOpenTimePicker}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between"
                >
                  <Text className={selectedTime ? "text-gray-900 text-sm" : "text-gray-400 text-sm"}>
                    {selectedTime
                      ? selectedTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
                      : "Selecione um horário"}
                  </Text>
                  <Ionicons name="time" size={20} color="#31ECC6" />
                </TouchableOpacity>
                {errors.time && (
                  <Text className="text-red-600 text-xs mt-1">{errors.time}</Text>
                )}
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3">
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
                      {isLoading ? "Agendando..." : "Confirmar"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        </View>

        {/* Date Picker - iOS */}
        {showDatePicker && Platform.OS === "ios" && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            minimumDate={new Date()}
            textColor="#1f2937"
            accentColor="#31ECC6"
            themeVariant="light"
          />
        )}

        {/* Time Picker - iOS */}
        {showTimePicker && Platform.OS === "ios" && (
          <DateTimePicker
            value={selectedTime || new Date()}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
            is24Hour={true}
            minuteInterval={15}
            textColor="#1f2937"
            accentColor="#31ECC6"
            themeVariant="light"
          />
        )}
      </View>
    </Modal>
  );
}
