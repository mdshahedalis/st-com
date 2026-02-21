"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios"; 
import { Search, Plus, Download, MoreVertical, Trash2, Edit, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import DeleteModal from "@/app/components/DeleteModal"; // <-- Import the new modal

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const API_URL = `${baseUrl}/specialists`;

export default function SpecialistsDashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Notification State
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // --- NEW: Custom Delete Modal State ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [specialistToDelete, setSpecialistToDelete] = useState<string | null>(null);

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch Data from Backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let statusParam = "";
      if (activeTab === "Drafts") statusParam = "draft";
      if (activeTab === "Published") statusParam = "published";

      const response = await axios.get(API_URL, {
        params: {
          page: page,
          limit: 10,
          search: search,
          status: statusParam
        }
      });

      setData(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch specialists:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getApprovalBadge = (status: string) => {
    const label = status || "Under-Review"; 
    const styles: { [key: string]: string } = {
      "Approved": "bg-emerald-100 text-emerald-600",
      "Under-Review": "bg-cyan-100 text-cyan-600",
      "Rejected": "bg-red-100 text-red-600",
    };
    
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${styles[label] || "bg-gray-100 text-gray-600"}`}>{label}</span>;
  };

  const getPublishBadge = (is_draft: boolean) => {
    const label = is_draft ? "Not Published" : "Published";
    const style = is_draft ? "bg-[#B91C1C] text-white" : "bg-emerald-500 text-white";
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${style}`}>{label}</span>;
  };

  // --- UPDATED: Open Modal Instead of Native Alert ---
  const openDeleteModal = (id: string) => {
    setSpecialistToDelete(id);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null); // Close the dropdown menu
  };

  // --- UPDATED: Actual Delete Execution ---
  const executeDelete = async () => {
    if (!specialistToDelete) return;

    try {
      await axios.delete(`${API_URL}/${specialistToDelete}`); 
      setNotification({ message: "Specialist deleted successfully!", type: "success" });
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Delete failed", error);
      setNotification({ message: "Failed to delete specialist.", type: "error" });
    } finally {
      setIsDeleteModalOpen(false); // Close the modal
      setSpecialistToDelete(null); // Clear the ID
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen font-sans relative">
      
      {/* Floating Toast Notification */}
      {notification && (
        <div className={`fixed top-8 right-8 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-xl animate-in slide-in-from-top-5 duration-300 border ${
          notification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} className="text-emerald-500" /> : <AlertCircle size={20} className="text-red-500" />}
          <span className="text-[14px] font-bold">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-[#222222]">Specialists</h1>
        <p className="text-[13px] text-gray-500 mt-1">Create and publish your specialist services for Client s & Companies</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {["All", "Drafts", "Published"].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1); }} 
            className={`px-8 py-3 text-[14px] font-bold border-b-2 transition-colors ${
              activeTab === tab ? "border-[#003371] text-[#003371]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Actions & Search */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
           <input 
             type="text" 
             placeholder="Search Services" 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-[300px] bg-[#F3F4F6] border-none rounded-[4px] py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-[#003371] outline-none"
           />
        </div>
        <div className="flex gap-3">
          <Link href="/admin/specialists/create">
            <button className="flex items-center gap-2 bg-[#003371] text-white px-5 py-2.5 rounded-[4px] text-[13px] font-bold hover:bg-[#002855]">
              <Plus size={16} /> Create
            </button>
          </Link>
          <button className="flex items-center gap-2 px-8 py-2.5 bg-[#001D3D] text-white text-[13px] font-bold rounded-[6px] hover:opacity-90 transition-opacity">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Loading specialists...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="p-4 w-10"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase">Service</th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase">Price</th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase">Purchases</th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase">Duration</th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase">Approval Status</th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase">Publish Status</th>
                <th className="p-4 text-[11px] font-bold text-gray-400 uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#222222]">
              {data.length === 0 ? (
                 <tr>
                   <td colSpan={8} className="text-center py-10 text-gray-500">No specialists found.</td>
                 </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="p-4 font-medium">{item.title}</td>
                    <td className="p-4 font-bold">RM {item.final_price}</td>
                    <td className="p-4 pl-8">{item.purchases || 0}</td>
                    <td className="p-4">{item.duration_days ? `${item.duration_days} Days` : "-"}</td>
                    <td className="p-4">{getApprovalBadge(item.approval_status)}</td>
                    <td className="p-4">{getPublishBadge(item.is_draft)}</td>
                    <td className="p-4 text-center relative">
                      <button onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}>
                        <MoreVertical size={16} className="text-gray-400 hover:text-gray-600" />
                      </button>
                      
                      {/* Action Dropdown */}
                      {openMenuId === item.id && (
                        <div className="absolute right-8 top-8 w-32 bg-white shadow-xl rounded-lg border border-gray-100 z-50 py-1">
                          <Link href={`/admin/specialists/edit?id=${item.id}`}>
                            <button className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 text-sm font-medium text-gray-700">
                              <Edit size={14} /> Edit
                            </button>
                          </Link>
                          {/* UPDATED: Calls openDeleteModal instead of handleDelete directly */}
                          <button 
                            onClick={() => openDeleteModal(item.id)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 text-sm font-medium text-red-600"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8 text-[13px] font-bold text-gray-500">
         <button 
           disabled={page === 1} 
           onClick={() => setPage(page - 1)}
           className="flex items-center gap-1 hover:text-[#003371] disabled:opacity-50"
         >
           &lt; Previous
         </button>
         
         <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => setPage(i + 1)}
                 className={`w-8 h-8 flex items-center justify-center rounded-full ${
                   page === i + 1 ? "bg-[#003371] text-white" : "hover:bg-gray-100"
                 }`}
               >
                 {i + 1}
               </button>
            ))}
         </div>
         
         <button 
           disabled={page === totalPages} 
           onClick={() => setPage(page + 1)}
           className="flex items-center gap-1 hover:text-[#003371] disabled:opacity-50"
         >
           Next &gt;
         </button>
      </div>

      {/* --- NEW: Render Custom Delete Modal --- */}
      <DeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={executeDelete} 
      />

    </div>
  );
}