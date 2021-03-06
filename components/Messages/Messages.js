import * as React from 'react';
import { useEffect, useState, useRef, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TouchableOpacity, View, RefreshControl } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, ScrollView, Stack, Avatar, Center, Flex, Text, Image, Modal, Spinner, PresenceTransition, Spacer, Divider } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import io from 'socket.io-client';
import env from "../../config/env";
import dateFormat from 'dateformat'
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Chat from '../Messages/Chat'
import ConfirmAttendance from './ConfirmAttendance';
import { connect } from 'react-redux'
import { addMessage, setChats, addChatToDelete, removeChatToDelete, toggleDeleteMode } from '../../redux/actions/chat';
import chatReducer from '../../redux/reducers/chatReducer';

import socket from '../../config/socket';

const Messages = ({ navigation, route }) => {

	const [userUuid, setUserUuid] = useState('');
	const [spinner, setSpinner] = useState(false);
	const chats = useSelector((state) => state.chats.chats)
	const deleteMode = useSelector((state) => state.chats.deleteMode);
	const chatsToDelete = useSelector((state) => state.chats.chatsToDelete);
	const dispatch = useDispatch();


	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		wait(200).then(() => {
			setRefreshing(false);
			fetchChats(); 
		});
	}, []);

	const wait = (timeout) => {
		return new Promise(resolve => setTimeout(resolve, timeout));
	}
	



	useEffect( () => {
		fetchChats();

		setUser();

	}, [])


	useEffect(() => {
		if (route.params && route.params.chatUuid) {
			fetchChats()
		}
	}, [route.params])


	const setUser = async () => {
		const uuid = await SecureStore.getItemAsync('uuid')
		setUserUuid( uuid );
	}

	const fetchChats = async () => {
		try {

			setSpinner(true);

			const token = await SecureStore.getItemAsync('accessToken');

			const { data } = await axios.get(`${env.API_URL}:3000/api/chat`,
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				}
			)

			dispatch(setChats(data.chats));

			setSpinner(false);

		} catch (error) {
			setSpinner(false);
			console.log(error)
		}
	}

	const selectChat = (chat) => {
		if (!deleteMode) {
			navigation.push('Chat', chat)
		} else if (chatsToDelete.includes(chat.uuid)) {
			dispatch(removeChatToDelete(chat.uuid))
		} else {
			dispatch(addChatToDelete(chat.uuid));
		}
	}

	const handleStartDeleteMode = (chat) => {
		if (!deleteMode) {
			dispatch(toggleDeleteMode(true));
			dispatch(addChatToDelete(chat.uuid));
		}
	}

	const BubbleLabel = ({ chat }) => {

		const user = chat.users.find( user => user.uuid !== userUuid)


		return (
			<Text color='#404040'  bold fontSize={15}>
				{ user.firstName } { user.lastName} - {chat.event[0].name}
			</Text>
		)
	}


	const ProfileBubble = ({ chat, chatUuid }) => {

		const user = chat.users.find( user => user.uuid !== userUuid)

		if (user.ppURL && chatUuid) {
			return (
				<Center mr={2}>
					<Image
					source={{
						uri: `${env.API_URL}:3000${user.ppURL}`,
					}}
					borderRadius={80}
					w={'50px'}
					h={'50px'}
					alt="profile picture"
					borderColor='#fb7185'
				>
				</Image>
				</Center>
			)
		} else {
			return (
				<Box
					w={'50px'}
					h={'50px'}
					borderRadius={80}
					backgroundColor='#fff'
					mr={2}
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
		<>
			{
				spinner ? 
				<Center flex={1}>
					<Spinner size='large' color='#f43f5e' />
				</Center> :
				<Box backgroundColor='#fff' h='100%'>
				{
					(chats && chats[0]) ?
					<Flex h={'100%'} w={'100%'} >
							<ScrollView 
								h={'100%'}
								w={'100%'}
								backgroundColor='#fff'
								refreshControl={
									<RefreshControl
										refreshing={refreshing}
										onRefresh={onRefresh}
									/>
								}
							>
								<Flex direction='column' h={'100%'}>
									{
										chats.map(chat => (
												<TouchableOpacity 
													key={chat.uuid} 
													onPress={() =>  selectChat(chat)}  
													onLongPress={() => handleStartDeleteMode(chat)}
													delayLongPress={1000}
													height={'20%'}
											   >
													<Box
														variant='unstyled'
														py={2}
														pl={2}
														backgroundColor={chatsToDelete.includes(chat.uuid) ? '#fecaca' : '#fff'}
													>
														<Flex direction='row' >
															<ProfileBubble chat={chat} chatUuid={chat.uuid}/>				
															<Flex direction='column'>
																<BubbleLabel chat={chat} />
																{
																	chat.messages[0] &&
																	<Text
																		fontSize={14}
																		color='#a8a29e'
																		numberOfLines={2}
																	>
																		{chat.messages[chat.messages.length-1].message}
																	</Text>
																}
															</Flex>
															<Spacer />
															<Flex direction='column' w={'33%'}>
																{
																	chat.messages[0] && 
																	<Text
																		textAlign='right'
																		fontSize={14}
																		color='#a8a29e'
																		px={2}
																	>
																		{moment(chat.messages[chat.messages.length-1].createdAt).fromNow()}
																	</Text>
																}
																<Spacer />

																{
																	chat.event[0].createdBy.uuid === userUuid &&
																	<Box
																		borderColor='#fb7185'
																		borderWidth={1}
																		borderRadius={20}
																		width={'50%'}
																		ml='auto'
																		mr={2}

																	>
																		<Text textAlign={'center'} numberOfLines={1} color='#fb7185' fontSize={11}>Your Event</Text>
																	</Box>
																}
															</Flex>
														</Flex>	
													</Box>
													<Divider />
												</TouchableOpacity>
										))
									}
								</Flex>
							</ScrollView>
					</Flex>:
					<Box h={'100%'} w='100%' mx='12.5%'>
						<Text w={'75%'} my={3} color='#a8a29e' fontSize={13} textAlign='center'>
							You don't have any chats! Create a chat by sending someone a message on the Discover page.
						</Text>
					</Box>
				 }
			</Box>
			}
		</>
	)
};



export default Messages;