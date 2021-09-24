import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView } from 'react-native';
import { NativeBaseProvider, extendTheme, Box, Button } from 'native-base';

import Navigation from './components/Navigation';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import configureStore from './redux/store';
import { Provider } from 'react-redux';

import * as Location from 'expo-location';

const store = configureStore();




export default function App() {

	useEffect(() => {
		(async () => {
		  
		  await Location.requestForegroundPermissionsAsync();

		})();
	  }, []);
	
  return (
	  <Provider store={store}>
			<SafeAreaProvider >
				<NativeBaseProvider >
						<Navigation >
						</Navigation>
				</NativeBaseProvider>
			</SafeAreaProvider>
		</Provider>
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
