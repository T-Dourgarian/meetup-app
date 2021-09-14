import * as React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, Flex, Center, Text } from 'native-base';
import * as SecureStore from 'expo-secure-store';

import env from '../../config/env';
import socket from '../../config/socket';


function Login({ toggleIsLoggedIn, navigation }) {

	const [email, setEmail] = useState(() => '')
	const [password, setPassword] = useState(() => '')

	const handleLogin = async () => {
		if (email && password) {
			try {
				const { data } = await axios.post(`${env.API_URL}:3000/api/login`,
				{
					email,
					password
				});

				if (data.accessToken) {
					SecureStore.setItemAsync(`accessToken`, data.accessToken);
					SecureStore.setItemAsync(`uuid`, data.user.uuid);
					SecureStore.setItemAsync(`firstName`, data.user.firstName);
					SecureStore.setItemAsync(`lastName`, data.user.lastName);
					SecureStore.setItemAsync(`ppURL`, data.user.ppURL);

					if (!socket.connected) {
						socket.connect(`${env.API_URL}:3000`)
					}

					toggleIsLoggedIn(true);

				} else {
					console.log(data);
				}

			} catch(error) {
				console.log('error in login',error)
			}
		} else {
			console.log('invalid username or password')
		}
	}

	const handleSignUp = () => {
		navigation.navigation.navigate('Sign up')
	}



  return (
	  	<Box backgroundColor='#fff' h={'100%'} pt={12}>
			<Flex w={'66%'} mx={'auto'} pt={12}>
				<Center mb={7} mt={12}>
					<Text fontSize={40} color='#fb7185' bold >Welcome!</Text>

					<Text>Sign in or create a new account</Text>
				</Center>

				<Input
					_focus={{style: {borderColor: '#fb7185'}}}
					borderWidth={2}
					mb={2}
					variant="rounded"
					placeholder="Email"
					value={email}
					onChangeText={(text) => setEmail(text)}
				/>
				
				

				<Input
					_focus={{style: {borderColor: '#fb7185'}}}
					borderWidth={2}
					my={2}
					variant="rounded"
					placeholder="Password"
					type="password"
					value={password}
					onChangeText={(text) => setPassword(text)}
				/>

				<Button
					mt={2}
					onPress={() => handleLogin()}
					backgroundColor='#fb7185'
					borderRadius={30}
				>
					Login
				</Button>


				<Center>
					<Flex direction='row' my={3}>
						<Text>
							Don't have an account? 
						</Text>
						<Button
							size="xs"
							mt={0}
							pa={0}
							variant="link"
							onPress={() => handleSignUp()}
							>
							Sign up.
						</Button>
					</Flex>
				</Center>

			</Flex>
		</Box>
		

  );
}



export default Login;