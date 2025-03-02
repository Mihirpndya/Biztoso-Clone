let socket;

export const connectWebSocket = (userId) => {
	socket = new WebSocket("ws://your-websocket-server-url");

	socket.onopen = () => console.log("Connected to WebSocket");

	socket.onmessage = (event) => {
		const message = JSON.parse(event.data);
		store.dispatch(receiveMessage(message));
	};

	socket.onclose = () => console.log("Disconnected. Trying to reconnect...");
};

export const sendMessageWS = (message) => {
	if (socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify(message));
	}
};
