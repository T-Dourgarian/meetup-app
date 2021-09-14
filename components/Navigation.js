import * as React from 'react';
import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Box, Button, HStack, Stack as Stack2, Center, Text } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import Ionicons from 'react-native-vector-icons/Ionicons';

// navigation component import
import Discover from './Discover/Discover';
import Login from './Login/Login';
import Signup from './Login/Signup';
import Messages from './Messages/Messages';
import Profile from './Profile/Profile';
import MyEvents from './MyEvents/MyEvents';

import CreateEvent from './Create/CreateEvent';

import socket from '../config/socket';

const Stack = createNativeStackNavigator();



const Tab = createBottomTabNavigator();

export default function Navigation() {

	const [isLoggedIn, toggleIsLoggedIn] = useState(() => false);

	useEffect( () => {
		const token = checkForAccessToken();


	}, [])

	const checkForAccessToken = async () => {

		const token = await SecureStore.getItemAsync('accessToken');

		if (token) {
			toggleIsLoggedIn(true);
			return token;
		} else {
			return null;
		}
	}
	
	
	const logOut = async () => {

		socket.disconnect();

		await SecureStore.deleteItemAsync('accessToken');
		toggleIsLoggedIn(false);
	}
	
	const screenHeader = (name) => {

		return (
			<Box>
				<Center>
					<Text 
						bold 
						fontSize="xl"
						color='#fb7185'
					>{name}</Text>
				</Center>
			</Box>
		)
	}

	const Home = () => {
		return (
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarHideOnKeyboard: true,
					tabBarIcon: ({ focused, color, size }) => {
					let iconName;
		
					switch (route.name) {
						case 'Profile':
							iconName = 'person'
						  	break;
						case 'Create':
							iconName='add-outline'
							break;
						case 'Discover':
							iconName = 'search'
						  	break;
						case 'Messages':
							iconName = 'chatbox'
							break;
						case 'MyEvents':
							iconName = 'list'
							break;
						default:
							iconName = 'person'
					}
		
					// You can return any component that you like here!
					return <Ionicons name={iconName} size={size} />;
					},
					tabBarActiveTintColor: 'tomato',
					tabBarInactiveTintColor: 'gray',
				})}
			>
				<Tab.Screen 
					name="Discover" 
					component={Discover}
					options={
						{ 
							headerTitle: () => screenHeader('Discover'),
						}
					}
				/>
				<Tab.Screen 
					name="MyEvents" 
					component={MyEvents} 
					options={({ navigation, route }) => ({ 
						headerTitle: () => screenHeader('My Events'),
						// headerRight: () => (
						// 	<Button
						// 		onPress={() => logOut()}
						// 	>
						// 		Log out
						// 	</Button>
						// ),
					})}
				/>
				<Tab.Screen 
					name="Create" 
					component={CreateEvent} 
					options={({ navigation, route }) => ({ 
						headerTitle: () => screenHeader('Create'),
					})}
				/>
				<Tab.Screen 
					name="Messages" 
					component={Messages} 
					options={({ navigation, route }) => ({ 
						headerTitle: () => screenHeader('Messages'),
						// headerRight: () => (
						// 	<Button
						// 		onPress={() => logOut()}
						// 	>
						// 		Log out
						// 	</Button>
						// ),
					})}
				/>
				<Tab.Screen 
					name="Profile" 
					component={Profile} 
					options={({ navigation, route }) => ({ 
						headerTitle: () => screenHeader('Profile'),
						headerRight: () => (
							<Button
								onPress={() => logOut()}
								mr={2}
								backgroundColor='#fb7185'
							>
								Log out
							</Button>
						),
					})}
				/>
			</Tab.Navigator>
		)
	}

	return (
		<NavigationContainer>

				<Stack.Navigator>
					{
						isLoggedIn ?
						<Stack.Screen 
							name="Home"
							component={Home}
							options={{ headerShown: false }}
						/>:
						<>
							<Stack.Screen
								name="Login"
								options={{ headerShown: false }}
							>
								{(navigation) => <Login navigation={navigation} toggleIsLoggedIn={toggleIsLoggedIn} />}
							</Stack.Screen >
							<Stack.Screen
								name="Sign up"
								options={{ headerShown: false }}
							>
								{(navigation) => <Signup navigation={navigation} toggleIsLoggedIn={toggleIsLoggedIn} />}
							</Stack.Screen >
						</>
					}
				</Stack.Navigator>
			
		</NavigationContainer>
	)



}