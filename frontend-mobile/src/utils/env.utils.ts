
/**
 * Environment variables for mobile (Expo)
 * Load from process.env (set via .env file at root)
 */

const ENV = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.249.71:4000/api',
};

// Validar variáveis críticas
// API_BASE_URL será sempre configurada com valor default se não definido

export default ENV;