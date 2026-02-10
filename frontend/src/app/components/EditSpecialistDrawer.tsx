"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  X, ChevronDown, Check, UserPlus, Building2, FileText, Zap, 
  MapPin, CalendarCheck, Award, Truck, Headset 
} from "lucide-react";

interface EditSpecialistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
  onConfirm: (data: any) => void;
}


const RICH_SUGGESTIONS = [
  {
    id: "sec_sub",
    title: "Company Secretary Subscription",
    desc: "Enjoy 1 month free Company Secretary Subscription",
    icon: <UserPlus size={18} />
  },
  {
    id: "bank_acct",
    title: "Opening of a Bank Account",
    desc: "Complimentary Corporate Bank Account Opening",
    icon: <Building2 size={18} />
  },
  {
    id: "ssm_forms",
    title: "Access Company Records and SSM Forms",
    desc: "24/7 Secure Access to Statutory Company Records",
    icon: <FileText size={18} />
  },
  {
    id: "prio_filing",
    title: "Priority Filing",
    desc: "Documents are prioritized for submission and swift processing - within 24 hours",
    icon: <Zap size={18} />
  },
  {
    id: "reg_office",
    title: "Registered Office Address Use",
    desc: "Use of SSM-Compliant Registered Office Address with Optional Mail Forwarding",
    icon: <MapPin size={18} />
  },
  {
    id: "comp_cal",
    title: "Compliance Calendar Setup",
    desc: "Get automated reminders for all statutory deadlines",
    icon: <CalendarCheck size={18} />
  },
  {
    id: "share_cert",
    title: "First Share Certificate Issued Free",
    desc: "Receive your company's first official share certificate at no cost",
    icon: <Award size={18} />
  },
  {
    id: "courier",
    title: "CTC Delivery & Courier Handling",
    desc: "Have your company documents and certified copies delivered securely to you",
    icon: <Truck size={18} />
  },
  {
    id: "chat",
    title: "Chat Support",
    desc: "Always-On Chat Support for Compliance, Filing, and General Queries",
    icon: <Headset size={18} />
  }
];

const EditSpecialistDrawer: React.FC<EditSpecialistDrawerProps> = ({ isOpen, onClose, initialData, onConfirm }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration_days: 1,
    base_price: 0,
    offerings: [] as string[]
  });
  
  const [offeringInput, setOfferingInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        duration_days: initialData.duration_days || 1,
        base_price: Number(initialData.base_price) || 0,
        offerings: initialData.offerings || []
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
      
      <div className="relative w-full max-w-[500px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-[18px] font-bold text-[#222222]">Edit Service</h2>
          <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-7">

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#222222]">Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 text-[13px] text-[#222222] focus:outline-none focus:border-[#003371] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#222222]">Description</label>
            <div className="relative">
              <textarea 
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 text-[13px] text-[#222222] focus:outline-none focus:border-[#003371] transition-all resize-none pb-6"
              />
              <span className="absolute bottom-2 right-3 text-[10px] font-bold text-gray-400">(500 words)</span>
            </div>
          </div>


          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#222222]">Estimated Completion Time (Days)</label>
            <input 
              type="number"
              value={formData.duration_days}
              onChange={(e) => setFormData({...formData, duration_days: Number(e.target.value)})}
              className="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 text-[13px] text-[#222222] focus:outline-none focus:border-[#003371]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#222222]">Price</label>
            <div className="flex items-center w-full border border-gray-300 rounded-[4px] overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F9FAFB] border-r border-gray-300 min-w-[80px]">
                 <div className="w-5 h-3 bg-[#010066] relative border border-gray-200 shadow-sm">
                    <div className="absolute top-0 right-0 h-[2px] w-full bg-[#CC0001] z-10"></div>
                    <div className="absolute top-[4px] right-0 h-[2px] w-full bg-[#CC0001] z-10"></div>
                    <div className="absolute bottom-0 right-0 h-[2px] w-full bg-white z-0"></div>
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
                placeholder="Select offerings..."
                className="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 text-[13px] text-[#222222] focus:outline-none focus:border-[#003371] pr-8"
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
                        <p className="text-[13px] font-bold text-[#222222] leading-tight mb-0.5">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-[12px] text-gray-400 italic">
                    Press Enter to add custom offering "{offeringInput}"
                  </div>
                )}
              </div>
            )}
            

            <div className="flex flex-col gap-2 mt-2">
              {formData.offerings.map((offer, index) => (
                <div key={index} className="flex justify-between items-center bg-[#F3F4F6] px-3 py-2 rounded-[4px] border border-gray-200">
                  <span className="text-[12px] font-bold text-[#4B5563]">{offer}</span>
                  <button 
                    onClick={() => removeOffering(index)}
                    className="hover:bg-gray-300 rounded-full p-1 transition-colors text-gray-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 flex gap-4 mt-auto">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-[4px] text-[13px] font-bold text-[#EF4444] hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(formData)}
            className="flex-1 py-2.5 bg-[#003371] text-white rounded-[4px] text-[13px] font-bold hover:bg-[#002855] transition-colors shadow-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSpecialistDrawer;