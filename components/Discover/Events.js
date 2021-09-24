import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View, RefreshControl } from 'react-native';
import axios from 'axios';
import { List, Box, Button,Text, ScrollView, Input, Spinner, Center, Flex } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SingleEvent from './SingleEvent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import env from '../../config/env';
import * as Location from 'expo-location';
import Params from './Params';

// const HomeStack = createNativeStackNavigator();


function Event({ navigation }) {

	const [events, setEvents] = useState([])
	const [search, setSearch] = useState('')
	const [spinner, setSpinner] = useState(false);
	const [refreshing, setRefreshing] = useState(false)
	const [currentUserUuid, setCurrentUserUuid] = useState(null);
	const [userLocation, setUserLocation] = useState({
		lat: null,
		lng: null
	})
	
	// params modal
	const [paramsModal, setParamsModal] = useState(false) 
	const [locationRadius, setLocationRadius] = useState(20);
	const [genderFilter, setGenderFilter] = useState(['Male', 'Female', 'Other'])
	
	const currentSearch = useRef(search);
	const mountedRef = useRef(true);
	const currentGenderFilter = useRef(genderFilter);
	const currentLocationRadius = useRef(locationRadius);
	const currentUserLocation = useRef(userLocation);


	const setCurrentUser = async () => {
		const uuid =  await SecureStore.getItemAsync('uuid')
		
		if (mountedRef.current) {
			setCurrentUserUuid(uuid)
		}

	}


	useEffect(() => {
        // This effect executes on every render (no dependency array specified).
        // Any change to the "participants" state will trigger a re-render
        // which will then cause this effect to capture the current "participants"
        // value in "participantsRef.current".
		currentSearch.current = search; 
		currentGenderFilter.current = genderFilter;
		currentLocationRadius.current = locationRadius;
		currentUserLocation.current = userLocation
		mountedRef.current = true;
    });


	const getUserLocation = async () => {
		try {

			const locationPermission = await Location.getForegroundPermissionsAsync()

			// console.log('locationPermission',locationPermission)
		
			if (locationPermission.granted) {
				
				let location = await Location.getCurrentPositionAsync({});
				location = JSON.parse(JSON.stringify(location))

				if (mountedRef.current) {
					setUserLocation({lat: location.coords.latitude, lng: location.coords.longitude});
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect( () => {

		setCurrentUser();
		getUserLocation()
		fetchData();
		

		return () => { 
			mountedRef.current = false
		  }
	}, [])



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

	const fetchData = async () => {
		try {

			if (mountedRef.current) {
				setSpinner(true);
			}

			const token = await SecureStore.getItemAsync('accessToken');

			const { data } = await axios.get(`${env.API_URL}:3000/api/event`,
				{
					params: {
						search: currentSearch.current,
						lat: currentUserLocation.current.lat,
						lng: currentUserLocation.current.lng,
						genderFilter: currentGenderFilter.current,
						locationRadius: currentLocationRadius.current,
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


	
  return (
    <Box backgroundColor='#fff' h={'100%'}>
		<ScrollView 
			h={'100%'}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => onRefresh()}
				/>
			}
		>
			<Flex direction='row'>
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
					w={'85%'}
					ml={2}
					// margin={'auto'}
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

				<Button 
					mx='auto' 
					variant='unstyled' 
					size='xs'
					onPress={() => setParamsModal(true)}
				>
					<Ionicons name='filter-outline' size={25}/>
				</Button>
			</Flex>
				
			{
				!spinner ? 
				<>
					{
						events[0] ?
						events.map(event => <SingleEvent key={event.uuid} currentUserUuid={currentUserUuid} discoverScreen={true} navigation={navigation} event={event} />):
						<Box>
							<Text textAlign='center'>There are no events in your area.</Text>
						</Box>
					}
				</>:
				<Center my={'40%'}>
					<Spinner size='large' color='#f43f5e' />
				</Center>
			}


		</ScrollView>


		{
			paramsModal &&
			<Params 
				setIsOpen={setParamsModal} 
				locationRadius={locationRadius}
				setLocationRadius={setLocationRadius}
				genderFilter={genderFilter}
				setGenderFilter={setGenderFilter}
				fetchData={fetchData}
			/>
		}
	
	</Box>
  );
}



export default Event;