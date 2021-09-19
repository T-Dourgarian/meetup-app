import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Box, Button, HStack, Stack as Stack2, Center, Text, Flex, Spacer, Divider } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dateFormat from 'dateformat'

import ConfirmAttendance from './ConfirmAttendance';
import CloseChat from './CloseChat';

const ChatHeader = ({ route }) => {
	const [user, setOtherChatUser] = useState('')
	const [event] = useState(route.params.event[0]);
	const [confirmDialog, setConfirmDialog] = useState(false);
	const [userUuid, setUserUuid] = useState('')
	const deleteMode = useSelector((state) => state.chats.deleteMode)

	useEffect( () => {
		getUserUuid();
		
	}, [])

	const getUserUuid = async() => {
		const uuid = await SecureStore.getItemAsync('uuid')
		setUserUuid(uuid);

		let user;

		for (user of route.params.users) {
			if (user.uuid !== uuid) {
				setOtherChatUser(user);
			}
		}
	}


	return (
		<Flex direction='column' w='100%' ml='-10%' >
			
			<Text fontSize={17} bold>{ user.firstName } { user.lastName } </Text>
			
			<Flex direction='row' w={'100%'}>
				<Text fonstSize={15}>{ event.name } </Text>
				<Spacer />
				<Text fontSize={15}>{dateFormat(event.date, 'h:MM TT - m/dd')}</Text>
			</Flex>
			
			<Text color='#a1a1aa' fontSize={14}>{ event.description } </Text>
			<Text mb={2} color='#a1a1aa' fontSize={14} numberOfLines={1}>{ event.location } </Text>

			{
				!(event.acceptedUuids.includes(userUuid) || event.deleted) &&
				<Button
					backgroundColor='#fb7185'
					variant='unstyled'
					mx={'auto'}
					w={'100%'}
					h={'10%'}
					py={4}
					shadow={2}
					onPress={() => setConfirmDialog(true)}
					disabled={event.acceptedUuids.includes(userUuid) || event.deleted}
				>
					<Text textAlign='center' color='#fff' bold>Confirm Attendance</Text>
				</Button>
			}

			<ConfirmAttendance isOpen={confirmDialog} setIsOpen={setConfirmDialog} eventUuid={event.uuid} />
			
		</Flex>
	)
}

export default ChatHeader;