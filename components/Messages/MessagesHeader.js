import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Box, Button, HStack, Stack as Stack2, Center, Text, Flex, Spacer, Divider } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dateFormat from 'dateformat'
import { addMessage, setChats, addChatToDelete, toggleDeleteMode } from '../../redux/actions/chat';

import ConfirmAttendance from './ConfirmAttendance';
import CloseChat from './CloseChat';

const MessagesHeader = ({ route }) => {
	const [deleteChatDialog, setDeleteChatDialog] = useState(false);
	const deleteMode = useSelector((state) => state.chats.deleteMode)
	const dispatch = useDispatch()
	// useEffect( () => {
	// 	getUserUuid();
		
	// }, [])

	// const getUserUuid = async() => {
	// 	const uuid = await SecureStore.getItemAsync('uuid')
	// 	setUserUuid(uuid);

	// 	let user;

	// 	for (user of route.params.users) {
	// 		if (user.uuid !== uuid) {
	// 			setOtherChatUser(user);
	// 		}
	// 	}
	// }


	return (
		<Flex direction='row' w='100%'>
			
			{
				!deleteMode ? 
				<Text my={'auto'}>Messages</Text>:
				<Button 
					variant='unstyled'
					onPress={() => dispatch(toggleDeleteMode(false))}
				>
					<Ionicons  color='#ef4444' name='close-outline' size={30} />
				</Button>
			}
			<Spacer />
			{
				deleteMode &&
				<Button
					variant='unstyled'
					mr={5}
					onPress={() => setDeleteChatDialog(true)}
				>	
					<Ionicons  color='#ef4444' name='trash-outline' size={25} />
				</Button>
			}

		{
			deleteChatDialog &&
			<CloseChat setIsOpen={setDeleteChatDialog} />
		}
			
		</Flex>
	)
}

export default MessagesHeader;