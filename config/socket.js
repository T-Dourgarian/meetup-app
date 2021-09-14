import io from 'socket.io-client';
import env from './env';


const socket = io.connect(`${env.API_URL}:3000`);

socket.on('connect', () => {
	// console.log(socket.connected);
})

socket.on('disconnect', () => {
	// console.log(socket.connected);
})

export default socket;