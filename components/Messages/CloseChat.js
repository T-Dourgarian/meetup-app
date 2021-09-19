import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, Flex, ScrollView, Text, Modal, Spinner } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import env from "../../config/env";
import moment from 'moment'
import { toggleDeleteMode, deleteChatsAction } from '../../redux/actions/chat';

import socket from '../../config/socket';


const CloseChat = ({ isOpen, setIsOpen }) => {

	const chatsToDelete = useSelector((state) => state.chats.chatsToDelete);
	const dispatch = useDispatch()

	const [spinner, setSpinner] = useState(false);
	

	const deleteChats = async () => {
		try {

			setSpinner(true);

			const token = await SecureStore.getItemAsync('accessToken');

			await axios.put(`${env.API_URL}:3000/api/chat/deactivate`, {
				chatUuids: chatsToDelete
			},
			{
				headers: {
					authorization: `Bearer ${token}`
				}
			});

			
			setSpinner(false);
			dispatch(deleteChatsAction(chatsToDelete));
			dispatch(toggleDeleteMode(false));
			setIsOpen(false);
		
		} catch(error) {
			console.log(error);
		}
	}
	return (
		<Modal isOpen={true} size={'lg'}>
			<Modal.Content>
			<Modal.Header>
				<Text fontSize={20} bold color='#fb7185'>
					DeleteChats
				</Text>
			</Modal.Header>
			<Modal.Body>
				{
					chatsToDelete.length > 1 ?
					`Please confirm that you want to delete the ${chatsToDelete.length} selected chats. You can always resume communication by sending another message from the discover screen on the same event.` :
					'Please confirm that you want to delete this chat. You can always resume communication by sending another message from the discover screen on the same event.'
				}
			</Modal.Body>
			<Modal.Footer>
				<Button
					color='#fff'
					backgroundColor='#fb7185'
					mr={2}
					onPress={() => deleteChats()}
				>
					{
						spinner ? 
						<Spinner />:
						<Text color='#fff' bold>Confirm</Text>
					}
				</Button>
				<Button
					onPress={() => setIsOpen(false)}
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

export default CloseChat;