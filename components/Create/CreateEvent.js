import * as React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { List, Box, Text, Input, Button, Modal, Stack, Center, TextArea, ScrollView,Flex } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker';
import dateFormat from 'dateformat'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import LocationPicker from './LocationPicker';
import env from '../../config/env';


function createEvent({ navigation }) {

	const [name, setName] = useState(() => '')
	const [description, setDescription] = useState(() => '')
	const [location, setLocation] = useState(() => '')
	

	useEffect(() => {
		// console.log(event)
	}, [])


	const [date, setDate] = useState(new Date());
	const [showDate, setShowDate] = useState(false);
	const [showTime, setShowTime] = useState(false);
	const [modal, setModal] = useState(false);
	


	const handleDateChange = (event, selectedDate) => {
		if (event.type !== 'dismissed') {
			setShowDate(false);

			setDate(selectedDate);

			setShowTime(true)
		}	else {
			setShowDate(false);
		}
	}

	const handleTimeChange = (event, selectedDate) => {
		if (event.type !== 'dismissed') {
			setShowTime(false);
			setDate(selectedDate);
		} else {
			setShowTime(false);
		}
	}

	const handleCreateEvent = async () => {
		try {

			if (name && description && location) {
				const token = await SecureStore.getItemAsync('accessToken');

				await axios.post(`${env.API_URL}:3000/api/event/create`,
					{
						name,
						date,
						description,
						location
					},
					{
						headers: {
							'Authorization': `Bearer ${token}`
						}
					}
				);

				navigation.navigate('Discover');

				setName('');
				setDate( new Date() );
				setDescription('');
				setLocation('');
				
			}  else {
				console.log('fill out all inputs')
			}

		} catch(error) {
			console.log(error)
		}
	}
  
  

	return (
		<Box backgroundColor={'#fff'} h={'100%'}>
			<Flex px={2} pt={2} >
				<Box mb={5}>
					<Box mb={1} ml={3}>
						<Text 
							fontSize={22} 
							bold 
							color={'#fb7185'}
						> Activity </Text>
					</Box>
					<Input 
						w={'100%'}
						variant="outline"
						value={name}
						bordered
						onChangeText={(text) => setName(text)}
						placeholder="What activity do you want to do?"
						borderRadius={30}
						borderColor={'#fecdd3'}
						borderWidth={2}
						_focus={
							{
								style: {
									borderColor: '#fb7185',
								}
							}
						}
					/>
				</Box>

				<Box mb={5}>
					<Text 
						fontSize={22} 
						bold 
						w={'100%'}
						color={'#fb7185'}
						mb={1}
						ml={3}
					>Description</Text>
					<TextArea 
						variant="outline"
						space={4}
						value={description}
						placeholder="Any necessary details or desciptions of the activity." 
						onChangeText={(text) => setDescription(text)}
						textAlignVertical='top'
						borderColor={'#fecdd3'}
						borderRadius={12}
						borderWidth={2}
						_focus={
							{
								style: {
									borderColor: '#fb7185',
								}
							}
						}
					/>
				</Box>

				<Box>
					<Text 
						fontSize={22} 
						bold 
						w={'100%'}
						color={'#fb7185'}
						mb={1}
						ml={3}
					>Date and Time</Text>
					<Button
						w={'100%'}
						onPress={() => setShowDate(true)}
						title="Show date picker!" 
						backgroundColor={'#fff'}
						borderWidth={2}
						borderColor={'#fecdd3'}
						borderRadius={30}
						mb={5}
					>
						<Text color={'#fb7185'}>
							{dateFormat(date, "dddd, mmmm dS, yyyy, h:MM TT")}
						</Text>
					</Button>


					<Box>
						<Text 
							fontSize={22} 
							bold 
							w={'100%'}
							color={'#fb7185'}
							mb={1}
							ml={3}
						>Location</Text>
						<Button
							w={'100%'}
							onPress={() => setModal(true)}
							title="Show date picker!" 
							backgroundColor={'#fff'}
							borderWidth={2}
							borderColor={'#fecdd3'}
							borderRadius={30}
						>
							<Text color={'#fb7185'}>
								{
									location ?
									location:
									'Select Location'
								}
							</Text>
						</Button>
					</Box>

					{/* location picker Modal */}
					{
						modal &&
						<LocationPicker setModal={setModal} setLocation={setLocation}/>
					}
					
					{showDate && (
						<DateTimePicker
							testID="dateTimePicker"
							value={date}
							mode='date'
							is24Hour={false}
							display="default"
							onChange={handleDateChange}
						/>
					)}

					{showTime && (
						<DateTimePicker
							testID="dateTimePicker"
							value={date}
							mode='time'
							is24Hour={false}
							display="default"
							onChange={handleTimeChange}
						/>
					)}
				</Box>

				<Center my={7}>
					<Button
						w={'70%'}
						backgroundColor='#fb7185'
						onPress={() => handleCreateEvent()}
						py={2}
					>
						<Text bold color='white' fontSize={20}>Create</Text>
					</Button>
				</Center>
			</Flex>
			
		</Box>
	);
}

export default createEvent;