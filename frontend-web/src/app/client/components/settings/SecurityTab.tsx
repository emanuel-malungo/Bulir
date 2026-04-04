'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { UserAPI } from '@/modules/user/user.services';

interface SecurityTabProps {
  userId: number | string | undefined;
}

export function SecurityTab({ userId }: SecurityTabProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const isPasswordValid = () => {
    return (
      formData.currentPassword &&
      formData.newPassword &&
      formData.newPassword === formData.confirmPassword &&
      formData.newPassword.length >= 8
    );
  };

  const handleChangePassword = async () => {
    if (!userId || !isPasswordValid()) return;

    setIsLoading(true);
    try {
      await UserAPI.changePassword(userId, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength(0);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao alterar senha. Verifique a senha atual.' });
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordField = ({
    label,
    name,
    value,
    show,
    onToggle,
  }: {
    label: string;
    name: string;
    value: string;
    show: boolean;
    onToggle: () => void;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          placeholder={label}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Lock className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-gray-900">Alterar Senha</h3>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <PasswordField
          label="Senha Atual"
          name="currentPassword"
          value={formData.currentPassword}
          show={showPasswords.current}
          onToggle={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
        />

        <PasswordField
          label="Nova Senha"
          name="newPassword"
          value={formData.newPassword}
          show={showPasswords.new}
          onToggle={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
        />

        {formData.newPassword && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs font-medium text-gray-600">Força da senha</span>
              <span className="text-xs font-medium text-gray-600">
                {passwordStrength === 0 && 'Fraca'}
                {passwordStrength === 1 && 'Fraca'}
                {passwordStrength === 2 && 'Normal'}
                {passwordStrength === 3 && 'Forte'}
                {passwordStrength === 4 && 'Muito Forte'}
              </span>
            </div>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i < passwordStrength
                      ? 'bg-accent'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <PasswordField
          label="Confirmar Nova Senha"
          name="confirmPassword"
          value={formData.confirmPassword}
          show={showPasswords.confirm}
          onToggle={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
        />

        {formData.confirmPassword && (
          <div className="flex items-center space-x-2 text-sm">
            {formData.newPassword === formData.confirmPassword ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Senhas coincidem</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-red-600" />
                <span className="text-red-600">Senhas não coincidem</span>
              </>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleChangePassword}
        disabled={!isPasswordValid() || isLoading}
        className="w-full bg-accent text-white py-2 rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {isLoading ? 'Alterando...' : 'Alterar Senha'}
      </button>
    </div>
  );
}
