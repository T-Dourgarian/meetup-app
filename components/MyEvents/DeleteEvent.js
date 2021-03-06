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


const DeleteEvent = ({ setIsOpen, event, fetchMyEventsData })  => {

	const [spinner, setSpinner] = useState(false);

	const handleDelete = async () => {
		try {

			setSpinner(true);

			const token = await SecureStore.getItemAsync('accessToken');
			
			await axios.delete(`${env.API_URL}:3000/api/myevents/delete/${event.uuid}`,
			{
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			
			setSpinner(false);
			setIsOpen(false);
			
			fetchMyEventsData();


		} catch(error) {
			console.log(error);
		}
	}

	return (
		<Modal isOpen={true} size={'lg'}>
			<Modal.Content>
			<Modal.Header>
				<Text fontSize={20} bold color='#fb7185'>
					Delete Event
				</Text>
			</Modal.Header>
			<Modal.Body>
				Please confirm that you want to delete this event.
				<Flex my={2} direction='column'>
					<Text>{event.name}</Text>
					<Text>{dateFormat(event.date, 'h:MM TT - m/dd')}</Text>
					<Text>{event.location}</Text>
				</Flex> 
				Once the event is deleted, it is gone forever and all chats tied to this event will be deleted.
			</Modal.Body>
			<Modal.Footer>
				<Button
					color='#fff'
					backgroundColor='#fb7185'
					mr={2}
					onPress={() => handleDelete()}
				>
					{
						spinner ? 
						<Spinner />:
						<Text color='#fff' bold>Delete</Text>
					}
				</Button>
				<Button
					onPress={() => {
						setIsOpen(false)
					}}
					variant='outline'
					borderColor='#27272a'
					
				>
					<Text color='#27272a'>Cancel</Text>
				</Button>
			</Modal.Footer>
			</Modal.Content>
		</Modal>
	)
}	

export default DeleteEvent;