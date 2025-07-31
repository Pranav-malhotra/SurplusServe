import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import SocialSidebar from "@/components/SocialSidebar";
import heroBackground from "@/assets/hero-background.jpg";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Redirect logged-in users to their appropriate dashboard
  useEffect(() => {
    if (user) {
      if (user.role === "ngo") {
        navigate("/ngo-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Social Sidebar */}
      <SocialSidebar />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        <div className="text-center mb-12">
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-8 tracking-wide">
            SurplusServe
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Connecting restaurants, stores, and NGOs to fight food waste and feed communities
          </p>
        </div>

        {/* User Type Selection */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl w-full">
          <Link to="/ngo" className="group">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">NGO's</h3>
              <p className="text-white/80 mb-6">
                Receive hygienic food leftovers from grocery stores and restaurants to provide back to the society
              </p>
              <Button variant="hero" className="w-full">
                Continue as NGO →
              </Button>
            </div>
          </Link>

          <Link to="/restaurant" className="group">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">Restaurants</h3>
              <p className="text-white/80 mb-6">
                Donate prepared food items that are unused to NGOs and help provide back to the society
              </p>
              <Button variant="hero" className="w-full">
                Continue as Restaurant →
              </Button>
            </div>
          </Link>

          <Link to="/store" className="group">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">Departmental Store</h3>
              <p className="text-white/80 mb-6">
                Donate items near expiry to NGOs and help provide back to the society
              </p>
              <Button variant="hero" className="w-full">
                Continue as Store →
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;