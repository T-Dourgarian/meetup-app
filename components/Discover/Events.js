import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View, RefreshControl } from 'react-native';
import axios from 'axios';
import { List, Box, Button,Text, ScrollView, Input, Spinner, Center } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import SingleEvent from './SingleEvent';

import Ionicons from 'react-native-vector-icons/Ionicons';

import env from '../../config/env';

// const HomeStack = createNativeStackNavigator();


function Event({ navigation }) {

	const [events, setEvents] = useState(() => [])
	const [search, setSearch] = useState(() => '')
	const [spinner, setSpinner] = useState(false);
	const [refreshing, setRefreshing] = useState(false)

	const mountedRef = useRef(true);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		wait(200).then(() => {
			setRefreshing(false);
			fetchData();
		});
	  }, []);
	
  
	  const wait = (timeout) => {
		  return new Promise(resolve => setTimeout(resolve, timeout));
		}

	async function fetchData() {
		try {

			if(mountedRef.current) {
				setSpinner(true);
			}
			const token = await SecureStore.getItemAsync('accessToken');

			const { data } = await axios.get(`${env.API_URL}:3000/api/event`,
				{
					params: {
						search
					},
					headers: {
						'Authorization': `Bearer ${token}`
					}
				},
			);

			if (mountedRef.current) {
				setSpinner(false)
				setEvents(data.events);
			}
		} catch(error) {
			console.log(error)
		}
	}

	useEffect( () => {

		mountedRef.current = true;
		fetchData();
		
		return () => {
			setEvents([]);
			setSpinner(false);
			mountedRef.current = false
		}
	}, [])

	
  return (
    <Box backgroundColor='#fff' h={'100%'}>
		{
			spinner ? 
			<Center flex={1}>
				<Spinner size='large' color='#f43f5e' />
			</Center>:
			<ScrollView 
				h={'100%'}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			>
				<Box>
					<Input 
						InputLeftElement={
							<Box ml={2}>
								<Ionicons
									name='search'
									size={20}
									color='#fb7185'
								/>
							</Box>
						}
						borderRadius={30}
						h={10}
						w={'95%'}
						margin={'auto'}
						my={3}
						py={0}
						value={search}
						_focus={
							{
								style: {
									borderColor: '#fb7185',
									borderWidth: 2
								}
							}
						}
						placeholder='Seach by activity'
						onChangeText={(text) => setSearch(text)}
						onSubmitEditing={() => fetchData()}
					/>
				</Box>

				{
					events[0] && 
					events.map(event => <SingleEvent key={event.uuid} discoverScreen={true} navigation={navigation} event={event} />)
				}
				</ScrollView>
		}
	
	</Box>
  );
}



export default Event;