export default function ChatInput({
    input,
    setInput,
    onSend
  }) {
    return (
      <div className="p-3 border-t flex gap-2">
        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={(e)=>e.key === "Enter" && onSend()}
          className="flex-1 border rounded-lg px-3 py-2"
        />
  
        <button
          onClick={onSend}
          className="bg-green-500 text-white px-4 rounded-lg"
        >
          ➤
        </button>
      </div>
    );
  }