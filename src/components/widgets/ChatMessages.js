import { useState } from "react";

export default function ChatMessages({
  messages,
  userId,
  onEdit,
  onDelete
}) {
  const [editingId, setEditingId] = useState(null);
  const [text, setText] = useState("");

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 flex flex-col gap-2 w-full box-border">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2.5 sm:p-3 break-words ${
            msg.sender_id === userId
              ? "bg-green-100 self-end"
              : "bg-gray-100 self-start"
          }`}
        >
          {editingId === msg.id ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                value={text}
                onChange={(e)=>setText(e.target.value)}
                className="border px-2 py-1 rounded text-sm flex-1 min-w-0 bg-white"
              />
              <button
                className="bg-green-500 text-white px-2 py-1 rounded text-xs self-end sm:self-auto"
                onClick={()=>{
                  onEdit(msg.id,text);
                  setEditingId(null);
                }}
              >
                save
              </button>
            </div>
          ) : (
            <>
              <div className="text-sm sm:text-base whitespace-pre-wrap">{msg.text}</div>

              {msg.sender_id === userId && (
                <div className="text-[11px] sm:text-xs flex gap-3 mt-1 text-gray-500 font-medium">
                  <button
                    className="hover:underline active:text-gray-700"
                    onClick={()=>{
                      setEditingId(msg.id);
                      setText(msg.text);
                    }}
                  >
                    edit
                  </button>
                  <button
                    className="hover:underline text-red-500 active:text-red-700"
                    onClick={()=>onDelete(msg.id)}
                  >
                    delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
