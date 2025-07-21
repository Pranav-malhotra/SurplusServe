import { Instagram } from "lucide-react";

const SocialSidebar = () => {
  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col space-y-6">
        <a 
          href="#" 
          className="text-white hover:text-white/80 transition-all duration-300 hover:scale-110"
          aria-label="Instagram"
        >
          <Instagram size={24} />
        </a>
      </div>
    </div>
  );
};

export default SocialSidebar;