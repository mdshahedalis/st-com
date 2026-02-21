"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Home, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

// --- Types ---
interface Specialist {
  id: string;
  title: string;
  base_price: number;
  cover_image: string;
  slug: string;
  authorName?: string; 
  authorRole?: string;
  authorAvatar?: string;
  final_price: number;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const API_BASE =`${baseUrl}/specialists`;
const ITEMS_PER_PAGE = 12;

export default function AllSpecialistsPage() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- Pagination State ---
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- Fetch Data on Page Change ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Pass page & limit to backend
        const response = await axios.get(`${API_BASE}`, {
          params: {
            status: "published",
            page: page,
            limit: ITEMS_PER_PAGE
          }
        });
        
        setSpecialists(response.data.data);
        setTotalPages(response.data.totalPages); // Backend must return this
        
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]); // Re-run when 'page' changes

  return (
    <div className="min-h-screen bg-white font-sans text-[#222222]">
      <div className="max-w-[1400px] mx-auto px-6 py-8 md:px-12">
        
        {/* --- Header Section --- */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-4">
            <Home size={14} className="mb-0.5" />
            <span>/</span>
            <span>Specialists</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Register a New Company</span>
          </div>

          <h1 className="text-[32px] font-bold tracking-tight mb-2 text-black">
            Register a New Company
          </h1>
          <p className="text-gray-500 text-[15px]">
            Get Your Company Registered with a Trusted Specialists
          </p>

          <div className="flex gap-3 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[6px] text-[14px] font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Price <ChevronDown size={16} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[6px] text-[14px] font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Sort by <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* --- Content Area --- */}
        {loading ? (
           <div className="h-[400px] flex items-center justify-center">
             <Loader2 className="animate-spin text-[#001D3D]" size={40} />
           </div>
        ) : specialists.length > 0 ? (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-12">
              {specialists.map((item, index) => (
                <SpecialistCard key={item.id} data={item} index={index} />
              ))}
            </div>

            {/* --- Pagination Controls --- */}
            <div className="flex justify-center items-center gap-3 border-t border-gray-100 pt-8">
              {/* Previous Button */}
              <button 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-1 px-4 py-2 text-[13px] font-bold text-gray-500 hover:text-[#003371] hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => {
                   const pageNum = i + 1;
                   if (totalPages > 7 && Math.abs(pageNum - page) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                      if (Math.abs(pageNum - page) === 3) return <span key={i} className="self-end px-1 text-gray-400">...</span>;
                      return null;
                   }
                   
                   return (
                    <button 
                      key={i} 
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${
                        page === pageNum 
                          ? "bg-[#003371] text-white shadow-md" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                   );
                })}
              </div>
              
              {/* Next Button */}
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-1 px-4 py-2 text-[13px] font-bold text-gray-500 hover:text-[#003371] hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
             <p className="text-gray-500 font-medium">No specialists found.</p>
          </div>
        )}

      </div>
    </div>
  );
}

// --- Card Component ---
function SpecialistCard({ data, index }: { data: Specialist; index: number }) {
  const mockUsers = [
    { name: "Adam Low", role: "Company Secretary" },
    { name: "Jessica Law", role: "Company Secretary" },
    { name: "Stacey Lim", role: "Company Secretary" },
    { name: "Sarah Wong", role: "Company Secretary" },
  ];
  const user = mockUsers[index % mockUsers.length];

  return (
    <Link href={`/specialists/${data.id}`} className="group block cursor-pointer">
      <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden mb-4 border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
        {data.cover_image ? (
          <Image
            src={data.cover_image}
            alt={data.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-200 relative overflow-hidden shrink-0">
             <Image src="https://ondecas.s3.eu-north-1.amazonaws.com/003-1760x2048jpeg" alt="Avatar" fill className="object-cover" />
          </div>
          <p className="text-[11px] font-bold text-gray-900">
            {user.name} <span className="text-gray-500 font-normal">• {user.role}</span>
          </p>
        </div>

        <h3 className="text-[15px] leading-[1.4] font-medium text-[#222222] line-clamp-2 group-hover:text-blue-700 transition-colors">
          {data.title}
        </h3>

        <div className="pt-1">
           <span className="text-[16px] font-bold text-[#222222]">
             RM {Number(data.final_price).toLocaleString()}
           </span>
        </div>
      </div>
    </Link>
  );
}