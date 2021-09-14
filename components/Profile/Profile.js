import * as React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, Flex, ScrollView, Text, Image, Center, Spinner } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import env from "../../config/env";
import moment from 'moment'
import * as ImagePicker from 'expo-image-picker';


const Profile = ({ navigation }) => {

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [uuid, setUuid] = useState('');
	const [ppURL, setPpUrl] = useState(null);
	const[spinner, setSpinner] = useState(false);

	const getUser = async () => {

		const token = await SecureStore.getItemAsync('accessToken');

		const tempUuid = await SecureStore.getItemAsync('uuid');
		const tempFirstName = await SecureStore.getItemAsync('firstName');
		const tempLastName = await SecureStore.getItemAsync('lastName');
		const tempPpUrl = await SecureStore.getItemAsync('ppURL');



		setUuid(tempUuid);
		setFirstName(tempFirstName);
		setLastName(tempLastName);
		setPpUrl(tempPpUrl);

	}

	useEffect( () => {

		(async () => {
			if (Platform.OS !== 'web') {
			  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
			  if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			  }
			}
		  })();

		getUser();
	}, []);

	const pickImage = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});
	
	
			if (!result.cancelled) {
	
				setSpinner(true);

				if (result.type === 'image') {
					result.type = 'image/jpg';
				}

	
				let formData = new FormData();

				formData.append("image", {
					name: new Date() + "_profile",
					uri: result.uri,
					type: 'image/jpg'
				});

				console.log('formData', formData);
	
	
				const token = await SecureStore.getItemAsync('accessToken');
	
				const { data } = await axios.put(`${env.API_URL}:3000/api/user/pp`, 
					formData,
					{
						headers: {
							'Accept': 'application/json',
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'multipart/form-data'
						}
					}
				);

				
				setSpinner(false);
				setPpUrl(data.ppURL);
				await SecureStore.setItemAsync('ppURL', data.ppURL)
	  
	  
	  
			  }
		} catch(error) {
			setSpinner(false);
			console.log(error)
		}
	}
	

	return (
		<Box h={'100%'} backgroundColor={'#fff'}>

			<Center my={4}>
				{
					spinner ?
					<Box
						width={150}
						height={150}
						borderRadius={80} 
						borderWidth={3}
						borderColor='#fb7185'
					>
						<Spinner  my='auto'
						/>
					</Box>:
					<Box>
						{
							ppURL ?
							<Button
								variant='unstyled'
								onPress={() => pickImage()}
							>
								<Image 
									source={{ uri: `${env.API_URL}:3000${ppURL}` }} 
									width={150}
									height={150}
									borderRadius={100} 
									alt="profile picture" 
								/>
							</Button>:
							<Button
								width={150}
								height={150}
								borderRadius={80} 
								borderWidth={3}
								borderColor='#fb7185'
								variant='unstyled'
								onPress={() => pickImage()}
							>
								<Text textAlign='center' my={'auto'}>Upload Profile Picture</Text>
							</Button>
						}
					</Box>
				}
				<Text
					bold
					fontSize={23}
				>
					{firstName} {lastName}
				</Text>
			</Center>

			
		</Box>
	)
}


export default Profile;