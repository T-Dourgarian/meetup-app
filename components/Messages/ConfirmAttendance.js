import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, Flex, ScrollView, Text, Modal } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import env from "../../config/env";
import moment from 'moment'

import socket from '../../config/socket';

const ConfirmAttendance = ( {isOpen, setIsOpen}) => {

	const handleConfirm = async() => {

	}

	return (
		<Modal isOpen={isOpen} size={'lg'}>
			<Modal.Content>
			<Modal.Header>
				<Text fontSize={20} bold color='#fb7185'>
					Confirm Attendance
				</Text>
			</Modal.Header>
			<Modal.Body>
				Please confirm that you will be attending the event.
			</Modal.Body>
			<Modal.Footer>
				<Button
					color='#fff'
					backgroundColor='#fb7185'
					mr={2}
					onPress={() => handleConfirm()}
				>Confirm</Button>
				<Button
					onPress={() => {
						setIsOpen(false)
					}}
					variant='outline'
					borderColor='#27272a'
				>
					<Text color='#27272a'>Cancel</Text>
				</Button>
			</Modal.Footer>
			</Modal.Content>
		</Modal>
	)
}

export default ConfirmAttendance;