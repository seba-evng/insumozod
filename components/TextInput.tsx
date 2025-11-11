import React from 'react';
import { TextInput as RNTextInput, View, Text, TextInputProps } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  touched?: boolean;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  touched,
  ...props
}) => {
  const hasError = touched && error;

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        {label}
      </Text>
      <RNTextInput
        className={`border rounded-lg px-4 py-3 text-base ${
          hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        }`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {hasError && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
};