import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { registerSchema, emailSchema, passwordSchema, nameSchema, phoneSchema, RegisterFormData } from '../schemas/schema';
import { ZodError } from 'zod';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    terms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterFormData, boolean>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (field !== 'confirmPassword' && field !== 'terms' && typeof value === 'string') {
      try {
        switch(field) {
          case 'email':
            emailSchema.parse(value);
            break;
          case 'password':
            passwordSchema.parse(value);
            break;
          case 'name':
            nameSchema.parse(value);
            break;
          case 'phone':
            phoneSchema.parse(value);
            break;
        }
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      } catch (error) {
        if (error instanceof ZodError) {
          setErrors((prev) => ({ ...prev, [field]: error.errors[0]?.message }));
        }
      }
    }
  };

  const handleBlur = (field: keyof RegisterFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    // Validar confirmPassword cuando se pierde el foco
    if (field === 'confirmPassword') {
      if (formData.password !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      }
    }
  };

  const handleSubmit = async () => {
    // Marcar todos los campos como tocados
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
      terms: true,
    });

    try {
      const validatedData = registerSchema.parse(formData);
      setLoading(true);
      
      // Simular llamada API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      console.log('Registro exitoso:', validatedData);
      alert('¡Registro exitoso!');
      setLoading(false);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof RegisterFormData] = err.message;
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
        <View className="flex-1 px-6 pt-12 pb-8">
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Crear Cuenta
            </Text>
            <Text className="text-gray-600 text-base">
              Completa el formulario para registrarte
            </Text>
          </View>

          <View className="mb-4">
            <TextInput
              label="Nombre Completo"
              placeholder="Juan Pérez"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              onBlur={() => handleBlur('name')}
              error={errors.name}
              touched={touched.name}
              autoCapitalize="words"
            />

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
              label="Teléfono"
              placeholder="0999999999"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              onBlur={() => handleBlur('phone')}
              error={errors.phone}
              touched={touched.phone}
              keyboardType="phone-pad"
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

            <TextInput
              label="Confirmar Contraseña"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              onBlur={() => handleBlur('confirmPassword')}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={() => handleChange('terms', !formData.terms)}
              className="flex-row items-start mb-6"
            >
              <View
                className={`w-5 h-5 border-2 rounded mr-3 items-center justify-center ${
                  formData.terms ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                }`}
              >
                {formData.terms && <Text className="text-white text-xs">✓</Text>}
              </View>
              <Text className="flex-1 text-gray-700 text-sm">
                Acepto los términos y condiciones
              </Text>
            </TouchableOpacity>
            {touched.terms && errors.terms && (
              <Text className="text-red-500 text-xs -mt-4 mb-4">{errors.terms}</Text>
            )}
          </View>

          <Button
            title="Crear Cuenta"
            onPress={handleSubmit}
            loading={loading}
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">¿Ya tienes cuenta? </Text>
            <Text
              onPress={onNavigateToLogin}
              className="text-blue-600 font-semibold"
            >
              Inicia Sesión
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};