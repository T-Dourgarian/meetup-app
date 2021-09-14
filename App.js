import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { NativeBaseProvider, extendTheme, Box, Button } from 'native-base';

import Navigation from './components/Navigation';

import { SafeAreaProvider } from 'react-native-safe-area-context';




export default function App() {
	
  return (
	  <SafeAreaProvider >
		  <NativeBaseProvider >
			<Navigation >
			</Navigation>
		</NativeBaseProvider>
	  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
