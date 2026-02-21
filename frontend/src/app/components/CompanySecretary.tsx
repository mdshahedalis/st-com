import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const CompanySecretary = () => {
  return (
    <div className="max-w-6xl mx-auto font-sans">

      <h2 className="text-[16px] font-bold text-[#222222] mb-8">
        Company Secretary
      </h2>

      <div className="flex flex-col md:flex-row gap-12 md:gap-20">
        
        {/* Left Column: Profile & Description */}
        <div className="flex-1">
          {/* Profile Header */}
          <div className="flex items-start gap-5 mb-6">
            
            {/* Avatar Profile */}
            <div className="w-20 h-20 shrink-0 relative rounded-full overflow-hidden border border-gray-100 bg-blue-50 shadow-sm">
              <img
                src="/images/image2.png"
                alt="Grace Lam"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-start pt-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[15px] font-bold text-[#222222]">Grace Lam</h3>
                
                {/* Verified Badge */}
                <div className="flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full">
                  <CheckCircle2 size={18} className="fill-emerald-500 text-white" />
                  Verified
                </div>
              </div>
              
              <p className="text-[13px] text-gray-600 mb-3">
                Corpsec Services Sdn Bhd
              </p>
              
              <button className="bg-[#0A1629] hover:bg-[#152442] text-white text-[12px] font-medium px-5 py-2 rounded-[6px] transition-colors shadow-sm">
                View Profile
              </button>
            </div>
          </div>

          {/* Description Text */}
          <p className="text-[13px] leading-[1.6] text-[#4A4A4A] max-w-[600px] text-justify">
            A company secretarial service founded by Grace, who believes that every
            company deserves clarity, confidence, and care in their compliance journey.
            Inspired by the spirit of entrepreneurship, Aida treats every client's business as if
            it were her own — attentive to detail, committed to deadlines, and focused on
            growth. Step into a partnership built on trust, transparency, and professional
            excellence. Whether you're just starting out or managing a growing company,
            Aida is here to make your corporate governance smooth, secure, and stress-free.
            Your company's peace of mind starts here
          </p>
        </div>

        {/* Right Column: Certifications */}
        <div className="flex-1">
          <h3 className="text-[16px] font-bold text-[#222222] mb-6">
            Certified Company Secretary
          </h3>
          
          <div className="flex items-center gap-8 flex-wrap">

            <img 
              src="/images/image3.png"
              alt="SSM" 
              className="h-10 object-contain" 
            />
            

            <img 
              src="/images/image4.png" /* Replace with actual MAICSA logo path */
              alt="MAICSA" 
              className="h-10 object-contain" 
            />
            
 
            <img 
              src="/images/image5.png"
              alt="Emblem" 
              className="h-12 object-contain" 
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default CompanySecretary;