import * as React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { List, Box, Text, Input, Button, Modal, Stack, Center, TextArea, ScrollView,Flex } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker';
import dateFormat from 'dateformat'

import LocationPicker from './LocationPicker';
import env from '../../config/env';


function CreateEvent({ navigation, event }) {

	const [name, setName] = useState(() => event ? event.name: '')
	const [description, setDescription] = useState(() => event ? event.description : '')
	const [location, setLocation] = useState(() => event ? event.location : '')
	const [date, setDate] = useState(event ? new Date(event.date) : new Date());

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

	const handleSaveChanges = async () => {	
		try {

			if (name && description && location) {
				const token = await SecureStore.getItemAsync('accessToken');

				console.log(date);

				await axios.put(`${env.API_URL}:3000/api/event/update`,
					{
						uuid: event.uuid,
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
							fontSize={18} 
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
						borderRadius={8}
						borderColor={'#fecdd3'}
						borderWidth={2}
						py={2}
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
						fontSize={18} 
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
						placeholder="Any needed details or desciptions of the activity or location." 
						onChangeText={(text) => setDescription(text)}
						textAlignVertical='top'
						borderColor={'#fecdd3'}
						borderRadius={8}
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
						fontSize={18} 
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
						borderRadius={8}
						py={2}
						mb={5}
					>
						<Text color={'#fb7185'}>
							{dateFormat(date, "dddd, mmmm dS, yyyy, h:MM TT")}
						</Text>
					</Button>


					<Box>
						<Text 
							fontSize={18} 
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
							borderRadius={8}
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

				{
					!event ? 
					<Center my={8} >
						<Button
							w={'70%'}
							my={'auto'}
							shadow={5}
							backgroundColor='#fb7185'
							onPress={() => handleCreateEvent()}
							py={2}
						>
							<Text bold color='white' fontSize={20}>Create</Text>
						</Button>
					</Center>:
					<Center my={8} >
						<Button
							w={'70%'}
							my={'auto'}
							shadow={5}
							backgroundColor='#fb7185'
							onPress={() => handleSaveChanges()}
							py={2}
						>
							<Text bold color='white' fontSize={20}>Save Changes</Text>
						</Button>
					</Center>
				}
			</Flex>
		</Box>
	);
}

export default CreateEvent;