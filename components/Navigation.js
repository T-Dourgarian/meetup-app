import * as React from 'react';
import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Box, Button, HStack, Stack as Stack2, Center, Text, Flex, Spacer, Divider } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dateFormat from 'dateformat'

// navigation component import
import Discover from './Discover/Discover';
import Login from './Login/Login';
import Signup from './Login/Signup';
import Messages from './Messages/Messages';
import Profile from './Profile/Profile';
import MyEvents from './MyEvents/MyEvents';
import Chat from './Messages/Chat';
import ChatHeader from './Messages/ChatHeader';
import MessagesHeader from './Messages/MessagesHeader';
import CreateEvent from './Create/CreateEvent';
import EditEvent from './MyEvents/EditEvent';


import socket from '../config/socket';

const Stack = createNativeStackNavigator();

const MessagesStack = createNativeStackNavigator();

const MyEventsStack = createNativeStackNavigator();


const Tab = createBottomTabNavigator();

export default function Navigation() {

	const [isLoggedIn, toggleIsLoggedIn] = useState(() => false);
	
	const [userUuid, setUserUuid] = useState('')

	useEffect( () => {
		const token = checkForAccessToken();
		getUserUuid() ;
		
	}, [])

	const getUserUuid = async() => {
		setUserUuid(await SecureStore.getItemAsync('uuid'));
	}

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

	const MessagesHome = () => {
		return (
			<MessagesStack.Navigator>
				<MessagesStack.Screen 
					name={'MessagesList'}
					component={Messages}
					options={({ route }) => {
						return {
							headerTitle: () => {
								return (
									<MessagesHeader route={route}/>
								)
							},
						}
					}}
				/>
				<MessagesStack.Screen 
					name={'Chat'}
					component={Chat}
					options={({ route }) => {
						return {
							headerTitle: () => {


								return (
									<ChatHeader route={route}/>
								)
							}
						}
					}}
				/>
			</MessagesStack.Navigator>
		)
	}

	const MyEventsHome = () => {
		return (
			<MyEventsStack.Navigator>
				<MyEventsStack.Screen 
					name={'MyEventsList'}
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
				<MyEventsStack.Screen 
					name={'EditEvent'}
					component={EditEvent}
					options={({ navigation, route }) => ({ 
						headerTitle: () => screenHeader('Edit Event'),
						// headerRight: () => (
						// 	<Button
						// 		onPress={() => logOut()}
						// 	>
						// 		Log out
						// 	</Button>
						// ),
					})}
				/>
			</MyEventsStack.Navigator>
		)
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
					tabBarIcon: ({ focused, size }) => {
					let iconName;
					let color;

		
					switch (route.name) {
						case 'Profile':
							iconName = 'person-outline'
						  	break;
						case 'Create':
							iconName='add-circle-outline'
							break;
						case 'Discover':
							iconName = 'search-outline'
						  	break;
						case 'Messages':
							iconName = 'chatbox-outline'
							break;
						case 'MyEvents':
							iconName = 'list-outline'
							break;
						default:
							iconName = 'person-outline'
					}


					if (focused) {
						color = '#f43f5e'

						iconName = iconName.split('-outline')[0]
					} else {
						color ='#27272a'
					}
		
					// You can return any component that you like here!
					return <Ionicons name={iconName} size={size} color={color} />;
					},
					tabBarShowLabel:false
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
					component={MyEventsHome} 
					options={({ navigation, route }) => ({ 
						headerShown: false
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
					component={MessagesHome} 
					options={({ navigation, route }) => ({ 
						headerShown: false
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