import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import SocialSidebar from "@/components/SocialSidebar";
import storeBackground from "@/assets/store-background.jpg";

const StorePage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${storeBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Social Sidebar */}
      <SocialSidebar />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-8">
        <div className="max-w-2xl">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-wide">
            SurplusServe
          </h1>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-12">
            Departmental Store
          </h2>

          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-white/10 mb-8">
            <p className="text-xl text-white/90 leading-relaxed">
              If You run a Departmental Store and have items which are near to expire, give it to 
              the ngo's to provide back to the society.
            </p>
          </div>

          <Link to="/login?type=store">
            <Button variant="continue" size="lg" className="text-lg px-8 py-3">
              Continue →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StorePage;