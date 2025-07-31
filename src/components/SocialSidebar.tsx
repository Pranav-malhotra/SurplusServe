import { Instagram } from "lucide-react";

const SocialSidebar = () => {
  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col space-y-6">
        <button 
          onClick={() => {
            window.open("https://www.instagram.com/surplusserve?igsh=dHlycm44a2Z4ZzZx&utm_source=qr", "_blank", "noopener,noreferrer");
          }}
          className="text-white hover:text-white/80 transition-all duration-300 hover:scale-110 cursor-pointer bg-transparent border-none p-0"
          aria-label="Follow SurplusServe on Instagram"
        >
          <Instagram size={24} />
        </button>
      </div>
    </div>
  );
};

export default SocialSidebar;