export default function ChatInput({
    input,
    setInput,
    onSend
  }) {
    return (
      <div className="p-2 sm:p-3 border-t flex gap-2 w-full box-border">
        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={(e)=>e.key === "Enter" && onSend()}
          className="flex-1 border rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-sm sm:text-base outline-none min-w-0"
        />
  
        <button
          onClick={onSend}
          className="bg-green-500 text-white px-3 sm:px-4 rounded-lg flex items-center justify-center shrink-0 active:scale-95 transition-transform"
        >
          ➤
        </button>
      </div>
    );
  }
