import React from "react";

export default function VideoCallPanel({
    callStatus,
    localVideoRef,
    remoteVideoRef,
    isAudioMuted,
    isVideoMuted,
    onToggleAudio,
    onToggleVideo,
    onEndCall
}) {
    if (callStatus !== "connected") return null;

    return (
        <div className="flex flex-col p-4 bg-slate-900 gap-3 shrink-0 border-b">
            
            {/* VIDEO WINDOWS */}
            <div className="grid grid-cols-2 gap-2 h-56 relative">
                
                {/* REMOTE */}
                <div className="bg-black rounded-lg overflow-hidden relative border border-slate-700">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
                        Собеседник
                    </span>
                </div>

                {/* LOCAL */}
                <div className="bg-black rounded-lg overflow-hidden relative border border-slate-700 flex items-center justify-center">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${
                            isVideoMuted ? "hidden" : "block"
                        }`}
                    />

                    {isVideoMuted && (
                        <div className="text-slate-400 font-medium text-xs">
                            Камера выключена
                        </div>
                    )}

                    <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
                        Вы
                    </span>
                </div>
            </div>

            {/* CONTROL PANEL */}
            <div className="flex justify-center gap-4 bg-slate-800 p-2 rounded-xl border border-slate-700 w-fit mx-auto">
                
                <button
                    onClick={onToggleAudio}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                        isAudioMuted
                            ? "bg-red-500 text-white"
                            : "bg-slate-700 text-slate-200"
                    }`}
                >
                    {isAudioMuted
                        ? "🔇 Микрофон: Выкл"
                        : "🎙️ Микрофон: Вкл"}
                </button>

                <button
                    onClick={onToggleVideo}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                        isVideoMuted
                            ? "bg-red-500 text-white"
                            : "bg-slate-700 text-slate-200"
                    }`}
                >
                    {isVideoMuted
                        ? "📷 Камера: Выкл"
                        : "📹 Камера: Вкл"}
                </button>

                <button
                    onClick={onEndCall}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-xs"
                >
                    🛑 Завершить
                </button>
            </div>
        </div>
    );
}