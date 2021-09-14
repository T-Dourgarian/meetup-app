import * as React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { List, Box, Text, Input, Button, Stack, Center, TextArea, ScrollView,Flex, Modal } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker';
import dateFormat from 'dateformat'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import env from "../../config/env";
import Ionicons from 'react-native-vector-icons/Ionicons';


function LocationPicker({ setModal, setLocation }) {

	const [tempLocation, setTempLocation] = useState(() => '')
	

	useEffect(() => {
		// console.log(env.AUTOCOMPLETE_KEY)
	}, [])

	return (
		<Modal
			size='full'
			isOpen={true}
			overlayVisible={false}
		>
			<Box h={'100%'} w={'100%'} backgroundColor={'#fff'}>

				<Box h={'88%'} w={'90%'} margin={'auto'} mt={5}>

					<Button
						w={'28%'}
						variant='unstyled'
						py={2}
						borderWidth={1}
						borderColor={'#fb7185'}
						onPress={() => setModal(false)}
					>
						<Flex direction='row'>
							<Ionicons name='arrow-back' size={25} color='#fb7185'/>
							<Text 
								margin={'auto'} 
								
								color='#fb7185'
							>BACK</Text>
						</Flex>
					</Button>
					
						<Box mt={3}>
							<Text
								fontSize={22} 
								bold 
								w={'100%'}
								color={'#fb7185'}
								mb={1}
								ml={3}
							>
								Location
							</Text>
						</Box>


						<GooglePlacesAutocomplete
							placeholder='Search Location'
							onPress={(data, details = null, text) => {
								// 'details' is provided when fetchDetails = true
								// console.log(data, details);
								console.log(details.description);
								setTempLocation(details.description)
							}}
							query={{
								key: env.AUTOCOMPLETE_KEY,
								language: 'en',
							}}
							styles={{
								textInputContainer: {
									backgroundColor: 'white',
									height: 50,
								},
								textInput: {
									borderColor:'#fda4af',
									borderWidth: 2
								},
							}}
							
						/>
					
					
				</Box>
				
				<Center h={'12%'}>
					<Button
						onPress={() => {
							setModal(false);
							setLocation(tempLocation);
						}}
						disabled={!tempLocation}
						backgroundColor={'#fb7185'}
						w={'70%'}
					>
						Confirm Location
					</Button>
				</Center>
				
			</Box>
		</Modal>
	);
}

export default LocationPicker;