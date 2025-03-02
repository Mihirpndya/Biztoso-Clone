import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageWS, connectWebSocket } from "../utils/websocket";
import { sendMessage } from "../features/chatSlice";

export default function Chat() {
	const dispatch = useDispatch();
	const messages = useSelector((state) => state.chat.messages);
	const [text, setText] = useState("");

	useEffect(() => {
		connectWebSocket();
	}, []);

	const handleSend = () => {
		const message = { text, sender: "User", timestamp: Date.now() };
		sendMessageWS(message);
		dispatch(sendMessage(message));
		setText("");
	};

	return (
		<div className="p-4 max-w-lg mx-auto">
			<h2 className="text-xl font-bold mb-4">Live Chat</h2>
			<div className="border p-4 h-64 overflow-y-auto">
				{messages.map((msg, index) => (
					<p key={index} className="mb-2">
						<strong>{msg.sender}:</strong> {msg.text}
					</p>
				))}
			</div>
			<div className="mt-4 flex">
				<input
					type="text"
					className="border flex-1 p-2 rounded-md"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<button
					onClick={handleSend}
					className="ml-2 bg-blue-500 text-white p-2 rounded-md"
				>
					Send
				</button>
			</div>
		</div>
	);
}
