"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { CloudUpload, Trash2, FileImage } from "lucide-react";

interface ImageUploadBoxProps {
  label: string;
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
}

const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({ label, imagePreview, onImageSelect, onImageRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[13px] font-bold text-[#222222]">{label}</label>
      
      {/* Container */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white transition-colors hover:border-[#003371] group relative">
        
        {imagePreview ? (
          // --- FILLED STATE (Matches Image 01cf1b) ---
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
               {/* Use actual preview or fallback icon */}
               {imagePreview.startsWith("blob") || imagePreview.startsWith("http") ? (
                 <Image src={imagePreview} alt="Preview" fill className="object-cover" />
               ) : (
                 <div className="flex items-center justify-center h-full"><FileImage className="text-gray-400" /></div>
               )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#222222] truncate">service-image.png</p>
              <div className="flex gap-2 text-[10px] text-gray-400">
                <span>Size: 2.4 MB</span>
                <span>Type: PNG</span>
              </div>
            </div>

            <button 
              onClick={onImageRemove}
              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          // --- EMPTY STATE (Matches Image 01cf1b) ---
          <div className="flex flex-col items-center justify-center text-center py-4">
            <div className="mb-3 p-3 bg-blue-50 rounded-full text-[#003371]">
              <CloudUpload size={24} />
            </div>
            
            <div className="mb-3">
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="bg-[#003371] text-white text-[11px] font-bold px-4 py-1.5 rounded-full hover:bg-[#002855] transition-colors"
               >
                 Browse
               </button>
               <span className="text-[11px] text-gray-400 ml-2">or Drag a file to upload</span>
            </div>

            <p className="text-[10px] text-gray-400">
              Accepted formats: JPG, JPEG, PNG or WEBP <br/> Maximum file size: 4MB
            </p>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploadBox;