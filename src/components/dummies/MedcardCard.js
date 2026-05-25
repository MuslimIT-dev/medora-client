import React from 'react';

export default function MedcardCard({ Data, isDocument = false }) {
    const handleDocumentClick = (e) => {
        e.stopPropagation();
    };

    if (isDocument) {
        const fileUrl = `http://10.192.6.193:8080${Data.description}`;
        
        return (
            <a 
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDocumentClick}
                className="block p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col gap-2 transition cursor-pointer hover:border-pistachio-light hover:shadow-md no-underline text-current select-none"
            >
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-pistachio-dark flex items-center gap-1">
                        {Data.title} <span className="text-sm">📄</span>
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                        📅 {new Date(Data.date).toLocaleDateString()}
                    </span>
                </div>
                <p className="text-gray-500 text-xs italic">
                    Нажмите, чтобы открыть в новой вкладке ({Data.description ? Data.description.split('.').pop().toUpperCase() : 'FILE'})
                </p>
            </a>
        );
    }

    return (
        <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-800">{Data.title}</h3>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    📅 {new Date(Data.date).toLocaleDateString()}
                </span>
            </div>
            <p className="text-gray-600 text-sm">{Data.description}</p>
        </div>
    );
}
