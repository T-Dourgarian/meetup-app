import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View,RefreshControl } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, ScrollView, Stack, Avatar, Center, Flex, Text, Image, Spinner } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import env from "../../config/env";
import dateFormat from 'dateformat'
import Ionicons from 'react-native-vector-icons/Ionicons';
import socket from '../../config/socket';
import SingleEvent from '../Discover/SingleEvent';

const MyEvents = ({ navigation, route }) => {

	const [filter, setFilter] = useState('created')
	const [events, setEvents] = useState([])
	const [spinner, setSpinner] = useState(false);
	const currentFilter = useRef(filter);
	const [currentUserUuid, setCurrentUserUuid] = useState(null)
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
        // This effect executes on every render (no dependency array specified).
        // Any change to the "participants" state will trigger a re-render
        // which will then cause this effect to capture the current "participants"
        // value in "participantsRef.current".
        currentFilter.current = filter;
    });

	const setCurrentUser = async () => {
		const uuid =  await SecureStore.getItemAsync('uuid')
		setCurrentUserUuid(uuid)
	}


	const onRefresh = React.useCallback(() => {
	  setRefreshing(true);
	  wait(200).then(() => {
		  setRefreshing(false);
		  fetchData(currentFilter.current); 
	  });
	}, []);
  

	const wait = (timeout) => {
		return new Promise(resolve => setTimeout(resolve, timeout));
	  }
  

	const fetchData = async (newFilter) => {
		try {
			setSpinner(true);

			const token = await SecureStore.getItemAsync('accessToken');
			const { data } = await axios.get(`${env.API_URL}:3000/api/myevents/${newFilter ? newFilter : filter}`,
			{
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			setEvents(data.events);

			setSpinner(false);
		
		} catch(error) {
			console.log(error);
		}
	};

	useEffect(() => {
		console.log('here')
		setCurrentUser()
		fetchData();
	}, [])


	useEffect(() => {
		if (route.params && route.params.filter) {
			setFilter(route.params.filter);
			fetchData(route.params.filter);
		}
	}, [route.params])


	const handleFilterChange = (newFilter) => {
		if (newFilter !== filter) {
			setFilter(newFilter);
			fetchData(newFilter);
		}
	}


	return (
		<Box h={'100%'} backgroundColor='#fff'>
			<Flex direction='row' h='8%' w='100%'>
				<Button
					w='50%'
					h='100%'
					variant='unstyled'
					backgroundColor={filter === 'created' ? '#fb7185' : '#fff'}
					onPress={() => handleFilterChange('created')}
					borderRadius={0}
					borderBottomWidth={1}
					borderColor='#fb7185'
				>
					<Text textAlign='center' bold color={filter === 'created' ? '#fff' : '#fb7185'} >Created By Me</Text>
				</Button>
				<Button
					w='50%'
					h='100%'
					variant='unstyled'
					backgroundColor={filter === 'attended' ? '#fb7185' : '#fff'}
					onPress={() => handleFilterChange('attended')}
					borderRadius={0}
					borderBottomWidth={1}
					borderColor='#fb7185'
				>
					<Text textAlign='center' bold color={filter === 'attended' ? '#fff' : '#fb7185'}>Attended By Me</Text>
				</Button>
			</Flex>

			{
				spinner ?
				<Center flex={1}>
					<Spinner color='#fb7185'/>
				</Center>:
				<>
					{
						events && events[0] ?
						<ScrollView h='92%'
							refreshControl={
								<RefreshControl
									refreshing={refreshing}
									onRefresh={onRefresh}
								/>
							}
						>
							{
								events.map(event => 
									(
										<SingleEvent key={event.uuid} currentUserUuid={currentUserUuid} navigation={navigation} event={event} myEventsScreen={filter} fetchMyEventsData={fetchData}/>
									)
								)
							}
						</ScrollView>:
							<Center w={'100%'}>
								<Text my={3} color='#a8a29e' fontSize={13} textAlign='center' w={'75%'}>
									{
										filter ==='created'? 
										'You haven"t created any events yet. Navigate to the Create page to create your first event!':
										'You have no past or currently scheduled events. Navigate to the Discover page to find events!'
									}
								</Text>
							</Center>

					}
				</>
			}

		</Box>
	)
};

export default MyEvents;