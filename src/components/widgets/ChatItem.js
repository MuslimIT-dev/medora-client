export default function ChatItem({ chat, active, onClick }) {
	return (
		<div
			onClick={() => onClick(chat)}
			className={`p-3 rounded-lg cursor-pointer transition flex justify-between items-center ${
				active ? "bg-pistachio-light text-white" : "bg-white hover:bg-gray-100"
			}`}
		>
			<div className="flex flex-col">
				<span className="font-semibold">{chat.name}</span>
				<span className={`text-xs ${active ? "text-white/80" : "text-gray-500"}`}>
					{chat.lastMessage}
				</span>
			</div>

			<div className="flex flex-col items-end text-xs">
				<span>{chat.time}</span>
				{chat.unread > 0 && (
					<span className="bg-red-500 text-white px-2 rounded-full text-[10px] mt-1">
						{chat.unread}
					</span>
				)}
			</div>
		</div>
	);
}