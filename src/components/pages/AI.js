// export default function AI() {
// 	return (
// 		<div className="flex items-center justify-center h-full">
// 			<div className="text-center p-8 bg-white shadow-md rounded-2xl max-w-md w-full">

// 				<div className="text-5xl mb-4">{"\u{1F916}"}</div>

// 				<h1 className="text-2xl font-bold mb-2">
// 					ИИ Ассистент
// 				</h1>

// 				<p className="text-gray-500 mb-4">
// 					Эта функция скоро появится. Мы работаем над умным медицинским помощником,
// 					который поможет вам с анализами, симптомами и записью к врачу.
// 				</p>

// 				<div className="text-sm text-pistachio-light font-semibold">
// 					{"\u{1F6A7}"} Coming soon
// 				</div>

// 			</div>
// 		</div>
// 	);
// }

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../constants/API";

export default function AiAssistant() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Загружаем сохраненную историю общения с ИИ
        fetch(`${API}/ai/history`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        .then(r => r.json())
        .then(res => {
            if (res.data) setMessages(res.data);
        })
        .catch(console.error);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendPrompt = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userText }]);
        setLoading(true);

        try {
            const res = await fetch(`${API}/ai/prompt`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ message: userText })
            });
            const result = await res.json();

            if (res.ok) {
                const assistantText = `${result.analysis} Оптимальный специалист для очного или онлайн визита: ${result.recommendedSpecialty}`;
                setMessages(prev => [...prev, { 
                    role: "assistant", 
                    content: assistantText,
                    specialty: result.recommendedSpecialty 
                }]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[82vh] max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden text-sm">
            <div className="p-4 bg-gradient-to-r from-pistachio-dark to-pistachio-light text-white font-bold flex items-center gap-2 shrink-0">
                <span className="text-xl">🤖</span>
                <div>
                    <h2 className="text-sm">ИИ Медицинский Ассистент Medora</h2>
                    <p className="text-[10px] font-normal opacity-85">Опишите ваши симптомы в свободной форме</p>
                </div>
            </div>

            {/* ОКНО СООБЩЕНИЙ */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50/50">
                {messages.length === 0 && (
                    <div className="text-center py-12 text-gray-400 italic text-xs max-w-md mx-auto flex flex-col gap-2">
                        <span>👋 Здравствуйте! Я ваш цифровой ассистент.</span>
                        <span>Расскажите, что именно вас беспокоит (где болит, какие симптомы, как долго), и я помогу определить, к какому врачу нашей клиники вам лучше записаться.</span>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isUser = msg.role === "user";
                    return (
                        <div key={index} className={`max-w-[75%] rounded-2xl p-3.5 flex flex-col gap-2 shadow-sm border ${
                            isUser ? "bg-pistachio-light/10 border-pistachio-light/20 text-gray-800 self-end rounded-tr-none" : "bg-white border-gray-100 text-gray-700 self-start rounded-tl-none"
                        }`}>
                            <div className="leading-relaxed text-xs font-medium">{msg.content}</div>
                            
                            {!isUser && msg.specialty && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Перенаправляем на страницу поиска врачей, 
                                        // отфильтровав список строго по строковому названию специальности из stuff (например, Cardiologist)
                                        navigate(`/appointment/doctors?search_stuff=${msg.specialty}`);
                                    }}
                                    className="w-full mt-1.5 py-2 bg-pistachio-dark text-white font-bold rounded-xl text-[11px] hover:bg-pistachio-light transition shadow-sm"
                                >
                                    📅 Найти свободного врача ({msg.specialty}) и записаться
                                </button>
                            )}
                        </div>
                    );
                })}
                {loading && (
                    <div className="bg-white border text-gray-400 text-xs font-medium p-3 rounded-2xl rounded-tl-none w-fit shadow-sm animate-pulse">
                        🤖 ИИ анализирует симптомы по медкарте...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* ИНПУТ ОТПРАВКИ */}
            <form onSubmit={handleSendPrompt} className="p-3 border-t bg-white flex gap-2 shrink-0">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                    placeholder="Например: Болит колено при ходьбе и хрустит..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-pistachio-light text-xs bg-gray-50/30"
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-pistachio-dark text-white px-5 rounded-xl font-bold hover:bg-pistachio-light transition text-xs disabled:opacity-40"
                >
                    Отправить
                </button>
            </form>
		</div>
    );
}
