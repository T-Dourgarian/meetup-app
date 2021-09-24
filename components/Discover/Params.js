import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View,RefreshControl } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, ScrollView, Stack, Avatar, Center, Flex, Text, Image, Spinner, Modal, Spacer, Select, Divider, Checkbox } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import dateFormat from 'dateformat'
import Ionicons from 'react-native-vector-icons/Ionicons';
import socket from '../../config/socket';
import DateTimePicker from '@react-native-community/datetimepicker';

import env from "../../config/env";


const Params = ({ setIsOpen, locationRadius, setLocationRadius, genderFilter, setGenderFilter, fetchData }) => {


	return (
		<Modal isOpen={true} size={'sm'} >
			<Modal.Content w='80%' h={'55%'} pl={4}>
			<Modal.Body pr={4}>

				<Box w='90%' margin='auto' mt={1}>
					<Text
						fontSize={16}
						bold
						color='#a8a29e'
					>Location Radius</Text>
					<Select
						selectedValue={locationRadius}
						// h={20}
						w={'100%'}
						borderRadius={8}
						borderColor={'#fecdd3'}
						borderWidth={1}
						py={1}
						onValueChange={(value) => setLocationRadius(value)}
					>
						<Select.Item label="5 miles" value={5} />
						<Select.Item label="10 miles" value={10}/>
						<Select.Item label="20 miles" value={20} />
						<Select.Item label="30 miles" value={30} />
					</Select>
				</Box>

				<Box w='90%' margin='auto' mt={2}>
					<Text
						fontSize={16}
						bold
						color='#a8a29e'
					>Creator Gender</Text>
					<Checkbox.Group
						colorScheme='red'
						onChange={setGenderFilter}
						value={genderFilter}
						accessibilityLabel="Event Owner Gender"
						size='lg'
					>
						<Checkbox value="Male" aria-label='Male' mt={1} >
							Male
						</Checkbox>
						<Checkbox value="Female" aria-label='Female' mt={2}>
							Female
						</Checkbox>
						<Checkbox value="Other" aria-label='Other' mt={2}>
							Other
						</Checkbox>
					</Checkbox.Group>
				</Box>
			
				
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


export default Params;