export default function VideoCallOverlay({
    callStatus,
    onAccept,
    onReject
  }) {
    if (callStatus !== "receiving") return null;
  
    return (
      <div className="fixed inset-0 bg-slate-900/95 z-[500] flex flex-col items-center justify-center text-white gap-6">
        <div className="animate-pulse text-7xl text-green-400">
          📞
        </div>
  
        <h2 className="text-2xl font-bold">
          Входящий видеозвонок...
        </h2>
  
        <div className="flex gap-4">
          <button
            onClick={onAccept}
            className="px-8 py-3 bg-green-500 rounded-xl font-bold"
          >
            Принять
          </button>
  
          <button
            onClick={onReject}
            className="px-8 py-3 bg-red-500 rounded-xl font-bold"
          >
            Сбросить
          </button>
        </div>
      </div>
    );
  }