import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Box, Button, HStack, Stack, Center, Text, Avatar, Flex, Spacer, ScrollView, Image } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import dateFormat from 'dateformat'
import GoogleStaticMap from 'react-native-google-static-map'
import DeleteEvent from '../MyEvents/DeleteEvent';

import env from "../../config/env";


const SingleEvent = ({ event, navigation, discoverScreen, myEventsScreen, fetchMyEventsData }) => {

	const [currentUserUuid, setCurrentUserUuid] = useState('');
	const [hidden, setHidden] = useState(event.hidden);
	const [deleted, setDeleted] = useState(event.deleted);
	const [deleteModal, setDeleteModal] = useState(false);

	useEffect(() => {
		setCurrentUser();

		return () => {
			setCurrentUserUuid('');
		};
	},[])

	const setCurrentUser = async () => {
		const uuid =  await SecureStore.getItemAsync('uuid')
		setCurrentUserUuid(uuid)
	}


	const handleSendMessage = async () => {
		try {

			const token = await SecureStore.getItemAsync('accessToken');
		
			const { data } = await axios.post(`${env.API_URL}:3000/api/chat/${event.uuid}`, 
				{
					eventUuid: event.uuid
				},
				{
					headers: {
						authorization: `Bearer ${token}`
					}
				}
			)

			navigation.navigate('Messages', {
				chatUuid: data.chat.uuid
			})

		} catch(error) {
			console.log(error);
		}
	} 

	const toggleHideEvent = async() => {
		try {

			const token = await SecureStore.getItemAsync('accessToken');
		
			await axios.put(`${env.API_URL}:3000/api/myevents/hide/${event.uuid}`, 
				{},
				{
					headers: {
						authorization: `Bearer ${token}`
					}
				}
			)

			setHidden(!hidden)

		} catch(error) {
			console.log(error)
		}
	}

	const editEvent = async () => {
		try {

		} catch(error){
			console.log(error)
		}
	}



	return (
		<Flex key={event.uuid} >
			<Flex 
				my={2}
				mx={2}
				direction={'row'}
			>
				{
					event.createdBy.ppURL ?
					<Image
						source={{
							uri: `${env.API_URL}:3000${event.createdBy.ppURL}`,
						}}
						w={'60px'}
						h={'60px'}
						borderRadius={100}
						alt="profile picture"
					>
						
					</Image>:
					<Box
						borderRadius={100}
						w={'60px'}
						h={'60px'}
					>
						<Ionicons 
							size={50}
							name='person-outline'
						/>
					</Box>
				}
				
				<Box
				
					ml={2}
				>
					<Flex
						direction={'row'}
						w={'100%'}
					>
						<Center>
							<Text  
								mr={12}
								color='#27272a'
								fontWeight='bold'
							>{event.createdBy.firstName} {event.createdBy.lastName}</Text>
						</Center>
						<Center ml={9}>
							<Flex direction='row'>
								<Box 
									ml={2}
								>
									<Text
										fontSize={12}
										color='#27272a'
										bold
									>{dateFormat(event.date, 'h:MM TT - m/dd')}</Text>
								</Box>
							</Flex>
						</Center>
					</Flex>
					<Flex direction='row' mt={2}>
						<Box 
							backgroundColor='#fb7185'
							px={2}
							pb={1}
							borderRadius={20}
						>
							<Text 
								color='#fff' 
								fontWeight='bold'
							>{event.name}</Text>
						</Box>
						{
							myEventsScreen === 'created' &&
							<Box pl={2}>
								{
									hidden ?
									<Flex direction='row' align='center' justify='center'>
										<Ionicons color='grey' size={13} name='eye-off-outline' />
										<Text h={5} ml={1} fontSize={13} color='grey'>hidden</Text>
									</Flex>:
									<Flex direction='row' align='center' justify='center'>
										<Box mt={1}>
											<Ionicons color='grey' size={13} name='eye-outline' />
										</Box>
										<Text ml={1} fontSize={13} color='grey'>visible</Text>
									</Flex>
								}
							</Box>
						}
						<Spacer />

						{
							new Date(event.date) > new Date() ?
							<Box 
								backgroundColor='#16a34a'
								px={2}
								pb={1}
								borderRadius={20}
							>
								<Text 
									color='#fff' 
									fontWeight='bold'
								>Active</Text>
							</Box>:
							<Box 
								backgroundColor='#991b1b'
								px={2}
								pb={1}
								borderRadius={20}
							>
								<Text 
									color='#fff' 
									fontWeight='bold'
								>Expired</Text>
							</Box>
						}
					</Flex>
				</Box>
				
			</Flex>	
			<Flex
				mx={2}
				px={2}
				py={2}
				backgroundColor='#fb7185'
				borderRadius={10}
			>
				<Flex 
					direction='row'
				>
					<Box>
						<Text 
							fontSize={14} 
							bold
							color='#ffffff'
						>
							Description
						</Text>
						<Text color='#fff' fontSize={12}>
							{event.description}
						</Text>
					</Box>
					<Spacer />
					<Box>
						<Text
							color="#fff"
							bold
							fontSize={13}
						>
							{event.accepted.length} attending
						</Text>
						<Text
							color="#fff"
							bold
							fontSize={13}
						>
							{event.currentlyMessaging.length} currently messaging
						</Text>
					</Box>
				</Flex>
				<Flex mt={2}>
					<Flex direction='row' mb={2} pr={2}>
						<Ionicons color='#fff' size={17} name='location-outline' />
						<Text color='#fff' fontSize={12} bold>
							{event.location}
						</Text>
					</Flex>
					<Box>
						<Center>
							<Box>
								<Image 
									h={200}
									w={400}
									borderRadius={10}
									mb={2}
									size={'xl'}
									source={{ uri: event.mapUrl}}
									alt='map'
								/>
							</Box>
						</Center>
					</Box>
					{
						discoverScreen &&
						<Button
							backgroundColor='#fff'
							h={8}
							w={'100%'}
							borderRadius={20}
							shadow={4}
							isDisabled={event.createdBy.uuid === currentUserUuid }
							onPress={() => handleSendMessage()}
						>
							<Text
								color='#fb7185'
								bold
							>Send { event.createdBy.firstName } a message.</Text>
						</Button>
					}
					{
						myEventsScreen === 'attended' &&
						<Flex direction='row'>	
							<Button
								backgroundColor='#fff'
								h={8}
								w={'48%'}
								borderRadius={20}
								shadow={4}
								isDisabled={event.createdBy.uuid === currentUserUuid }
								onPress={() => handleSendMessage()}
							>
								<Text
									color='#fb7185'
									bold
									onPress={() => handleSendMessage()}
									fontSize={15}
								>
									Withdraw attendance
								</Text>
							</Button>
							<Spacer />
							<Button
								backgroundColor='#fff'
								h={8}
								w={'48%'}
								borderRadius={20}
								shadow={4}
								isDisabled={event.createdBy.uuid === currentUserUuid }
								onPress={() => handleSendMessage()}
							>
								<Text
									color='#fb7185'
									bold
								>
									Go to messages
								</Text>
							</Button>
						</Flex>
					}

					{
						myEventsScreen === 'created' &&
						<Flex direction='row'>	
							<Button
								backgroundColor='#fff'
								h={8}
								w={'32%'}
								borderRadius={20}
								shadow={4}
								onPress={() => toggleHideEvent()}
							>
								{
									hidden ? 
									<Text
										color='#fb7185'
										bold
										fontSize={14}
									>
										Show Event
									</Text>:
									<Text
										color='#fb7185'
										bold
										fontSize={14}
									>
										Hide Event
									</Text>
								}
							</Button>
							<Spacer />
							<Button
								backgroundColor='#fff'
								h={8}
								w={'32%'}
								borderRadius={20}
								shadow={4}
								onPress={() => setDeleteModal(true)}
							>
								<Text
									color='#fb7185'
									bold
									fontSize={14}
								>
									Delete Event
								</Text>
							</Button>
							<Spacer />
							<Button
								backgroundColor='#fff'
								h={8}
								w={'32%'}
								borderRadius={20}
								shadow={4}
								onPress={() => editEvent()}
							>
								<Text
									color='#fb7185'
									bold
									fontSize={14}
								>
									Edit Event
								</Text>
							</Button>
						</Flex>
					}
					
				</Flex>
			</Flex>


			{
				deleteModal &&
				<DeleteEvent setIsOpen={setDeleteModal} isOpen={deleteModal} event={event} setDeleted={setDeleted} fetchMyEventsData={fetchMyEventsData}/>
			}
		</Flex>
	)
}


export default SingleEvent;