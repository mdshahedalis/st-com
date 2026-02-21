import React from "react";
import { AlertTriangle } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 max-w-[400px] w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-center mb-4">
           <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
             <AlertTriangle size={24} strokeWidth={2.5} />
           </div>
        </div>
        <h2 className="text-[18px] font-bold text-[#222222] mb-2">Delete Specialist</h2>
        <p className="text-[13px] text-gray-500 mb-8 leading-relaxed">
         Are you sure you want to delete this specialist? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-[6px] text-[13px] font-bold text-[#222222] hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 rounded-[6px] text-[13px] font-bold text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}