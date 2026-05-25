export default function MessageBubble({ msg }) {
	const isUser = msg.from === "user";

	return (
		<div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
			<div
				className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
					isUser
						? "bg-pistachio-light text-white"
						: "bg-gray-100 text-gray-800"
				}`}
			>
				<p>{msg.text}</p>
				<p className="text-[10px] opacity-70 mt-1 text-right">
					{msg.time}
				</p>
			</div>
		</div>
	);
}