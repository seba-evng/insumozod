import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

export default function Index() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      {!showRegister ? (
        <LoginScreen onNavigateToRegister={() => setShowRegister(true)} />
      ) : (
        <RegisterScreen onNavigateToLogin={() => setShowRegister(false)} />
      )}
    </SafeAreaView>
  );
}