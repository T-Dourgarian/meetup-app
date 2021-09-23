import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View,RefreshControl } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, ScrollView, Stack, Avatar, Center, Flex, Text, Image, Spinner, Modal, Spacer, Divider } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import dateFormat from 'dateformat'
import Ionicons from 'react-native-vector-icons/Ionicons';
import socket from '../../config/socket';

import env from "../../config/env";


const SeeAttending = ({ setIsOpen, event }) => {

	const [creator, setCreator] = useState(null);
	const [attending, setAttending] = useState([]);

	useEffect(() => {
		getAttendees();
	},[])

	const getAttendees = async () => {
		try {

			const token = await SecureStore.getItemAsync('accessToken');
		
			const { data } = await axios.get(`${env.API_URL}:3000/api/event/attending/${event.uuid}`, 
				{
					headers: {
						authorization: `Bearer ${token}`
					}
				}
			)

			setAttending(data.attending);
			setCreator(data.creator);

		} catch(error) {
			console.log(error);
		}
	}

	return (
		<Modal isOpen={true} size={'xl'} >
			<Modal.Content w='80%' h={'80%'}>
			<Modal.Body>
				<ScrollView w='100%'>
					{
						creator &&
						<>
							<Text
								fontSize={16}
								color='#fb7185'
								bold
								mb={2}
							>Event Creator</Text>
							<Flex  direction='column' w='95%' mx='auto' my={2} px={3} py={3} backgroundColor='#fafafa' shadow={3}>
								<Flex direction='row'>
									{
										creator.ppURL ? 
										<Image
											source={{
												uri: `${env.API_URL}:3000${creator.ppURL}`,
											}}
											w={'50px'}
											h={'50px'}
											borderRadius={100}
											alt="profile picture"
											mr={2}
										/>:
										<Box
											borderRadius={100}
											w={'60px'}
											h={'60px'}
											my='auto'
										>
											<Ionicons 
												size={50}
												name='person-outline'
											/>
										</Box>
									}

									
									<Text my={'auto'} bold fontSize={17}>{ creator.firstName } { creator.lastName }</Text>
										
								</Flex>

								{
									!!creator.bio &&
									<Text
										fontSize={14}
										color='#a8a29e'
									>
										{ creator.bio }
									</Text>
								}
								
								{
									(!!creator.age || !!creator.gender || !!creator.occupation) &&
									<Flex direction='row'>
										{
											!!creator.age && 
											<>
												<Flex direction='column'>
													<Text
														fontSize={16}
														bold
														color='#fb7185'
													>Age</Text>
													<Text
														fontSize={14}
														color='#a8a29e'
													>{ creator.age }</Text>
												</Flex>
												<Spacer />
											</>
										}

										{
											!!creator.gender &&
											<>
												<Flex direction='column'>
													<Text
														fontSize={16}
														bold
														color='#fb7185'
													>M/F</Text>
													<Text
														fontSize={14}
														color='#a8a29e'
													>{ creator.gender }</Text>
												</Flex>
												<Spacer />
											</>
										}

										
										{
											!!creator.occupation &&
											<Flex direction='column'>
												<Text
													fontSize={16}
													bold
													color='#fb7185'
												>Occupation</Text>
												<Text
													fontSize={14}
													color='#a8a29e'
												>{ creator.occupation }</Text>
											</Flex>
										}
									</Flex>
								}
							</Flex>
						</>
					}

					<Text
						fontSize={16}
						color='#fb7185'
						bold
						mb={2}
					>Attending ({attending.length})</Text>

					{
						attending[0] &&
						attending.map(user => (
							<Flex key={user.uuid} direction='column' w='95%' mx='auto' my={2} px={3} py={3} backgroundColor='#fafafa' shadow={3}>
								<Flex direction='row' mb={1}>
									{
										user.ppURL ? 
										<Image
											source={{
												uri: `${env.API_URL}:3000${user.ppURL}`,
											}}
											w={'50px'}
											h={'50px'}
											borderRadius={100}
											alt="profile picture"
											mr={2}
										/>:
										<Box
											borderRadius={100}
											w={'60px'}
											h={'60px'}
											my='auto'
										>
											<Ionicons 
												size={50}
												name='person-outline'
											/>
										</Box>
									}

									<Text my='auto' bold fontSize={17}>{ user.firstName } { user.lastName }</Text>
									

								</Flex>
								
								{
									user.bio ?
									<Text
										fontSize={14}
										color='#a8a29e'
									>
										{user.bio}
									</Text>:
									null
								}
								
								<Flex direction='row'>
									{
										!!user.age &&
										<>
											<Flex direction='column'>
												<Text
													fontSize={16}
													bold
													color='#fb7185'
												>Age</Text>
												<Text
													fontSize={14}
													color='#a8a29e'
												>{user.age}</Text>
											</Flex>
											<Spacer />
										</>
									}
									
									{
										!!user.age &&
										<>
											<Flex direction='column'>
												<Text
													fontSize={16}
													bold
													color='#fb7185'
												>M/F</Text>
												<Text
													fontSize={14}
													color='#a8a29e'
												>{ user.gender }</Text>
											</Flex>
											<Spacer />
										</>
									}

									{
										!!user.age &&
										<>
											<Flex direction='column'>
												<Text
													fontSize={16}
													bold
													color='#fb7185'
												>Occupation</Text>
												<Text
													fontSize={14}
													color='#a8a29e'
												>{ user.occupation }</Text>
											</Flex>
										</>
									}
								</Flex>
							</Flex>
						))
					}
				</ScrollView>
			</Modal.Body>
			<Modal.Footer >
				<Button
					onPress={() => setIsOpen(false)}
					variant='unstyled'
					color='#fb7185'
					my={'auto'}
				>
					<Text color='#fb7185'>Close</Text>
				</Button>
			</Modal.Footer>
			</Modal.Content>
		</Modal>
	)
}


export default SeeAttending;