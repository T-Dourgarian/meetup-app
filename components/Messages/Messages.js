import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, ScrollView, Stack, Avatar, Center, Flex, Text, Image, Modal } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import env from "../../config/env";
import dateFormat from 'dateformat'
import Ionicons from 'react-native-vector-icons/Ionicons';

import Chat from '../Messages/Chat'
import CloseChat from './CloseChat';
import ConfirmAttendance from './ConfirmAttendance';

import socket from '../../config/socket';

const Messages = ({ route }) => {



	const [chats, setChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null)
	const [userUuid, setUserUuid] = useState('');
	const [closeChatDialog, setCloseChatDialog] = useState(false);
	const [confirmDialog, setConfirmDialog] = useState(false);
	const currentChats = useRef(chats);
	const currentSelectedChat = useRef(selectedChat)

	

	useEffect(() => {
        // This effect executes on every render (no dependency array specified).
        // Any change to the "participants" state will trigger a re-render
        // which will then cause this effect to capture the current "participants"
        // value in "participantsRef.current".
        currentChats.current = chats;
		currentSelectedChat.current = selectedChat; 
    });

	useEffect( () => {
		fetchChats();

		setUser();

		socket.on('message', (newMessage) => {
			let newChats = [];

			console.log(currentChats.current);

			for (let chat of currentChats.current) {
				if (chat.uuid === currentSelectedChat.current.uuid) {
					chat.messages.push(newMessage);
					newChats.push(chat)
				} else {
					newChats.push(chat);
				}
			}

			setChats(newChats);
		});
		
	}, [])


	const setUser = async () => {
		setUserUuid( await SecureStore.getItemAsync('uuid'));
	}

	const fetchChats = async () => {
		try {
			const token = await SecureStore.getItemAsync('accessToken');

			const { data } = await axios.get(`${env.API_URL}:3000/api/chat`,
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				}
			)

			setChats(data.chats);

			if (data.chats[0] && route.params && route.params.chatUuid) {

				const chat = data.chats.find(chat => chat.uuid === route.params.chatUuid);

				setSelectedChat(chat);

			} else if (data.chats[0] && !selectedChat) {
				setSelectedChat(data.chats[0]);
			}

		} catch (error) {
			console.log(error)
		}
	}

	const BubbleLabel = ({ chatUsers }) => {
		let userLabel = ''

		const user = chatUsers.find( user => user.uuid !== userUuid)

		userLabel = user.firstName;

		return (
			<Center>
				<Text color="#fff" bold>
					{ userLabel }
				</Text>
			</Center>
		)
	}


	const ProfileBubble = ({ ppURL, chatUuid }) => {
		if (ppURL && chatUuid) {
			return (
				<Center>
					<Image
					source={{
						uri: `${env.API_URL}:3000${ppURL}`,
					}}
					borderRadius={80}
					w={ selectedChat && chatUuid === selectedChat.uuid ? '65px' : '50px'}
					h={ selectedChat &&chatUuid === selectedChat.uuid ? '65px' : '50px'}
					alt="profile picture"
					borderWidth={selectedChat && chatUuid === selectedChat.uuid ? 3 : 0}
					borderColor='#fb7185'
				>
				</Image>
				</Center>
			)
		} else {
			return (
				<Box
					w={selectedChat && chatUuid === selectedChat.uuid ? '65px' : '50px'}
					h={selectedChat && chatUuid === selectedChat.uuid ? '65px' : '50px'}
					borderRadius={80}
					backgroundColor='#fff'
					borderWidth={selectedChat && chatUuid === selectedChat.uuid ? 3 : 0}
					borderColor='#fb7185'
				>
					<Text textAlign='center' my='auto'>
						<Ionicons 
							size={32}
							name='person-outline'
						/>
					</Text>
				</Box>
			)
		}
	}


	return (
		<Box backgroundColor='#fff'>
			{
				chats[0] ?
				<Flex h={'100%'}>
					<ScrollView 
						horizontal={true}
						h={'17%'}
						backgroundColor={'#fa8797'}
						borderBottomColor='#fff'
						borderBottomWidth={2}
					>
						<Flex direction='row'>
							{
								chats.map(chat => (
									<Button 
										key={chat.uuid} 
										onPress={() =>  setSelectedChat(chat)} 
										variant='unstyled'
										py={2}
									>
										<Flex>
											
											<ProfileBubble ppURL={chat.event[0].createdBy.ppURL} chatUuid={chat.uuid}/>
											
											<BubbleLabel chatUsers={chat.users} />
											
										</Flex>
									</Button>
								))
							}
						</Flex>
					</ScrollView>

					{
						selectedChat &&
						<Flex h={'15%'} w={'100%'} pt={1} direction='column' backgroundColor={'#fa8797'}>
						
							<Flex direction='column' w={'100%'}>
								<Flex direction='row' width={'100%'} px={2}>
									<Box w={'70%'}>
										<Text fontSize={12} color={'#fff'} bold>
											{selectedChat.event[0].name}
										</Text>
									</Box>
									<Box w={'30%'}>
										<Text fontSize={12}  color={'#fff'}>
											{dateFormat(selectedChat.event[0].date, 'h:MM TT - m/dd')}
										</Text>
									</Box>
								</Flex>

								<Box w={'100%'} px={2}>
									<Text fontSize={12} numberOfLines={1} color={'#fff'}>
										{selectedChat.event[0].location}
									</Text>
								</Box>
							</Flex>
							

							<Flex direction='row' w={'100%'}>
								<Button
									backgroundColor='#fff'
									my={'auto'}
									mx={'auto'}
									w={'45%'}
									h={'40%'}
									shadow={4}
									onPress={() => setCloseChatDialog(true)}
								>
									<Text textAlign='center' color='#fa8797' bold>Close chat</Text>
								</Button>
							
								<Button
									backgroundColor='#fff'
									my={'auto'}
									mx={'auto'}
									w={'50%'}
									h={'45%'}
									shadow={4}
									onPress={() => setConfirmDialog(true)}
									disabled={selectedChat.event[0].acceptedUuids.includes(userUuid)}
								>
									<Text textAlign='center' color='#fa8797' bold>Confirm Attendance</Text>
								</Button>
							</Flex>
						</Flex>
					}


					{
						selectedChat && 
						<Chat chatUuid={selectedChat.uuid} selectedChat={selectedChat} eventUuid={selectedChat.eventUuid} />
					}
				</Flex>:

				<Flex h={'100%'}>
					<Box h={'100%'}>
						<Text>
							You don't have any active chats! Send someone a message on the discover page to create a new chat!
						</Text>
					</Box>
				</Flex>
			}

			<CloseChat isOpen={closeChatDialog} setIsOpen={setCloseChatDialog}/>
			{
				selectedChat &&
				<ConfirmAttendance isOpen={confirmDialog} setIsOpen={setConfirmDialog} eventUuid={selectedChat.eventUuid} fetchChats={fetchChats}/>
			}
		
		</Box>
	)
};

export default Messages;