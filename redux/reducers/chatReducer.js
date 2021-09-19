import { ADD_MESSAGE, SET_CHATS, ADD_CHAT_TO_DELETE, TOGGLE_DELETE_MODE, REMOVE_CHAT_TO_DELETE, DELETE_CHAT } from '../actions/types';


const initialState = {
	chats: [],
	chatsToDelete: [],
	deleteMode: false
}


const chatReducer = (state = initialState, action) => {
	switch(action.type) {
		case SET_CHATS:
			return {
				...state,
				chats: action.data
			}
		case ADD_MESSAGE:
			const newChats = [];


			for (chat of state.chats) {
				if (action.data.chatUuid === chat.uuid) {
					let newChat = chat;

					newChat.messages.push(action.data);

					newChats.push(newChat);
				} else {
					newChats.push(chat);
				}
			}
			

			return {
				...state,
				chats: newChats
			}
		case ADD_CHAT_TO_DELETE:
			return {
				...state,
				chatsToDelete: [...state.chatsToDelete, action.data]
			}
		case DELETE_CHAT:
			let updatedChats = state.chats.filter(chat => !action.data.includes(chat.uuid));

			return {
				...state,
				chats: updatedChats
			}
		case REMOVE_CHAT_TO_DELETE:

			const newChatsTDelete = state.chatsToDelete.filter(uuid => uuid !== action.data);

			return {
				...state,
				chatsToDelete: [...newChatsTDelete]
			}
		case TOGGLE_DELETE_MODE:
			if(!action.data) {
				return {
					...state,
					chatsToDelete: [],
					deleteMode: action.data
				}
			} else {
				return {
					...state,
					deleteMode: action.data
				}
			}
		default:
			return state

	}
}
export default chatReducer