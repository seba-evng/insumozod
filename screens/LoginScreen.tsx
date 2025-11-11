import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { loginSchema, emailSchema, LoginFormData } from '../schemas/schema';
import { ZodError } from 'zod';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToRegister }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LoginFormData, boolean>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Validar campo individual según el tipo
    try {
      if (field === 'email') {
        emailSchema.parse(value);
      } else if (field === 'password') {
        // Solo validar longitud mínima en tiempo real para password
        if (value.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
      }
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0]?.message }));
      } else if (error instanceof Error) {
        setErrors((prev) => ({ ...prev, [field]: error.message }));
      }
    }
  };

  const handleBlur = (field: keyof LoginFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async () => {
    // Marcar todos los campos como tocados
    setTouched({
      email: true,
      password: true,
    });

    try {
      const validatedData = loginSchema.parse(formData);
      setLoading(true);
      
      // Simular llamada API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      console.log('Login exitoso:', validatedData);
      alert('¡Login exitoso!');
      setLoading(false);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof LoginFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-gray-50">
        <View className="flex-1 px-6 pt-20">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido
            </Text>
            <Text className="text-gray-600 text-base">
              Inicia sesión para continuar
            </Text>
          </View>

          <View className="mb-6">
            <TextInput
              label="Email"
              placeholder="tu@email.com"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              touched={touched.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <TextInput
              label="Contraseña"
              placeholder="••••••••"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              touched={touched.password}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <Button
            title="Iniciar Sesión"
            onPress={handleSubmit}
            loading={loading}
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">¿No tienes cuenta? </Text>
            <Text
              onPress={onNavigateToRegister}
              className="text-blue-600 font-semibold"
            >
              Regístrate
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};