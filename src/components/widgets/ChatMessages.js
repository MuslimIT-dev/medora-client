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
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`max-w-[70%] rounded-lg p-3 ${
            msg.sender_id === userId
              ? "bg-green-100 self-end"
              : "bg-gray-100 self-start"
          }`}
        >
          {editingId === msg.id ? (
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e)=>setText(e.target.value)}
                className="border px-2"
              />

              <button
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
              <div>{msg.text}</div>

              {msg.sender_id === userId && (
                <div className="text-xs flex gap-2 mt-1">
                  <button
                    onClick={()=>{
                      setEditingId(msg.id);
                      setText(msg.text);
                    }}
                  >
                    edit
                  </button>

                  <button
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