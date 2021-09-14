import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';
import { List, Box, Button } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Events from './Events';

import env from '../../config/env';


function Discover() {

	// const [events, setEvents] = useState([])
	// const [createView, toggleCreateView] = useState(() => false)

	// async function fetchData() {
	// 	try {

	// 		const token = await SecureStore.getItemAsync('accessToken');


	// 		console.log(env.API_URL)
	// 		const { data } = await axios.get(`${env.API_URL}:3000/api/event`,
	// 			{
	// 				headers: {
	// 					'Authorization': `Bearer ${token}`
	// 				}
	// 			}
	// 		);

	// 		setEvents(data.events);

	// 	} catch(error) {
	// 		console.log(error)
	// 	}
	// }

	// useEffect( () => {
		 
	// 	fetchData();

	// }, [])

	const DiscoverEventStack = createNativeStackNavigator();

  return (
    <DiscoverEventStack.Navigator >
		<DiscoverEventStack.Screen name="Events" component={Events}  options={{ headerShown: false }}/>
    </DiscoverEventStack.Navigator>
  );
}



export default Discover;