import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View,RefreshControl } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, ScrollView, Stack, Avatar, Center, Flex, Text, Image, Spinner, Modal } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import env from "../../config/env";
import dateFormat from 'dateformat'
import Ionicons from 'react-native-vector-icons/Ionicons';
import socket from '../../config/socket';
import CreateEvent from '../Create/CreateEvent';
import DateTimePicker from '@react-native-community/datetimepicker';
import LocationPicker from '../Create/LocationPicker';



const EditEvent = ({ route })  => {

	const [spinner, setSpinner] = useState(false);

	useEffect(() => {
		console.log(route);
	}, [])

	const handleUpdate = async () => {
		try {

			setSpinner(true);

			const token = await SecureStore.getItemAsync('accessToken');
			
			// await axios.delete(`${env.API_URL}:3000/api/myevents/delete/${event.uuid}`,
			// {
			// 	headers: {
			// 		'Authorization': `Bearer ${token}`
			// 	}
			// });

			
			setSpinner(false);
			setIsOpen(false);
			
			// fetchMyEventsData();


		} catch(error) {
			console.log(error);
		}
	}

	return (
		
		<Box h='100%'>
			<CreateEvent event={route.params.event} />
		</Box>
	)
}	

export default EditEvent;