"use client";
import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Upload, Info, CheckCircle, Loader2, ArrowLeft } from "lucide-react";

import EditSpecialistDrawer from "@/app/components/EditSpecialistDrawer";
import PublishModal from "@/app/components/PublishModal";


const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const API_BASE =`${baseUrl}/specialists`;

// --- Types for TSX Safety ---
interface SpecialistData {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  base_price: number;
  platform_fee: number;
  final_price: number;
  offerings: string[];
  is_draft: boolean;
  // Added Image Fields
  cover_image?: string;
  gallery_image_1?: string;
  gallery_image_2?: string;
}

function EditSpecialistContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial State
  const [data, setData] = useState<SpecialistData>({
    id: "",
    title: "",
    description: "",
    duration_days: 1,
    base_price: 0,
    platform_fee: 0,
    final_price: 0,
    offerings: [],
    is_draft: true,
    cover_image: "",
    gallery_image_1: "",
    gallery_image_2: ""
  });

  // --- 1. Fetch Data ---
  useEffect(() => {
    if (!id) {
      alert("No Specialist ID provided.");
      router.push("/admin/specialists");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/${id}`);
        const resData = response.data;

        // --- SAFE NUMBER CONVERSION ---
        const finalPrice = Number(resData.final_price || 0);
        const platformFee = Number(resData.platform_fee || 0);
        
        // Fallback: If 'price' or 'base_price' is missing, derive it
        let basePrice = Number(resData.price || resData.base_price);
        if (isNaN(basePrice) || basePrice === 0) {
            basePrice = finalPrice - platformFee;
        }

        setData({
          id: resData.id,
          title: resData.title || "",
          description: resData.description || "",
          duration_days: Number(resData.duration_days || 1),
          base_price: basePrice,
          platform_fee: platformFee,
          final_price: finalPrice,
          offerings: resData.offerings || [],
          is_draft: resData.is_draft ?? true,
          cover_image: resData.cover_image || "",
          gallery_image_1: resData.gallery_image_1 || "",
          gallery_image_2: resData.gallery_image_2 || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching specialist:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleSave = async (formData: any) => {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, {
        ...formData,
        base_price: formData.base_price 
      });
      
      const resData = response.data;
      
      setData(prev => ({
        ...prev,
        title: resData.title,
        description: resData.description,
        duration_days: resData.duration_days,
        base_price: Number(resData.price || resData.base_price || formData.base_price),
        platform_fee: Number(resData.platform_fee),
        final_price: Number(resData.final_price),
        offerings: resData.offerings || formData.offerings,
        is_draft: resData.is_draft,
        cover_image: resData.cover_image || formData.cover_image,
        gallery_image_1: resData.gallery_image_1 || formData.gallery_image_1,
        gallery_image_2: resData.gallery_image_2 || formData.gallery_image_2,
      }));

      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update. Check console.");
    }
  };

  // --- 3. Publish ---
  const handlePublish = async () => {
    try {
      await axios.post(`${API_BASE}/${id}/publish`);
      setData(prev => ({ ...prev, is_draft: false }));
      setIsPublishOpen(false);
      alert("Specialist Published Successfully!");
    } catch (error) {
      console.error("Publish failed:", error);
      alert("Failed to publish specialist.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="flex flex-col items-center gap-2 text-gray-500">
           <Loader2 className="animate-spin text-[#003371]" size={32} />
           <p className="text-sm font-medium">Loading specialist data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8 font-sans">
      
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-gray-500 hover:text-[#003371] mb-6 text-sm font-bold transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto">

        <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-[28px] font-bold text-[#222222] leading-tight">{data.title}</h1>
          
          {/* --- Image Grid (Updated to Show Actual Images) --- */}
          <div className="grid grid-cols-2 gap-4 h-[380px]">
            
            {/* Cover Image Slot */}
            <div className="bg-[#E5E7EB] rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
               {data.cover_image ? (
                  <Image 
                    src={data.cover_image} 
                    alt="Cover" 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
               ) : (
                  <>
                    <Upload size={40} className="text-gray-400 mb-3" />
                    <p className="text-[11px] text-gray-500 max-w-[150px]">
                        Upload an image for your specialist listing in PNG, JPG or JPEG up to 4MB
                    </p>
                  </>
               )}
            </div>

            <div className="grid grid-rows-2 gap-4">
               {/* Gallery Image 1 Slot */}
               <div className="bg-gray-200 rounded-lg relative overflow-hidden flex items-center justify-center text-gray-400 text-xs">
                  {data.gallery_image_1 ? (
                      <Image 
                        src={data.gallery_image_1} 
                        alt="Gallery 1" 
                        fill 
                        className="object-cover" 
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                  ) : "No Image"}
               </div>

               {/* Gallery Image 2 Slot */}
               <div className="bg-gray-200 rounded-lg relative overflow-hidden flex items-center justify-center text-gray-400 text-xs">
                  {data.gallery_image_2 ? (
                      <Image 
                        src={data.gallery_image_2} 
                        alt="Gallery 2" 
                        fill 
                        className="object-cover" 
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                  ) : "No Image"}
               </div>
            </div>
          </div>


          <div>
            <h3 className="text-[16px] font-bold text-[#222222] mb-2">Description</h3>
            <div className="pb-6 border-b border-gray-200 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {data.description || "No description provided."}
            </div>
          </div>

          {/* Offerings */}
          <div>
            <h3 className="text-[16px] font-bold text-[#222222] mb-4">Additional Offerings</h3>
            <div className="flex flex-wrap gap-2">
              {data.offerings.length > 0 ? data.offerings.map((off, i) => (
                <span key={i} className="px-4 py-2 bg-gray-100 rounded-full text-[12px] font-bold text-gray-600">
                  {off}
                </span>
              )) : <p className="text-sm text-gray-400">No additional offerings.</p>}
            </div>
          </div>

          {/* Company Secretary Profile */}
          <div className="pt-6">
             <h3 className="text-[16px] font-bold text-[#222222] mb-4">Company Secretary</h3>
             <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden border border-gray-100 relative">
                 <Image src="/assets/avatar.png" fill className="object-cover" alt="User" />
               </div>
               <div>
                 <div className="flex items-center gap-2">
                   <p className="text-sm font-bold">Grace Lam</p>
                   <CheckCircle size={14} className="text-emerald-500 fill-emerald-100" />
                 </div>
                 <p className="text-[11px] text-gray-500 mb-2">Corpsec Services Sdn Bhd</p>
                 <button className="bg-[#003371] text-white px-3 py-1 rounded-[4px] text-[10px] font-bold hover:bg-[#002855]">View Profile</button>
               </div>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Fee Card */}
        <div className="w-full lg:w-[420px] shrink-0 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex justify-end gap-3 mb-6">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="px-8 py-2.5 bg-[#001D3D] text-white text-[13px] font-bold rounded-[6px] hover:opacity-90 transition-opacity"
            >
              Edit
            </button>
            <button 
              onClick={() => setIsPublishOpen(true)}
              className={`px-8 py-2.5 text-white text-[13px] font-bold rounded-[6px] transition-all ${
                data.is_draft 
                  ? "bg-[#003371] hover:bg-[#002855]" 
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={!data.is_draft}
            >
              {data.is_draft ? "Publish" : "Published"}
            </button>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 h-fit sticky top-8">
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

// Wrap in Suspense for useSearchParams
export default function EditPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <EditSpecialistContent />
    </Suspense>
  );
}