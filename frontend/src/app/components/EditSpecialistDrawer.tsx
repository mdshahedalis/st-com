"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { 
  X, ChevronDown, UserPlus, Building2, FileText, Zap, 
  MapPin, CalendarCheck, Award, Truck, Headset, 
  CloudUpload, Trash2, Loader2, AlertCircle, CheckCircle
} from "lucide-react";

interface EditSpecialistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
  onConfirm: (data: any) => void;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const UPLOAD_API =`${baseUrl}/images/upload`; 

const RICH_SUGGESTIONS = [
  { id: "sec_sub", title: "Company Secretary Subscription", desc: "Enjoy 1 month free Company Secretary Subscription", icon: <UserPlus size={18} /> },
  { id: "bank_acct", title: "Opening of a Bank Account", desc: "Complimentary Corporate Bank Account Opening", icon: <Building2 size={18} /> },
  { id: "ssm_forms", title: "Access Company Records and SSM Forms", desc: "24/7 Secure Access to Statutory Company Records", icon: <FileText size={18} /> },
  { id: "prio_filing", title: "Priority Filing", desc: "Documents are prioritized for submission and swift processing", icon: <Zap size={18} /> },
  { id: "reg_office", title: "Registered Office Address Use", desc: "Use of SSM-Compliant Registered Office Address", icon: <MapPin size={18} /> },
  { id: "comp_cal", title: "Compliance Calendar Setup", desc: "Get automated reminders for all statutory deadlines", icon: <CalendarCheck size={18} /> },
  { id: "share_cert", title: "First Share Certificate Issued Free", desc: "Receive your company's first official share certificate", icon: <Award size={18} /> },
  { id: "courier", title: "CTC Delivery & Courier Handling", desc: "Certified copies delivered securely to you", icon: <Truck size={18} /> },
  { id: "chat", title: "Chat Support", desc: "Always-On Chat Support", icon: <Headset size={18} /> }
];

const EditSpecialistDrawer: React.FC<EditSpecialistDrawerProps> = ({ isOpen, onClose, initialData, onConfirm }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_days: "1", 
    base_price: 0,
    offerings: [] as string[],
    cover_image: "",
    gallery_image_1: "",
    gallery_image_2: "",
  });
  
  const [offeringInput, setOfferingInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  
  // Error & Success Message State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        duration_days: String(initialData.duration_days || "1"),
        base_price: Number(initialData.base_price) || 0,
        offerings: initialData.offerings || [],
        cover_image: initialData.cover_image || "",
        gallery_image_1: initialData.gallery_image_1 || "",
        gallery_image_2: initialData.gallery_image_2 || "",
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // --- Upload Logic (With Error Handling) ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset messages
    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadingSlot(fieldName);

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("fieldName", fieldName);
    
    const specId = initialData?.id;
    if (specId && typeof specId === 'string' && specId !== 'null' && specId !== 'undefined') {
        uploadData.append("specialistId", specId);
    }

    try {
      const res = await axios.post(UPLOAD_API, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData(prev => ({ ...prev, [fieldName]: res.data.fileUrl }));
      setSuccessMessage("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload failed", error);
      const msg = error.response?.data?.message || "Failed to upload image. Please try again.";
      setErrorMessage(msg);
    } finally {
      setUploadingSlot(null);
    }
  };

  const removeImage = (fieldName: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: "" }));
  };

  // --- Offering Logic ---
  const addOffering = (offeringTitle: string) => {
    if (offeringTitle.trim() && !formData.offerings.includes(offeringTitle.trim())) {
      setFormData(prev => ({
        ...prev,
        offerings: [...prev.offerings, offeringTitle.trim()]
      }));
    }
    setOfferingInput("");
    setShowSuggestions(false);
  };

  const removeOffering = (index: number) => {
    const newOfferings = [...formData.offerings];
    newOfferings.splice(index, 1);
    setFormData({ ...formData, offerings: newOfferings });
  };

  const availableSuggestions = RICH_SUGGESTIONS.filter(item => 
    !formData.offerings.includes(item.title) &&
    item.title.toLowerCase().includes(offeringInput.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex justify-end font-sans">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-[650px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 relative">
          <h2 className="text-[18px] font-bold text-[#222222]">Edit Service Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* NOTIFICATION BANNER */}
        <div className="absolute top-[80px] left-0 right-0 px-8 z-10 pointer-events-none">
          {errorMessage && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg shadow-sm mb-4 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle size={18} />
              <span className="text-[13px] font-medium">{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-lg shadow-sm mb-4 animate-in slide-in-from-top-2 duration-300">
              <CheckCircle size={18} />
              <span className="text-[13px] font-medium">{successMessage}</span>
            </div>
          )}
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-24">

          {/* Title */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#222222]">Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter your service title"
              className="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 text-[13px] text-[#222222] focus:outline-none focus:border-[#003371] transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Price & Duration Grid */}
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#222222]">Price</label>
                <div className="flex items-center w-full border border-gray-300 rounded-[4px] overflow-hidden">
                  <div className="px-3 bg-gray-50 border-r border-gray-300 h-full flex items-center gap-2">
                    <div className="w-5 h-3 relative shadow-sm border border-gray-200">
                        <div className="absolute inset-0 bg-[#000066]" />
                        <div className="absolute top-0 right-0 h-[2px] w-3/4 bg-[#CC0000]" />
                        <div className="absolute top-[4px] right-0 h-[2px] w-3/4 bg-[#CC0000]" />
                        <div className="absolute bottom-0 right-0 h-[2px] w-3/4 bg-white" />
                    </div>
                    <span className="text-[12px] font-bold text-[#222222]">MYR</span>
                  </div>
                  <input 
                    type="number"
                    value={formData.base_price === 0 ? "" : formData.base_price}
                    onChange={(e) => setFormData({...formData, base_price: Number(e.target.value)})}
                    placeholder="0.00"
                    className="flex-1 px-3 py-2.5 text-[13px] text-[#222222] focus:outline-none"
                  />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#222222]">Estimated Completion Time</label>
                <div className="relative">
                  <select 
                    value={formData.duration_days}
                    onChange={(e) => setFormData({...formData, duration_days: e.target.value})}
                    className="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 text-[13px] text-[#222222] focus:outline-none focus:border-[#003371] appearance-none bg-white cursor-pointer"
                  >
                    <option value="1">1 day</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                    <option value="4">4 days</option>
                    <option value="5">5 days</option>
                    <option value="6">6 days</option>
                    <option value="7">1 Week</option>
                    <option value="14">2 Weeks</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
             </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#222222]">Description</label>
            <div className="relative">
              <textarea 
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe your service here"
                className="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 text-[13px] text-[#222222] focus:outline-none focus:border-[#003371] transition-all resize-none pb-6 placeholder:text-gray-400"
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-gray-400 font-medium">(500 words)</span>
            </div>
          </div>

          {/* --- Image Upload Section --- */}
          <div>
             <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Service - Image (1st)", field: "cover_image" },
                  { label: "Service - Image (2nd)", field: "gallery_image_1" },
                  { label: "Service - Image (3rd)", field: "gallery_image_2" }
                ].map((slot) => {
                   const imageUrl = (formData as any)[slot.field];
                   const isUploading = uploadingSlot === slot.field;

                   return (
                     <div key={slot.field} className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <label className="text-[13px] font-bold text-[#222222]">{slot.label}</label>
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 rounded">Max 1</span>
                        </div>
                        
                        {imageUrl ? (
                          // File Card State
                          <div className="bg-white border border-gray-200 rounded-[6px] p-2 flex items-center gap-3 shadow-sm">
                             <div className="w-10 h-10 rounded bg-gray-100 relative overflow-hidden shrink-0 border border-gray-100">
                                <Image src={imageUrl} alt="preview" fill className="object-cover" />
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-bold text-[#222222] truncate">uploaded_file</p>
                                <p className="text-[10px] text-gray-500 uppercase">PNG • 2MB</p>
                             </div>
                             <button 
                               onClick={() => removeImage(slot.field)}
                               className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                             >
                               <Trash2 size={14} />
                             </button>
                          </div>
                        ) : (
                          // Empty Upload State
                          <label className={`
                            group relative block w-full border-2 border-dashed border-gray-300 rounded-[6px] 
                            bg-white hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer
                            ${isUploading ? "opacity-60 pointer-events-none" : ""}
                          `}>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/png, image/jpeg, image/webp"
                              onChange={(e) => handleFileUpload(e, slot.field)}
                            />
                            
                            <div className="flex flex-col items-center justify-center py-6 px-2 text-center">
                               {isUploading ? (
                                  <Loader2 className="animate-spin text-[#003371]" size={24} />
                               ) : (
                                  <>
                                    <div className="mb-2 text-[#003371]">
                                        <CloudUpload size={24} />
                                    </div>
                                    <span className="bg-[#003371] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-1 group-hover:bg-[#002855]">
                                        Browse
                                    </span>
                                    <p className="text-[9px] text-gray-400 mt-1">or Drag a file to upload</p>
                                  </>
                               )}
                            </div>
                          </label>
                        )}
                        
                        {!imageUrl && (
                            <div className="flex justify-between text-[8px] text-gray-400 px-1">
                                <span>JPG, PNG, WEBP</span>
                                <span>Max 4MB</span>
                            </div>
                        )}
                     </div>
                   );
                })}
             </div>
          </div>

          {/* Offerings */}
          <div className="space-y-3 relative" ref={dropdownRef}>
            <label className="text-[13px] font-bold text-[#222222]">Additional Offerings</label>
            
            <div className="relative">
              <input 
                type="text"
                value={offeringInput}
                onChange={(e) => {
                  setOfferingInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOffering(offeringInput))}
                placeholder="Select or type offerings..."
                className="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 text-[13px] text-[#222222] focus:outline-none focus:border-[#003371] pr-8 placeholder:text-gray-400"
              />
              <ChevronDown 
                size={16} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowSuggestions(!showSuggestions)}
              />
            </div>

            {showSuggestions && (
              <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-[4px] shadow-xl mt-1 max-h-60 overflow-y-auto">
                {availableSuggestions.length > 0 ? (
                  availableSuggestions.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => addOffering(item.title)}
                      className="px-4 py-3 hover:bg-[#F3F4F6] cursor-pointer border-b border-gray-50 last:border-0 flex items-start gap-3 group transition-colors"
                    >
                      <div className="mt-0.5 text-gray-500 group-hover:text-[#003371]">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#222222] leading-tight mb-0.5">{item.title}</p>
                        <p className="text-[11px] text-gray-500 leading-tight">{item.desc}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div 
                    onClick={() => addOffering(offeringInput)}
                    className="px-4 py-3 text-[12px] text-gray-500 italic cursor-pointer hover:bg-gray-50"
                  >
                    Add custom: <span className="font-bold">"{offeringInput}"</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.offerings.map((offer, index) => (
                <div key={index} className="flex items-center gap-2 bg-[#F3F4F6] px-3 py-1.5 rounded-full border border-gray-200">
                  <span className="text-[11px] font-bold text-[#4B5563]">{offer}</span>
                  <button 
                    onClick={() => removeOffering(index)}
                    className="hover:bg-gray-300 rounded-full p-0.5 transition-colors text-gray-400 hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex gap-4 bg-white mt-auto sticky bottom-0">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-[6px] text-[13px] font-bold text-[#4B5563] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(formData)}
            className="flex-1 py-2.5 bg-[#003371] text-white rounded-[6px] text-[13px] font-bold hover:bg-[#002855] transition-colors shadow-lg shadow-blue-900/10"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSpecialistDrawer;