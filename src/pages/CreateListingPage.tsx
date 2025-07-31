import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import heroBackground from "@/assets/hero-background.jpg";

const CreateListingPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user?.role || (user.role !== "restaurant" && user.role !== "store")) {
    window.location.href = "/login";
    return null;
  }
  const [form, setForm] = useState({
    description: "",
    quantity_kg: "",
    photo_url: "",
    ai_optimized: false,
    event_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:8000/surplus-listings?user_id=${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description,
          quantity_kg: Number(form.quantity_kg),
          photo_url: form.photo_url || null,
          ai_optimized: form.ai_optimized,
          event_id: form.event_id ? Number(form.event_id) : null
        })
      });
      if (!res.ok) throw new Error("Failed to create listing");
      setSuccess("Listing created successfully!");
      setTimeout(() => navigate("/my-listings"), 1000);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="relative z-10 flex justify-center items-center min-h-screen px-8">
        <Card className="max-w-lg w-full bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-gray-800">Create Surplus Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label className="text-gray-800">Description</Label>
                <Textarea name="description" value={form.description} onChange={handleChange} required className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500" />
              </div>
              <div>
                <Label className="text-gray-800">Quantity (kg)</Label>
                <Input name="quantity_kg" type="number" value={form.quantity_kg} onChange={handleChange} required min={0.1} step={0.1} className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500" />
              </div>
              <div>
                <Label className="text-gray-800">Photo URL</Label>
                <Input name="photo_url" value={form.photo_url} onChange={handleChange} className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500" />
              </div>
              <div>
                <Label className="text-gray-800">
                  <input type="checkbox" name="ai_optimized" checked={form.ai_optimized} onChange={handleChange} />
                  <span className="ml-2">AI Optimized</span>
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Listing"}
              </Button>
              {error && <div className="text-red-300 text-sm">{error}</div>}
              {success && <div className="text-green-300 text-sm">{success}</div>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateListingPage;
