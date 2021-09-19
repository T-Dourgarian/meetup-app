import { ADD_MESSAGE, SET_CHATS, ADD_CHAT_TO_DELETE, TOGGLE_DELETE_MODE, REMOVE_CHAT_TO_DELETE, DELETE_CHAT} from "./types";


export const addMessage = (message) => ({
	type: ADD_MESSAGE,
	data: message
});


export const setChats = (chats) => ({
	type: SET_CHATS,
	data: chats
});

export const addChatToDelete = (uuid) => ({
	type: ADD_CHAT_TO_DELETE,
	data: uuid
});

export const toggleDeleteMode = (bool) => ({
	type: TOGGLE_DELETE_MODE,
	data: bool
});

export const removeChatToDelete = (uuid) => ({
	type: REMOVE_CHAT_TO_DELETE,
	data: uuid
})

export const deleteChatsAction = (array) => ({
	type: DELETE_CHAT,
	data: array
})