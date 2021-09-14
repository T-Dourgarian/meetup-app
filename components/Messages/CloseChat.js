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


const CloseChat = ( {isOpen, setIsOpen} ) => {

	const deactivateChat = async () => {
		console.log('asdfasdf')
	}

	return (
		<Modal isOpen={isOpen} size={'lg'}>
			<Modal.Content>
			<Modal.Header>
				<Text fontSize={20} bold color='#fb7185'>
					Close Chat
				</Text>
			</Modal.Header>
			<Modal.Body>
				Please confirm that you want to close this chat. You can always resume communication by sending another message from the discover screen on the same event.
			</Modal.Body>
			<Modal.Footer>
				<Button
					color='#fff'
					backgroundColor='#fb7185'
					mr={2}
					onPress={() => deactivateChat()}
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

export default CloseChat;