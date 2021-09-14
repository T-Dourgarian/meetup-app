import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, Flex, ScrollView, Text } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import env from "../../config/env";
import moment from 'moment'

import socket from '../../config/socket';

const usePreviousValue = value => {
	const ref = useRef();
	useEffect(() => {
	  ref.current = value;
	});
	return ref.current;
  };

const Chat = ({ chatUuid, eventUuid, selectedChat }) => {



	const [text, setText] = useState('');
	const [currentUserUuid, setCurrentUserUuid] = useState('');
	const scrollViewRef = useRef();

	

	const prevChatUuid = usePreviousValue(chatUuid);

	useEffect( () => {
		setCurrentUser();
	},[])

	


	useEffect(() => {

		socket.emit('leaveChatRoom', prevChatUuid);

		socket.emit('joinChatRoom', chatUuid);

	},[chatUuid]);


	const setCurrentUser = async () => {
		setCurrentUserUuid( await SecureStore.getItemAsync('uuid'))
	}

	
	const sendMessage = async () => {
		const token = await SecureStore.getItemAsync('accessToken');
		console.log('sendmessages')
		socket.emit('sendMessage', { eventUuid, chatUuid, message: text, token })

		setText('');
	}


	return (
		<Box h={'68%'}>
			<ScrollView h={10}
				ref={scrollViewRef}
				onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: false })}
			>
				{
					selectedChat && selectedChat.messages[0] &&
					selectedChat.messages.map(message => {
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
			/>
		</Box>
	)
};

export default Chat;