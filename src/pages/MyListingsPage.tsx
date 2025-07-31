import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import heroBackground from "@/assets/hero-background.jpg";

const MyListingsPage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user?.role || (user.role !== "restaurant" && user.role !== "store")) {
    window.location.href = "/login";
    return null;
  }
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:8000/surplus-listings/mine?user_id=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch listings");
      const data = await res.json();
      setListings(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Navigation */}
      <div className="relative z-50">
        <Navigation />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">My Surplus Listings</h1>
        {loading && <div className="text-white">Loading...</div>}
        {error && <div className="text-red-300 mb-4">{error}</div>}
        <div className="grid md:grid-cols-2 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">{listing.description}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-800">
                <div><b>Quantity:</b> {listing.quantity_kg} kg</div>
                <div><b>Status:</b> {listing.status}</div>
                {listing.photo_url && (
                  <div className="my-2">
                    <img src={listing.photo_url} alt="Surplus" className="max-h-32 rounded" />
                  </div>
                )}
                {listing.status === "claimed" && (
                  <div className="mt-2">
                    <Button
                      onClick={async () => {
                        try {
                          await fetch(`http://localhost:8000/surplus-listings/${listing.id}/collect`, { method: "PATCH" });
                          fetchListings();
                        } catch {}
                      }}
                    >
                      Mark as Collected
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyListingsPage;
