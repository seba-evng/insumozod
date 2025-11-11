import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`py-4 rounded-lg items-center justify-center ${
        isPrimary ? 'bg-blue-600' : 'bg-gray-200'
      } ${(disabled || loading) && 'opacity-50'}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#374151'} />
      ) : (
        <Text
          className={`font-semibold text-base ${
            isPrimary ? 'text-white' : 'text-gray-800'
          }`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};