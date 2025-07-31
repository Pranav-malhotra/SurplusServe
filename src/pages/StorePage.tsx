import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import storeBackground from "@/assets/store-background.jpg";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const StorePage = () => {
  // Remove the Predictive Shorting Tool and related state/handlers from this page.

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

      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-8">
        <div className="max-w-2xl">
          
          
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