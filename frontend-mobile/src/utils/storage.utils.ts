/**
 * Storage Wrapper - Compatível com Zustand persist
 * 
 * Em Expo Go: Usa apenas Memory Storage (dados perdidos ao fechar app)
 * Em Build EAS: Usa AsyncStorage para persistência real
 * 
 * Para usar AsyncStorage para valer, execute:
 * $ eas build --platform ios (ou android)
 */

import type { StateStorage } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';

// Memory storage - funciona em todos os ambientes
const memoryStorage: Record<string, string> = {};

/**
 * State Storage compatível com Zustand persist
 * - Em Expo Go: usa memory storage
 * - Em build EAS: pode tentar usar AsyncStorage (se disponível)
 */
const createStorageAdapter = (): StateStorage => ({
  getItem: async (key: string): Promise<string | null> => {
    try {
      // Tentar AsyncStorage primeiro (se disponível após build)
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const value = await AsyncStorage.getItem(key);
        return value;
      } catch {
        // Se falhar, continua com memory storage
      }
      
      return memoryStorage[key] ?? null;
    } catch (error) {
      return memoryStorage[key] ?? null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      // Tentar AsyncStorage primeiro (se disponível após build)
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        await AsyncStorage.setItem(key, value);
        return;
      } catch {
        // Se falhar, continua com memory storage
      }
      
      memoryStorage[key] = value;
    } catch (error) {
      memoryStorage[key] = value;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        await AsyncStorage.removeItem(key);
        return;
      } catch {
        // Se falhar, continua com memory storage
      }
      
      delete memoryStorage[key];
    } catch (error) {
      delete memoryStorage[key];
    }
  },
});

export const StorageAdapter = createJSONStorage(createStorageAdapter);

