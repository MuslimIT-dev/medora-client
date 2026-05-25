import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchUserChats, fetchChatMessages } from "../../api/getChats.js";
import { API } from "../../constants/API.js";

import ChatItem from "../widgets/ChatItem";
import ChatMessages from "../widgets/ChatMessages";
import ChatInput from "../widgets/ChatInput";
import VideoCallPanel from "../widgets/VideoCallPanel";
import VideoCallOverlay from "../widgets/VideoCallOverlay";
import DocProtocolForm from "../widgets/DocProtocolForm";

const rtcConfig = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        },
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject"
        },
        {
            urls: "turn:openrelay.metered.ca:80?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject"
        },
        {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject"
        },
        {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject"
        }
    ]
};

export default function Chats() {
    const { user, currentRole } = useAuth();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const [callStatus, setCallStatus] = useState("idle");
    const [isCaller, setIsCaller] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);

    const ws = useRef(null);
    const pc = useRef(null);
    const localStream = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const activeChatRef = useRef(null);
    const incomingChatIdRef = useRef(null);
    const wsInitialized = useRef(false);
    const pendingCandidates = useRef([]);

    const [form, setForm] = useState({
        diseases: [],
        medications: [],
        directions: []
    });

    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    useEffect(() => {
        if (!user?.id) return;
        fetchUserChats().then(setChats);
    }, [user?.id]);

    useEffect(() => {
        if (!user?.id) return;
        if (wsInitialized.current) return;

        wsInitialized.current = true;
        const token = localStorage.getItem("token");
        const socket = new WebSocket(`wss://medora-server-production.up.railway.app/api/chats/ws?token=${token}`);
        ws.current = socket;

        socket.onmessage = async (event) => {
            const incoming = JSON.parse(event.data);

            switch (incoming.action) {
                case "call_start":
                    incomingChatIdRef.current = Number(incoming.chat_id);
                    setCallStatus("receiving");
                    break;

                case "call_accept":
                    setCallStatus("connected");
                    if (currentRole?.toLowerCase() === "doctor") {
                        setIsFormOpen(true);
                    }
                    break;

                case "call_end":
                case "call_reject":
                    closeVideoCall();
                    break;

                case "webrtc_signal":
                    await handleSignalingData(incoming);
                    break;

                case "send":
                    if (activeChatRef.current?.id === incoming.chat_id) {
                        setMessages((prev) => [
                            ...prev,
                            { id: Date.now(), sender_id: incoming.sender_id, text: incoming.content }
                        ]);
                    }
                    break;

                case "edit":
                    if (activeChatRef.current?.id === incoming.chat_id) {
                        setMessages((prev) =>
                            prev.map((m) => m.id === incoming.message_id ? { ...m, text: incoming.content } : m)
                        );
                    }
                    break;

                case "delete":
                    if (activeChatRef.current?.id === incoming.chat_id) {
                        setMessages((prev) => prev.filter((m) => m.id !== incoming.message_id));
                    }
                    break;

                default:
                    break;
            }
        };

        return () => {
            socket.close();
            wsInitialized.current = false;
        };
    }, [user?.id, currentRole]);

    useEffect(() => {
        if (!activeChat?.id) return;
        fetchChatMessages(activeChat.id).then((dbMessages) => {
            setMessages(
                dbMessages.map((m) => ({ id: m.id, sender_id: m.sender_id, text: m.content }))
            );
        });
    }, [activeChat?.id]);

    const safeSend = (payload) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(payload));
        }
    };

    const handleSendMessage = () => {
        if (!input.trim() || !activeChat) return;
        const tempMsg = { id: Date.now(), sender_id: user.id, text: input.trim() };
        setMessages((prev) => [...prev, tempMsg]);
        safeSend({ action: "send", chat_id: activeChat.id, content: input.trim(), sender_id: user.id });
        setInput("");
    };

    const handleEditMessage = (messageId, newText) => {
        if (!activeChat) return;
        safeSend({ action: "edit", chat_id: activeChat.id, message_id: messageId, content: newText });
        setMessages((prev) => prev.map((m) => m.id === messageId ? { ...m, text: newText } : m));
    };

    const handleDeleteMessage = (messageId) => {
        if (!activeChat) return;
        safeSend({ action: "delete", chat_id: activeChat.id, message_id: messageId });
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
    };

    const sendControlCommand = async (action) => {
        const chatId = activeChat?.id || incomingChatIdRef.current;
        if (!chatId) return;

        if (action === "call_accept") {
            try {
                localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (localVideoRef.current) localVideoRef.current.srcObject = localStream.current;
            } catch (e) {
                alert("Ошибка доступа к медиа-устройствам");
                return;
            }
        }

        safeSend({ action, chat_id: Number(chatId) });

        if (action === "call_start") {
            setIsCaller(true);
            setCallStatus("calling");
            if (currentRole?.toLowerCase() === "doctor") setIsFormOpen(true);
        }

        if (action === "call_accept") {
            setIsCaller(false);
            setCallStatus("connected");
            setActiveChat({ id: Number(chatId), name: "Пациент (Онлайн-консультация)" });
        }

        if (action === "call_end" || action === "call_reject") {
            closeVideoCall();
        }
    };

    const closeVideoCall = () => {
        setCallStatus("idle");
        setIsCaller(false);
        setIsFormOpen(false);
        setIsAudioMuted(false);
        setIsVideoMuted(false);

        if (localStream.current) {
            localStream.current.getTracks().forEach((t) => t.stop());
            localStream.current = null;
        }
        if (pc.current) {
            pc.current.close();
            pc.current = null;
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    };

    const toggleAudio = () => {
        localStream.current?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
        setIsAudioMuted((prev) => !prev);
    };

    const toggleVideo = () => {
        localStream.current?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
        setIsVideoMuted((prev) => !prev);
    };

    const createPeerConnection = (targetChatId) => {
        if (pc.current) return;

        console.log("WebRTC: Создание PeerConnection для комнаты:", targetChatId);
        pc.current = new RTCPeerConnection(rtcConfig);

        if (localStream.current) {
            localStream.current.getTracks().forEach((track) =>
                pc.current.addTrack(track, localStream.current)
            );
        }

        pc.current.ontrack = (event) => {
            console.log("WebRTC SUCCESS: Получен видеопоток от собеседника!", event.streams);
            if (remoteVideoRef.current && event.streams && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];

                remoteVideoRef.current.play().catch(err => {
                    console.warn("Браузер заблокировал автоплей видео, пробуем повторно:", err);
                });
            }
        };

        pc.current.onicecandidate = (event) => {
            if (event.candidate && targetChatId) {
                console.log("WebRTC: Отправка ICE-кандидата...");
                safeSend({
                    action: "webrtc_signal",
                    chat_id: Number(targetChatId),
                    content: "candidate",
                    sdp: JSON.stringify(event.candidate)
                });
            }
        };

        pc.current.oniceconnectionstatechange =
            () => {
                console.log(
                    "ICE:",
                    pc.current
                        .iceConnectionState
                );
            };

        pc.current.onconnectionstatechange =
            () => {
                console.log(
                    "PC:",
                    pc.current
                        .connectionState
                );
            };
    };

    const startWebRTC = async (caller) => {
        try {
            const targetId = activeChatRef.current ? activeChatRef.current.id : incomingChatIdRef.current;
            if (!targetId) return;

            if (!localStream.current) {
                localStream.current = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
            }

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream.current;
                localVideoRef.current.play().catch(() => { });
            }

            createPeerConnection(targetId);

            if (caller && pc.current) {
                console.log("WebRTC: Генерация Offer...");
                const offer = await pc.current.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true
                });
                await pc.current.setLocalDescription(offer);

                safeSend({
                    action: "webrtc_signal",
                    chat_id: Number(targetId),
                    content: "offer",
                    sdp: JSON.stringify(offer)
                });
            }
        } catch (e) {
            console.error("Ошибка старта WebRTC:", e);
        }
    };

    const handleSignalingData = async (data) => {
        try {
            if (!data.sdp) return;
            const sdpObj = JSON.parse(data.sdp);
            const targetId = activeChatRef.current ? activeChatRef.current.id : incomingChatIdRef.current;

            if (data.content === "offer") {
                console.log("WebRTC: Пациент обрабатывает входящий Offer...");
                if (!localStream.current) {
                    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                }
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = localStream.current;
                }

                createPeerConnection(targetId);

                await pc.current.setRemoteDescription(
                    new RTCSessionDescription(
                        sdpObj
                    )
                );

                for (const c of pendingCandidates.current) {
                    await pc.current.addIceCandidate(
                        c
                    );
                }
                pendingCandidates.current = [];
                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);

                safeSend({
                    action: "webrtc_signal",
                    chat_id: Number(targetId),
                    content: "answer",
                    sdp: JSON.stringify(answer)
                });
                console.log("WebRTC: Answer отправлен врачу.");

            } else if (data.content === "answer") {
                console.log("WebRTC: Врач зафиксировал Answer.");
                if (pc.current) {
                    await pc.current.setRemoteDescription(new RTCSessionDescription(sdpObj));
                }
            } else if (data.content === "candidate") {
                const candidate =
                    new RTCIceCandidate(sdpObj);

                if (
                    pc.current &&
                    pc.current.remoteDescription &&
                    pc.current.remoteDescription.type
                ) {
                    await pc.current.addIceCandidate(
                        candidate
                    );
                } else {
                    pendingCandidates.current.push(
                        candidate
                    );
                }
            }
        } catch (e) {
            console.error("Ошибка сигналинга:", e);
        }
    };


    const handleCompleteVisit = async (e) => {
        e.preventDefault();
        const aptId = activeChat?.appointment_id || activeChat?.id;
        if (!aptId) return alert("Активный прием не найден");

        try {
            const res = await fetch(`${API}/cabinet/doctor/appointments/${aptId}/complete`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, diseases: form.diseases.map(d => d.id) })
            });
            if (res.ok) {
                alert("Прием успешно зафиксирован!");
                sendControlCommand("call_end");
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        if (callStatus === "connected") {
            const targetChatId = activeChatRef.current ? activeChatRef.current.id : incomingChatIdRef.current;
            setTimeout(() => {
                startWebRTC(isCaller, targetChatId);
            }, 100);
        }
    }, [callStatus, isCaller]);

    return (
        <div className="h-[85vh] flex gap-4 p-2 relative overflow-hidden text-sm">
            <VideoCallOverlay
                callStatus={callStatus}
                onAccept={() => sendControlCommand("call_accept")}
                onReject={() => sendControlCommand("call_reject")}
            />

            <div className="w-1/3 bg-white rounded-xl p-3 shadow overflow-y-auto flex flex-col gap-2">
                <h2 className="font-bold mb-1 text-base text-gray-700">💬 Чаты</h2>
                {chats.map((chat) => (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                        active={activeChat?.id === chat.id}
                        onClick={setActiveChat}
                    />
                ))}
            </div>

            <div className="flex-1 bg-white rounded-xl shadow flex flex-col overflow-hidden relative">
                {activeChat ? (
                    <>
                        <div className="p-4 border-b flex justify-between bg-gray-50/50 items-center font-semibold">
                            <span>👨‍⚕️ {activeChat.name}</span>
                            {callStatus === "idle" && (
                                <button
                                    onClick={() => sendControlCommand("call_start")}
                                    className="p-2 bg-pistachio-light/10 text-pistachio-dark rounded-xl font-bold hover:bg-pistachio-light hover:text-white transition shadow-sm text-xs"
                                >
                                    📞 Видеоконсультация
                                </button>
                            )}
                            {callStatus === "calling" && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-amber-500 font-bold animate-pulse">Идет вызов...</span>
                                    <button onClick={() => sendControlCommand("call_end")} className="px-2 py-1 bg-red-500 text-white font-bold text-xs rounded-lg">Отмена X</button>
                                </div>
                            )}
                        </div>

                        <VideoCallPanel
                            callStatus={callStatus}
                            localVideoRef={localVideoRef}
                            remoteVideoRef={remoteVideoRef}
                            isAudioMuted={isAudioMuted}
                            isVideoMuted={isVideoMuted}
                            onToggleAudio={toggleAudio}
                            onToggleVideo={toggleVideo}
                            onEndCall={() => sendControlCommand("call_end")}
                        />

                        <ChatMessages
                            messages={messages}
                            userId={user.id}
                            onEdit={handleEditMessage}
                            onDelete={handleDeleteMessage}
                        />

                        <ChatInput
                            input={input}
                            setInput={setInput}
                            onSend={handleSendMessage}
                        />
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 font-medium">
                        Выберите чат для начала общения
                    </div>
                )}
            </div>

            {isFormOpen && currentRole?.toLowerCase() === "doctor" && (
                <DocProtocolForm
                    form={form}
                    setForm={setForm}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleCompleteVisit}
                />
            )}
        </div>
    );
}
