"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Upload, Info, CheckCircle } from "lucide-react";
import EditSpecialistDrawer from "@/app/components/EditSpecialistDrawer";
import PublishModal from "@/app/components/PublishModal";



const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const API_BASE =`${baseUrl}/specialists`;

export default function CreateSpecialistPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [specialistId, setSpecialistId] = useState<string | null>(null);

  // State matches your Backend Schema and Frontend Form
  const [data, setData] = useState({
    title: "Register a new company | Private Limited - Sdn Bhd",
    description: "Describe your specialist service here...",
    duration_days: 1,
    base_price: 1800,
    platform_fee: 540,
    final_price: 2340,
    offerings: ["Company Secretary Subscription"],
    is_draft: true
  });


  const handleSave = async (formData: any) => {
    try {
      let response;
      if (specialistId) {
        response = await axios.put(`${API_BASE}/${specialistId}`, formData);
      } else {
        response = await axios.post(`${API_BASE}/`, formData);
        setSpecialistId(response.data.id);
      }

    
      const resData = response.data;
      setData({
        title: resData.title,
        description: resData.description,
        duration_days: resData.duration_days,
        base_price: Number(resData.base_price),
        platform_fee: Number(resData.platform_fee),
        final_price: Number(resData.final_price),
        offerings: resData.offerings || formData.offerings,
        is_draft: resData.is_draft
      });

      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error saving specialist:", error);
      alert("Failed to save changes. Check console.");
    }
  };

  // 2. Publish (triggered by Modal Confirm)
  const handlePublish = async () => {
    if (!specialistId) {
      alert("Please create/save the specialist first.");
      setIsPublishOpen(false);
      return;
    }

    try {
      // POST /:id/publish
      await axios.post(`${API_BASE}/${specialistId}/publish`);
      setData(prev => ({ ...prev, is_draft: false }));
      setIsPublishOpen(false);
      alert("Specialist Published Successfully!");
    } catch (error) {
      console.error("Error publishing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8">
      <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto">
        
        {/* LEFT COLUMN: Service Preview */}
        <div className="flex-1 space-y-8">
          <h1 className="text-[28px] font-bold text-[#222222] leading-tight">{data.title}</h1>
          
          {/* Image Grid (Visual Mock) */}
          <div className="grid grid-cols-2 gap-4 h-[380px]">
            <div className="bg-[#E5E7EB] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-6">
              <Upload size={40} className="text-gray-400 mb-3" />
              <p className="text-[11px] text-gray-500 max-w-[150px]">Upload an image for your specialist listing in PNG, JPG or JPEG up to 4MB</p>
            </div>
            <div className="grid grid-rows-2 gap-4">
               <div className="bg-gray-200 rounded-lg relative overflow-hidden flex items-center justify-center text-gray-400 text-xs">No Image</div>
               <div className="bg-gray-200 rounded-lg relative overflow-hidden flex items-center justify-center text-gray-400 text-xs">No Image</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-[16px] font-bold text-[#222222] mb-2">Description</h3>
            <div className="pb-6 border-b border-gray-200 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {data.description}
            </div>
          </div>

          {/* Offerings */}
          <div>
            <h3 className="text-[16px] font-bold text-[#222222] mb-4">Additional Offerings</h3>
            <div className="flex flex-wrap gap-2">
              {data.offerings.map((off, i) => (
                <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-[12px] font-bold text-gray-600">
                  {off}
                </span>
              ))}
            </div>
          </div>

          {/* Company Secretary Profile (Visual Only) */}
          <div className="pt-6">
             <h3 className="text-[16px] font-bold text-[#222222] mb-4">Company Secretary</h3>
             <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden">
                 <Image src="/assets/avatar.png" width={48} height={48} alt="User" />
               </div>
               <div>
                 <div className="flex items-center gap-2">
                   <p className="text-sm font-bold">Grace Lam</p>
                   <CheckCircle size={14} className="text-emerald-500 fill-emerald-100" />
                 </div>
                 <p className="text-[11px] text-gray-500 mb-2">Corpsec Services Sdn Bhd</p>
               </div>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Fee Card */}
        <div className="w-full lg:w-[420px] shrink-0">
          <div className="flex justify-end gap-3 mb-6">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="px-8 py-2.5 bg-[#001D3D] text-white text-[13px] font-bold rounded-[6px] hover:opacity-90"
            >
              Edit
            </button>
            <button 
              onClick={() => setIsPublishOpen(true)}
              className={`px-8 py-2.5 text-white text-[13px] font-bold rounded-[6px] hover:opacity-90 ${
                data.is_draft ? "bg-[#003371]" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!data.is_draft}
            >
              {data.is_draft ? "Publish" : "Published"}
            </button>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 h-fit">
            <h2 className="text-[22px] font-bold text-[#222222] mb-1">Professional Fee</h2>
            <p className="text-[13px] text-gray-400 mb-8">Set a rate for your specialist service</p>

            <div className="text-right border-b-2 border-[#222222] pb-2 mb-8">
              <span className="text-[28px] font-bold text-[#222222]">RM {data.base_price.toLocaleString()}</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[13px] font-medium text-gray-600">
                <span>Base price</span>
                <span>RM {data.base_price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[13px] font-medium text-gray-600 border-b border-gray-100 pb-4">
                <span className="flex items-center gap-1 underline decoration-dotted decoration-gray-400">
                  Specialist processing fee <Info size={12} />
                </span>
                <span>RM {data.platform_fee.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-[16px] font-bold text-[#222222] pt-2">
                <span>Total</span>
                <span>RM {data.final_price.toLocaleString()}</span>
              </div>

              <div className="pt-6 mt-4 border-t border-gray-100">
                <div className="flex justify-between text-[14px] font-bold text-[#222222]">
                  <span>Your returns</span>
                  <span>RM {data.base_price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Components */}
      <EditSpecialistDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        initialData={data} 
        onConfirm={handleSave} 
      />
      <PublishModal 
        isOpen={isPublishOpen} 
        onClose={() => setIsPublishOpen(false)} 
        onConfirm={handlePublish} 
      />
    </div>
  );
}