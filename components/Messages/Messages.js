import * as React from 'react';
import { useEffect, useState, useRef, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, ScrollView, Stack, Avatar, Center, Flex, Text, Image, Modal, Spinner, PresenceTransition, Spacer, Divider } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import io from 'socket.io-client';
import env from "../../config/env";
import dateFormat from 'dateformat'
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Chat from '../Messages/Chat'
import CloseChat from './CloseChat';
import ConfirmAttendance from './ConfirmAttendance';
import { connect } from 'react-redux'
import { addMessage, setChats, addChatToDelete, removeChatToDelete, toggleDeleteMode } from '../../redux/actions/chat';
import chatReducer from '../../redux/reducers/chatReducer';

import socket from '../../config/socket';

const Messages = ({ navigation, route }, props) => {

	const [userUuid, setUserUuid] = useState('');
	const [closeChatDialog, setCloseChatDialog] = useState(false);
	const [spinner, setSpinner] = useState(false);
	const chats = useSelector((state) => state.chats.chats)
	const deleteMode = useSelector((state) => state.chats.deleteMode);
	const chatsToDelete = useSelector((state) => state.chats.chatsToDelete);
	const dispatch = useDispatch();



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
					w={'60px'}
					h={'60px'}
					alt="profile picture"
					borderColor='#fb7185'
				>
				</Image>
				</Center>
			)
		} else {
			return (
				<Box
					w={'60px'}
					h={'60px'}
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
				<Box backgroundColor='#fff'>
				{
					chats && chats[0] &&
					<Flex h={'100%'} w={'100%'} >

						{/* <Button
							position='absolute'
							top={0}
							right={10}
							zIndex={6}
							onPress={() => setChatsBarVisible(!chatsBarVisible)}
						>
							<Ionicons size={15} name='chevron-down-outline'/>
						</Button>

						<PresenceTransition 
							position='absolute'
							top={0}
							zIndex={5}
							as={Flex} 
							h={'33%'} 
							visible={chatsBarVisible}
							initial={{
								opacity: 0,
								// scale: 0,
								translateY: -100
							}}
							animate={{
								translateY: 0,
								opacity: 1,
								// scale: 1,
								transition: {
									duration: 333,
								},
							}}
						> */}
							<ScrollView 
								h={'100%'}
								backgroundColor='#fff'
								w={'100%'}
								// borderBottomColor='#fff'
								// borderBottomWidth={2}
							>
								<Flex direction='column' h={'100%'}>
									{
										chats.map(chat => (
												<TouchableOpacity 
													key={chat.uuid} 
													onPress={() =>  selectChat(chat)}  
													onLongPress={() => handleStartDeleteMode(chat)}
													delayLongPress={1000}
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
															</Flex>


														</Flex>
															
															
															
													</Box>

													<Divider />
													{/* <CloseChat isOpen={closeChatDialog} setIsOpen={setCloseChatDialog} chatUuid={chat.uuid} fetchChats={fetchChats}/> */}
												</TouchableOpacity>

										))
									}
								</Flex>
							</ScrollView>

							
							{/* <Flex h={'47%'} w={'100%'} pt={1} direction='column' backgroundColor={'#fa8797'}>
							
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
										onPress={() => setChatsBarVisible(false)}
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
										disabled={selectedChat.event[0].acceptedUuids.includes(userUuid) || selectedChat.event[0].deleted}
									>
										<Text textAlign='center' color='#fa8797' bold>Confirm Attendance</Text>
									</Button>
									<Text>{selectedChat.deleted}</Text>
								</Flex>
							</Flex> */}
						{/* </PresenceTransition> */}
						
						


						{/* {
							!selectedChat.event[0].deleted ?
							<Chat chatUuid={selectedChat.uuid} selectedChat={selectedChat} eventUuid={selectedChat.eventUuid} fetchChats={fetchChats} />:
							<Center h={'68%'}>
								<Text>This event has been deleted by the creator.</Text>
							</Center>
						}



						<CloseChat isOpen={closeChatDialog} setIsOpen={setCloseChatDialog} chatUuid={selectedChat.uuid} fetchChats={fetchChats}/>*/}
					</Flex>
				 	// :

				 	// <Flex h={'100%'}>
				 	// 	<Box h={'100%'}>
				 	// 		<Text>
				 	// 			You don't have any active chats! Send someone a message on the discover page to create a new chat!
				 	// 		</Text>
				 	// 	</Box>
				 	// </Flex>
				 }			 
			</Box>
			}
		</>
	)
};



export default Messages;