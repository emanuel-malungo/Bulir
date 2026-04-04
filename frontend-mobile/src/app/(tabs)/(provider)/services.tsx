import { useAuthStore } from "@/modules/auth/auth.store";
import { useCreateService, useDeleteService, useServices, useUpdateService } from "@/modules/service/useService";
import { IServiceListItem } from "@/modules/service/service.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProviderServicesScreen() {
  const { user } = useAuthStore();
  const router = useRouter();

  // State for Modal and Form
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<IServiceListItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    isActive: true,
  });

  // Fetching data
  const { data: servicesData, isLoading, refetch } = useServices({
    providerId: user?.id,
  });

  // Mutations
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  const services = servicesData?.data ?? [];

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", isActive: true });
    setEditingService(null);
  };

  // Open modal for editing
  const handleEdit = (service: IServiceListItem) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      isActive: service.isActive,
    });
    setModalVisible(true);
  };

  // Open modal for creating
  const handleAdd = () => {
    resetForm();
    setModalVisible(true);
  };

  // Submit form
  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      Alert.alert("Erro", "Por favor, preencha o nome e o preço.");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
    };

    try {
      if (editingService) {
        await updateServiceMutation.mutateAsync({
          providerId: user!.id,
          data: { ...payload, id: editingService.id, isActive: formData.isActive },
        });
      } else {
        await createServiceMutation.mutateAsync({
          providerId: user!.id,
          data: payload,
        });
      }
      setModalVisible(false);
      resetForm();
      refetch();
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar o serviço.");
    }
  };

  // Handle delete
  const handleDelete = (id: number) => {
    Alert.alert(
      "Excluir Serviço",
      "Tem certeza que deseja excluir este serviço permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteServiceMutation.mutateAsync({ id, providerId: user!.id });
              refetch();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir o serviço.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="white" translucent />

      {/* Header (Consistent with Dashboard) */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-gray-100">
        <View>
          <Text className="text-[#0C2340] text-lg font-bold">
            Gerenciamento
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center bg-gray-50"
            onPress={() => {}}
          >
            <Ionicons name="settings-outline" size={20} color="#0C2340" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-full border border-[#31ECC6] items-center justify-center bg-gray-50 overflow-hidden"
            onPress={() => router.push("/(tabs)/(provider)/profile")}
          >
            <Ionicons name="person" size={20} color="#31ECC6" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 pt-8">
        {/* Title and Quick Action */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-[#0C2340] text-3xl font-black italic uppercase tracking-tighter">
              Meus Serviços
            </Text>
            <Text className="text-gray-400 text-xs mt-1 font-medium">
              Gerencie seus serviços ativos
            </Text>
          </View>
          <TouchableOpacity
            className="w-14 h-14 bg-[#31ECC6] rounded-[22px] items-center justify-center"
            onPress={handleAdd}
          >
            <Ionicons name="add" size={32} color="#0C2340" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator color="#31ECC6" size="large" />
          </View>
        ) : services.length === 0 ? (
          <View className="border border-dashed border-gray-200 rounded-[40px] py-20 items-center bg-gray-50/30">
            <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center mb-6 border border-gray-100">
              <Ionicons name="briefcase-outline" size={36} color="#d1d5db" />
            </View>
            <Text className="text-[#0C2340] font-black text-xl uppercase">Nenhum serviço</Text>
            <Text className="text-gray-400 text-center px-12 mt-3 leading-5">
              Você ainda não cadastrou nenhum serviço para oferecer aos clientes.
            </Text>
            <TouchableOpacity 
              className="mt-8 bg-[#0C2340] px-10 py-4 rounded-2xl"
              onPress={handleAdd}
            >
               <Text className="text-white font-bold uppercase text-xs tracking-widest">Adicionar Primeiro</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-6 pb-20">
            {services.map((service) => (
              <View 
                key={service.id} 
                className="bg-white border border-gray-100 rounded-[36px] p-6"
              >
                <View className="flex-row justify-between items-start mb-5">
                  <View className="flex-1">
                    <Text className="text-[#0C2340] font-black text-xl" numberOfLines={1}>
                      {service.name}
                    </Text>
                    <View className="flex-row items-center gap-3 mt-2">
                      <View className={`px-3 py-1 rounded-full border ${service.isActive ? 'bg-[#31ECC6]/10 border-[#31ECC6]/30' : 'bg-red-50 border-red-100'}`}>
                        <Text className={`text-[10px] font-black uppercase tracking-wider ${service.isActive ? 'text-[#31ECC6]' : 'text-red-400'}`}>
                          {service.isActive ? 'Ativo' : 'Pausado'}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                         <Ionicons name="star" size={14} color="#31ECC6" />
                         <Text className="text-[#0C2340] text-xs font-black">4.9</Text>
                      </View>
                    </View>
                  </View>
                  <View className="bg-[#31ECC6]/10 px-4 py-2 rounded-2xl border border-[#31ECC6]/20">
                    <Text className="text-[#31ECC6] font-black text-lg">
                      Kz {Number(service.price).toLocaleString('pt-AO')}
                    </Text>
                  </View>
                </View>

                <Text className="text-gray-400 text-sm leading-6 mb-8" numberOfLines={2}>
                    {service.description || 'Este serviço ainda não possui uma descrição detalhada cadastrada pelo provedor.'}
                </Text>

                <View className="flex-row gap-3">
                  <TouchableOpacity 
                    className="flex-1 bg-[#0C2340] py-4 rounded-[20px] items-center justify-center"
                    onPress={() => handleEdit(service)}
                  >
                    <Text className="text-white font-bold text-xs uppercase tracking-widest">Editar Serviço</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="w-14 h-14 bg-red-50 border border-red-100 rounded-[20px] items-center justify-center"
                    onPress={() => handleDelete(service.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* MODAL: Criar / Editar Serviço */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[48px] p-8 pb-12 border-t-4 border-[#31ECC6]">
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-[#0C2340] text-2xl font-black italic uppercase tracking-tighter">
                {editingService ? "Editar Serviço" : "Novo Serviço"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={32} color="#0C2340" />
              </TouchableOpacity>
            </View>

            <View className="gap-5">
              <View>
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-4">Nome do Serviço</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-100 rounded-[24px] px-6 py-4 text-[#0C2340] font-bold"
                  placeholder="Ex: Pintura Residencial"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                />
              </View>

              <View>
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-4">Preço (Kz)</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-100 rounded-[24px] px-6 py-4 text-[#0C2340] font-bold"
                  placeholder="Ex: 5000"
                  keyboardType="numeric"
                  value={formData.price}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                />
              </View>

              <View>
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2 ml-4">Descrição</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-100 rounded-[24px] px-6 py-4 text-[#0C2340] font-bold h-32"
                  placeholder="O que está incluso?"
                  multiline
                  textAlignVertical="top"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                />
              </View>

              {editingService && (
                <TouchableOpacity 
                   className="flex-row items-center gap-3 px-4 py-2"
                   onPress={() => setFormData({ ...formData, isActive: !formData.isActive })}
                >
                   <View className={`w-12 h-6 rounded-full px-1 justify-center ${formData.isActive ? 'bg-[#31ECC6]' : 'bg-gray-300'}`}>
                      <View className={`w-4 h-4 rounded-full bg-white ${formData.isActive ? 'self-end' : 'self-start'}`} />
                   </View>
                   <Text className="text-[#0C2340] font-bold">Serviço Ativo</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                className="bg-[#31ECC6] rounded-[24px] py-5 items-center justify-center mt-4 border border-[#31ECC6]"
                onPress={handleSubmit}
                disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
              >
                {createServiceMutation.isPending || updateServiceMutation.isPending ? (
                  <ActivityIndicator color="#0C2340" />
                ) : (
                  <Text className="text-[#0C2340] font-black uppercase tracking-widest">
                    {editingService ? "Salvar Alterações" : "Publicar Serviço"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
