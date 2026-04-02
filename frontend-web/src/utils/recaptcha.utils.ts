export interface ReCaptchaConfig {
  siteKey: string;
}

export type ReCaptchaCallback = (token: string) => void;

/**
 * Carrega o script do reCAPTCHA v2 dinamicamente
 */
export const loadRecaptchaScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Verificar se já está carregado
    if (window.grecaptcha) {
      resolve();
      return;
    }

    // Verificar se o script já foi adicionado
    if (document.getElementById('recaptcha-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Erro ao carregar reCAPTCHA'));

    document.head.appendChild(script);
  });
};

/**
 * Registra o callback global para reCAPTCHA
 */
export const registerRecaptchaCallback = (callback: ReCaptchaCallback): void => {
  window.handleCaptchaChange = callback;
};

/**
 * Remove o callback global do reCAPTCHA
 */
export const unregisterRecaptchaCallback = (): void => {
  delete window.handleCaptchaChange;
};

/**
 * Verifica se o script do reCAPTCHA está carregado
 */
export const isRecaptchaLoaded = (): boolean => {
  return typeof window.grecaptcha !== 'undefined';
};

// Declare grecaptcha global type
declare global {
  interface Window {
    grecaptcha: any;
    handleCaptchaChange?: (token: string) => void;
  }
}
