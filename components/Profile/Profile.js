import * as React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import { List, Box, Button, Input, Flex, ScrollView, Text, Image, Center, Spinner, Spacer, TextArea } from 'native-base';
import * as SecureStore from 'expo-secure-store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import env from "../../config/env";
import moment from 'moment'
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Profile = ({ navigation }) => {

	const[spinner, setSpinner] = useState(false);
	const [editMode, setEditMode] = useState(false);

	const [user, setUser] = useState({})

	const getUser = async () => {

		const token = await SecureStore.getItemAsync('accessToken');

		const uuid = await SecureStore.getItemAsync('uuid');
		try {
			const token = await SecureStore.getItemAsync('accessToken');
			const { data } = await axios.get(`${env.API_URL}:3000/api/user/${uuid}`,
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			})

			setUser(data.user);


		} catch(error) {
			console.log(error);
		}
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

	const handleProfileChange = (text, key) => {
		setUser(prevUser => ({ ...prevUser, [key]: text}));
	}	

	const saveChanges = async () => {
		try {

			const token = await SecureStore.getItemAsync('accessToken');

			await axios.put(`${env.API_URL}:3000/api/user/update`, { user },
			{
				headers: {
					authorization: `Bearer ${token}`
				}
			});

			setEditMode(false);

		} catch(error) {
			console.log(error);
		}
	}

	const handleCancel = async () => {
		await getUser();

		setEditMode(false);
	}
	

	return (
		<Box h={'100%'} backgroundColor={'#fff'}>

			{
				!editMode &&
				<Center my={3}>
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
								user.ppURL ?
								<Button
									variant='unstyled'
									onPress={() => pickImage()}
								>
									<Image 
										source={{ uri: `${env.API_URL}:3000${user.ppURL}` }} 
										width={120}
										height={120}
										borderRadius={100} 
										alt="profile picture" 
									/>
								</Button>:
								<Button
									width={120}
									height={120}
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
						fontSize={21}
					>
						{user.firstName} {user.lastName}
					</Text>

				</Center>
			}

			

			{
				!editMode ?
				<ScrollView >
					<Button
						variant='unstyled'
						w={'50%'}
						h={8}
						margin={'auto'}
						shadow={3}
						backgroundColor='#fb7185'
						onPress={() => setEditMode(true)}
					>
						<Text color='#fff'>Edit Profile</Text>
					</Button>
					<Box w='90%' margin='auto'>
						<Text
							fontSize={18}
							bold
							color='#fb7185'
						>Bio</Text>
						<Text
							mt={1}
							fontSize={16}
							color='#a8a29e'
						>{user.bio ? user.bio : ''}</Text>
					</Box>
					<Box w='90%' margin='auto' mt={1}>
						<Text
							fontSize={18}
							bold
							color='#fb7185'
						>Age</Text>
						<Text
							mt={1}
							fontSize={16}
							color='#a8a29e'
						>{user.age ? user.age : ''}</Text>
					</Box>
					<Box w='90%' margin='auto' mt={1}>
						<Text
							fontSize={18}
							bold
							color='#fb7185'
						>Gender</Text>
						<Text
							mt={1}
							fontSize={16}
							color='#a8a29e'
						>{user.gender ? user.gender : ''}</Text>
					</Box>
					<Box w='90%' margin='auto' mt={1}>
						<Text
							fontSize={18}
							bold
							color='#fb7185'
						>Occupation</Text>
						<Text
							mt={1}
							fontSize={16}
							color='#a8a29e'
						>{user.occupation ? user.occupation : ''}</Text>
					</Box>
				</ScrollView>
				:
				<ScrollView  my={4}>
					<Flex direction='row' mb={1}>
						<Button
							variant='unstyled'
							w={'40%'}
							h={8}
							margin={'auto'}
							shadow={3}
							backgroundColor='#fb7185'
							onPress={() => saveChanges()}
						>
							<Text color='#fff'>Save Changes</Text>
						</Button>

						<Button
							variant='outline'
							w={'40%'}
							h={8}
							margin={'auto'}
							shadow={3}
							backgroundColor='#fff'
							borderColor='#fb7185'
							onPress={() => handleCancel()}
						>
							<Text color='#fb7185'>Cancel</Text>
						</Button>

					</Flex>
					<Flex direction='column'>
					<Box w='90%' margin='auto'>
						<Text
							fontSize={18}
							bold
							color='#fb7185'
						>Bio</Text>
						<TextArea
							variant="outline"
							h={20}
							space={3}
							value={user.bio}
							placeholder="A little about yourself..." 
							onChangeText={(text) => handleProfileChange(text,'bio')}
							textAlignVertical='top'
							borderColor={'#fecdd3'}
							borderRadius={8}
							borderWidth={1}
							_focus={
								{
									style: {
										borderColor: '#fb7185',
									}
								}
							}
						/>
					</Box>
					<Box w='90%' margin='auto' mt={1}>
						<Text
							fontSize={18}
							bold
							color='#fb7185'
						>Age</Text>
						<Input 
							w={'100%'}
							variant="outline"
							value={user.age}
							bordered
							onChangeText={(text) => handleProfileChange(text, 'age')}
							borderRadius={8}
							borderColor={'#fecdd3'}
							borderWidth={1}
							h={10}
							mt={1}
							_focus={
								{
									style: {
										borderColor: '#fb7185',
									}
								}
							}
						/>
					</Box>
					<Box w='90%' margin='auto' mt={1}>
						<Text
							fontSize={18}
							bold
							color='#fb7185'
						>Gender</Text>
						<Input 
							h={10}
							w={'100%'}
							variant="outline"
							value={user.gender}
							bordered
							onChangeText={(text) => handleProfileChange(text, 'gender')}
							borderRadius={8}
							borderColor={'#fecdd3'}
							borderWidth={1}
							mt={1}
							_focus={
								{
									style: {
										borderColor: '#fb7185',
									}
								}
							}
						/>
					</Box>
					<Box w='90%' margin='auto' mt={1}>
						<Text
							fontSize={18}
							bold
							color='#fb7185'
						>Occupation</Text>
						<Input 
							w={'100%'}
							variant="outline"
							value={user.occupation}
							h={10}
							bordered
							onChangeText={(text) => handleProfileChange(text, 'occupation')}
							borderRadius={8}
							borderColor={'#fecdd3'}
							borderWidth={1}
							mt={1}
							_focus={
								{
									style: {
										borderColor: '#fb7185',
									}
								}
							}
						/>
					</Box>
					</Flex>
				</ScrollView>
			}

			
		</Box>
	)
}


export default Profile;