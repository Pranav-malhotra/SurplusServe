import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import heroBackground from "@/assets/hero-background.jpg";

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role;
  const navigate = useNavigate();
  
  // Redirect NGOs to their specific dashboard
  useEffect(() => {
    console.log("DashboardPage - User:", user);
    console.log("DashboardPage - Role:", role);
    if (user && role === "ngo") {
      console.log("Redirecting NGO to /ngo-dashboard");
      navigate("/ngo-dashboard", { replace: true });
    }
  }, [user, role, navigate]);
  const [showShorting, setShowShorting] = useState(false);
  const [form, setForm] = useState({
    event_type: "",
    guest_count: "",
    food_types: "",
    seasonality: "",
    location: "",
    quantity_of_food: ""
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null as null | any);
  const [error, setError] = useState("");
  
  // Dashboard statistics state
  const [stats, setStats] = useState({
    total_donations: 0,
    active_listings: 0,
    claimed_listings: 0,
    collected_listings: 0,
    total_quantity_kg: 0,
    estimated_meals_provided: 0,
    ai_optimized_count: 0,
    estimated_savings_rupees: 0,
    success_rate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Load dashboard statistics
  const loadDashboardStats = async () => {
    if (!user?.id) return;
    
    try {
      setStatsLoading(true);
      const [statsRes, activityRes] = await Promise.all([
        fetch(`http://localhost:8000/dashboard/stats/${user.id}`),
        fetch(`http://localhost:8000/dashboard/recent-activity/${user.id}`)
      ]);
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData);
      }
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load stats on component mount
  useEffect(() => {
    if (user && user.role !== "ngo") {
      loadDashboardStats();
    }
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      const res = await fetch("http://localhost:8000/predictive-shorting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: form.event_type,
          guest_count: Number(form.guest_count),
          food_types: form.food_types,
          seasonality: form.seasonality,
          location: form.location,
          quantity_of_food: Number(form.quantity_of_food)
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setResult(data);
      
      // Show success message
      alert("AI prediction generated successfully! Check the results below.");
      
    } catch (err: any) {
      setError(err.message || "Failed to get prediction. Please try again.");
      console.error("Prediction error:", err);
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

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to SurplusServe Dashboard
          </h1>
          <p className="text-xl text-white/80">
            Manage your food donation activities and make a difference
          </p>
        </div>

        {/* Dashboard Content - Only for non-NGO users */}
        {user && user.role !== "ngo" ? (
          <>
            {/* Optimize My Order and View Analytics Buttons (Donors only) */}
            {(role === "restaurant" || role === "store") && (
              <div className="flex justify-center gap-4 mb-8">
                <Button variant="secondary" size="lg" onClick={() => setShowShorting(true)}>
                  Optimize My Order
                </Button>
                <Button variant="secondary" size="lg" onClick={() => navigate("/analytics")}>
                  View Analytics
                </Button>
              </div>
            )}

            {/* Predictive Shorting Modal */}
            <Dialog open={showShorting} onOpenChange={setShowShorting}>
          <DialogContent className="max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Predictive Shorting Tool</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="event_type">Event Type</Label>
                <Input id="event_type" name="event_type" value={form.event_type} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="guest_count">Expected Guest Count</Label>
                <Input id="guest_count" name="guest_count" type="number" value={form.guest_count} onChange={handleChange} required min={1} />
              </div>
              <div>
                <Label htmlFor="food_types">Food Types (comma-separated)</Label>
                <Textarea id="food_types" name="food_types" value={form.food_types} onChange={handleChange} required rows={2} />
              </div>
              <div>
                <Label htmlFor="seasonality">Seasonality</Label>
                <Input id="seasonality" name="seasonality" value={form.seasonality} onChange={handleChange} required placeholder="e.g., Summer, Winter, Monsoon" />
              </div>
              <div>
                <Label htmlFor="location">Geographical Location</Label>
                <Input id="location" name="location" value={form.location} onChange={handleChange} required placeholder="e.g., Mumbai, Delhi, Bangalore" />
              </div>
              <div>
                <Label htmlFor="quantity_of_food">Planned Quantity (kg)</Label>
                <Input id="quantity_of_food" name="quantity_of_food" type="number" value={form.quantity_of_food} onChange={handleChange} required min={0.1} step={0.1} placeholder="e.g., 50.5" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Optimizing..." : "Get AI Suggestion"}
              </Button>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-1 text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                </div>
              )}
            </form>
            {result && (
              <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-2 font-bold text-lg text-green-800">AI Suggestion Generated</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm text-gray-700">{result.ai_suggestion}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-2 rounded border text-center">
                      <div className="text-xs text-gray-500">Predicted Wastage</div>
                      <div className="font-bold text-red-600">{result.predicted_wastage_kg} kg</div>
                    </div>
                    <div className="bg-white p-2 rounded border text-center">
                      <div className="text-xs text-gray-500">Suggested Shorting</div>
                      <div className="font-bold text-green-600">{result.suggested_shorting_kg} kg</div>
                    </div>
                    <div className="bg-white p-2 rounded border text-center">
                      <div className="text-xs text-gray-500">Estimated Savings</div>
                      <div className="font-bold text-green-600">₹{result.estimated_savings_rupees}</div>
                    </div>
                    <div className="bg-white p-2 rounded border text-center">
                      <div className="text-xs text-gray-500">Risk Level</div>
                      <div className={`font-bold ${
                        result.risk_level === 'Low' ? 'text-green-600' : 
                        result.risk_level === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>{result.risk_level}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-800">Quick Actions</CardTitle>
              <CardDescription className="text-gray-600">
                Get started with your food donation journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant="outline" onClick={() => navigate("/create-listing")}>
                  Create New Listing
                </Button>
                <Button className="w-full" variant="outline" onClick={() => navigate("/my-listings")}>
                  View Active Donations
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-800">Statistics</CardTitle>
              <CardDescription className="text-gray-600">
                Your impact on the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading statistics...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Donations:</span>
                    <span className="font-semibold text-gray-800">{stats.total_donations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meals Provided:</span>
                    <span className="font-semibold text-gray-800">{stats.estimated_meals_provided}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Listings:</span>
                    <span className="font-semibold text-gray-800">{stats.active_listings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-semibold text-gray-800">{stats.success_rate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">AI Optimized:</span>
                    <span className="font-semibold text-gray-800">{stats.ai_optimized_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Savings:</span>
                    <span className="font-semibold text-gray-800">₹{stats.estimated_savings_rupees}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-gray-800">Recent Activity</CardTitle>
              <CardDescription className="text-gray-600">
                Your latest contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading activity...</p>
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                      <div>
                        <p className="font-medium text-sm text-gray-800">{activity.description}</p>
                        <p className="text-xs text-gray-600">
                          {activity.quantity_kg}kg • {activity.status}
                          {activity.ai_optimized && (
                            <span className="ml-2 text-green-600">🤖 AI Optimized</span>
                          )}
                        </p>
                      </div>
                      <span className="text-xs text-gray-600">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No recent activity</p>
                  <p className="text-sm">Start by creating your first donation listing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
          </>
        ) : user && user.role === "ngo" ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔄</div>
            <h3 className="text-xl font-semibold mb-2">Redirecting to NGO Dashboard...</h3>
            <p className="text-muted-foreground">Please wait while we redirect you to your dedicated dashboard.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DashboardPage;