import { createStore, combineReducers} from 'redux'
import chatReducer from './reducers/chatReducer';

const rootReducer = combineReducers({
	chats: chatReducer,
})

const configureStore = () => createStore(rootReducer);

export default configureStore;