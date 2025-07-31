import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import restaurantBackground from "@/assets/restaurant-background.jpg";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const RestaurantPage = () => {
  

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${restaurantBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Navigation */}
      <Navigation />

      

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-8">
        <div className="max-w-2xl">
         
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-12">
            Restaurants
          </h2>

          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-white/10 mb-8">
            <p className="text-xl text-white/90 leading-relaxed">
              If You run a Restaurant and have food items prepared, which are of no use to use, 
              give it to the ngo's to provide back to the society.
            </p>
          </div>

          {/* Remove the Predictive Shorting Tool and related state/handlers from this page. */}

          <Link to="/login?type=restaurant">
            <Button variant="continue" size="lg" className="text-lg px-8 py-3">
              Continue →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;