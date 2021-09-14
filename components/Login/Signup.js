import * as React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, Flex, Center, Text } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';


import env from '../../config/env';

function Signup({ toggleIsLoggedIn, navigation }) {

	const [email, setEmail] = useState(() => '')
	const [password, setPassword] = useState(() => '')
	const [firstName, setFirstName] = useState(() => '')
	const [lastName, setLastName] = useState(() => '')


	const handleSignUp = async () => {
		if (email && password && firstName && lastName) {
			try {
				const { data } = await axios.post(`${env.API_URL}:3000/api/login/signup`,
					{
						username: email,
						password,
						firstName,
						lastName,
					}
				);


				if (data.accessToken) {
					SecureStore.setItemAsync(`accessToken`, data.accessToken)
					toggleIsLoggedIn(true);

				} else {
					console.log(data);
				}


			} catch(error) {
				console.log(error);
			}
		} else {
			console.log('fill in all inputs')
		}
	}



  return (
	  	<Box backgroundColor='#fff' h={'100%'} pt={12}>
			<Box position='absolute' ml={10} mt={10}>
				<Ionicons size={35} color='#fb7185' onPress={() => navigation.navigation.navigate('Login')} name='arrow-back'/>
			</Box>
			<Flex w={'66%'} mx={'auto'}>
				<Center mb={7} mt={12}>
					<Text fontSize={40} color='#fb7185' bold >Sign up</Text>
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
					type="password"
					placeholder="Password"
					value={password}
					onChangeText={(text) => setPassword(text)}
				/>
				
				<Input
					_focus={{style: {borderColor: '#fb7185'}}}
					borderWidth={2}
					my={2}
					variant="rounded"
					placeholder="First Name"
					value={firstName}
					onChangeText={(text) => setFirstName(text)}
				/>

				<Input
					_focus={{style: {borderColor: '#fb7185'}}}
					borderWidth={2}
					my={2}
					variant="rounded"
					placeholder="Last Name"
					value={lastName}
					onChangeText={(text) => setLastName(text)}
				/>

				<Button
					mt={2}
					onPress={handleSignUp}
					backgroundColor='#fb7185'
					borderRadius={30}
				>
					Sign up
				</Button>
			</Flex>
		</Box>
  );
}



export default Signup;