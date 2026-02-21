"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- Icons (Specifically selected to match Figma UI) ---
import {
  LayoutDashboard, // Specialists
  Users2,          // Clients
  FileText,        // Service Orders
  PenLine,         // eSignature
  MessageSquare,   // Messages
  ReceiptText,     // Invoices & Receipts
  HelpCircle,      // Help
  Settings2,       // Settings
  Search,
  Bell,
  Mail,
  Plus,
  Download,
  MoreVertical,
  Menu,
  Tag,
  Pen,
  Settings
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Specialists", icon: <Tag size={20} />, path: "/admin/specialists" },
  { name: "Clients", icon: <Users2 size={20} />, path: "/admin/clients" },
  { name: "Service Orders", icon: <FileText size={20} />, path: "/admin/orders" },
  { name: "eSignature", icon: <PenLine size={20} />, path: "/admin/esignature" },
  { name: "Messages", icon: <Mail size={20} />, path: "/admin/messages" },
  { name: "Invoices & Receipts", icon: <ReceiptText size={20} />, path: "/admin/invoices" },
];

const Navbar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) =>
  pathname === path || pathname.startsWith(`${path}/`);


  return (
    <div className="min-h-screen bg-[#F8F9FB] flex font-sans text-[#222222]">
      
      {/* ================= SIDEBAR (Left) ================= */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-[#E5E7EB] 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Profile Section [cite: 147] */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#222222] mb-5">Profile</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              <Image 
                src="/images/image.png"
                alt="Gwen Lam" 
                width={40} 
                height={40} 
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-md text-[#222222]">Gwen Lam</span>
              <span className="text-[10px] font-semibold text-[#3B82F6]">ST Comp Holdings Sdn Bhd</span>
            </div>
          </div>
        </div>

        {/* Navigation Section [cite: 142] */}
        <nav className="flex-1 mt-4">
          <p className="px-6 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.1em] mb-3">Dashboard</p>
          
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-4 px-6 py-[14px] text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-[#003371] text-white shadow-md" // Exact Figma Blue [cite: 147]
                    : "text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#222222]"
                }`}
              >
                <span className={isActive(item.path) ? "text-white" : "text-[#4B5563]"}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Bottom Nav [cite: 171] */}
          <div className="mt-10 border-t border-gray-50 pt-4">
            <Link href="/admin/help" className="flex items-center gap-4 px-6 py-3 text-sm font-medium text-[#4B5563] hover:bg-[#F9FAFB]">
              <HelpCircle size={20} /> Help
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-4 px-6 py-3 text-sm font-medium text-[#4B5563] hover:bg-[#F9FAFB]">
              <Settings size={20} /> Settings
            </Link>
          </div>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT (Right) ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header [cite: 147, 150] */}
        <header className="h-20 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-600">
              <Menu size={24} />
            </button>
            
            {/* Search Input matching Figma styling [cite: 150] */}
            <div className="relative w-full max-w-[340px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
              <input 
                type="text" 
                placeholder="Search Services" 
                className="w-full bg-[#F3F4F6] border-none rounded-md py-[10px] pl-12 pr-4 text-sm placeholder:text-[#9CA3AF] focus:ring-1 focus:ring-[#003371]"
              />
            </div>
          </div>

          {/* Top Actions [cite: 165] */}
          <div className="flex items-center gap-3">

            <div className="flex items-center gap-4 ml-4 border-l pl-6 border-gray-200 text-[#9CA3AF]">
              <Mail size={20} className="cursor-pointer hover:text-[#222222]" />
              <div className="relative cursor-pointer hover:text-[#222222]">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                <Image src="/images/image.png" alt="User" width={32} height={32} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8F9FB] p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Navbar;