import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, ScrollView, Stack, Avatar, Center, Flex, Text, Image } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import env from "../../config/env";
import dateFormat from 'dateformat'
import Ionicons from 'react-native-vector-icons/Ionicons';
import socket from '../../config/socket';
import SingleEvent from '../Discover/SingleEvent';

const MyEvents = ({ navigation }) => {

	const [filter, setFilter] = useState('created')
	const [events, setEvents] = useState([])

	const fetchData = async () => {
		try {

			const token = await SecureStore.getItemAsync('accessToken');
			
			const { data } = await axios.get(`${env.API_URL}:3000/api/myevents/${filter}`,
			{
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			setEvents(data.events);
		
		} catch(error) {
			console.log(error);
		}
	};


	useEffect(() => {
		fetchData();
	}, [filter]);


	return (
		<Box h={'100%'} backgroundColor='#fff'>
			<Flex direction='row' h='8%' w='100%'>
				<Button
					w='50%'
					h='100%'
					variant='unstyled'
					backgroundColor={filter === 'created' ? '#fb7185' : '#fff'}
					onPress={() => setFilter('created')}
					borderRadius={0}
					borderBottomWidth={1}
					borderColor='#fb7185'
				>
					<Text textAlign='center' bold color={filter === 'created' ? '#fff' : '#fb7185'} >Created By Me</Text>
				</Button>
				<Button
					w='50%'
					h='100%'
					variant='unstyled'
					backgroundColor={filter === 'attended' ? '#fb7185' : '#fff'}
					onPress={() => setFilter('attended')}
					borderRadius={0}
					borderBottomWidth={1}
					borderColor='#fb7185'
				>
					<Text textAlign='center' bold color={filter === 'attended' ? '#fff' : '#fb7185'}>Attended By Me</Text>
				</Button>
			</Flex>

			<ScrollView h='92%'>
				{
					events && events[0] &&
					events.map(event => 
						(
							<SingleEvent key={event.uuid} event={event}/>
						)
					)
				}
			</ScrollView>
		</Box>
	)
};

export default MyEvents;