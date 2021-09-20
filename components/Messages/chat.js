import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { List, Box, Button, Input, Flex, ScrollView, Text, Center } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import env from "../../config/env";
import moment from 'moment'
import { addMessage, setChats } from '../../redux/actions/chat';

import socket from '../../config/socket';

const Chat = ({ route }) => {

	const [ chatUuid ] = useState(route.params.uuid);
	const [ eventUuid ] = useState(route.params.event[0].uuid);
	const [messages, setMessages] = useState(route.params.messages);
	const [text, setText] = useState('');
	const [currentUserUuid, setCurrentUserUuid] = useState('');
	const [otherChatUser, setOtherChatUser] = useState('');
	const scrollViewRef = useRef();
	const currentMessages = useRef(messages);

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
		setCurrentUser();
	},[])


	useEffect(() => {
        // This effect executes on every render (no dependency array specified).
        // Any change to the "participants" state will trigger a re-render
        // which will then cause this effect to capture the current "participants"
        // value in "participantsRef.current".
		currentMessages.current = messages; 
    });

	useEffect(() => {

		socket.emit('joinChatRoom', chatUuid);


		socket.on('message', (newMessage) => {
			const newMessages = [...currentMessages.current, newMessage];

			dispatch(addMessage(newMessage))

			setMessages(newMessages);

		});

		return () => {
			socket.emit('leaveChatRoom', chatUuid);
			socket.off('message')
		}
	},[]);


	const setCurrentUser = async () => {
		const uuid = await SecureStore.getItemAsync('uuid')
		setCurrentUserUuid(uuid);

		const otherUser = route.params.users.find(user => user.uuid !== uuid)

		setOtherChatUser(otherUser)

	}

	
	const sendMessage = async () => {
		const token = await SecureStore.getItemAsync('accessToken');
		console.log('sendmessages')
		socket.emit('sendMessage', { eventUuid, chatUuid, message: text, token })

		setText('');
	}


	return (
		<Box h={'100%'} backgroundColor='#fff'>
			<ScrollView h={10}
				ref={scrollViewRef}
				onContentSizeChange={(width,height) => scrollViewRef.current.scrollTo({y:height})}
			>
				<Center>
					<Text fontSize={12} color='#a8a29e' w={'60%'} textAlign='center' pt={1} pb={3}> This is the beginning of your conversation with {otherChatUser.firstName} {otherChatUser.lastName} </Text>
				</Center>
				{
					messages && messages[0] &&
					messages.map(message => {
						if (message.from.uuid === currentUserUuid) {
							return (
								<Box 
									key={message.uuid} 
									backgroundColor='#fb7185'
									maxWidth={'80%'}
									ml={'20%'}
									mr={'2%'}
									my={1}
									borderRadius={10}
								>
									<Flex p={2}>
										<Text
											color='#fff'
										>{ message.message }</Text>
										<Text
											color='#fff'
											style={{
												textAlign: 'right',
											}}
											fontSize={12}
										>{ moment(message.createdAt).fromNow() }
										</Text>
									</Flex>
								</Box>
							)
						} else {
							return (
								<Box 
									key={message.uuid}
									maxWidth={'80%'}
									mr={'20%'}
									backgroundColor='#a8a29e'
									borderRadius={10}
									my={1}
									ml={2}
								>
									<Flex p={2}>
										<Text
											color='#fff'
											fontSize={13}
											bold
										>
											{ message.from.firstName }
										</Text>
										<Text
											color='#fff'
										>
											{ message.message }
										</Text>
										<Text
											color='#fff'
											fontSize={12}
											style={{
												textAlign: 'right'
											}}
										>
											{ moment(message.createdAt).fromNow() }
										</Text>
									</Flex>
								</Box>
							)
						}
					})

				}
			</ScrollView>
			{
				!route.params.event[0].deleted ? 
				<Input 
					placeholder='Message'
					value={text}
					onSubmitEditing={() => sendMessage()}
					onChangeText={(text) => setText(text)}
					mx={2}
					mb={2}
					mt={2}
					h={10}
					borderWidth={0}
					backgroundColor={'#f5f5f4'}
					borderRadius={30}
				/>:
				<Center
					h={10}
				>
					<Text color={'#fb7185'}>
						This event has been deleted by the owner.
					</Text>
				</Center>
			}
		</Box>
	)
};

export default Chat;