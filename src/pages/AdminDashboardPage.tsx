import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

interface PlatformAnalytics {
  total_users: number;
  total_listings: number;
  total_quantity_kg: number;
  total_meals_provided: number;
  total_savings_rupees: number;
  active_listings: number;
  claimed_listings: number;
  collected_listings: number;
  ai_optimization_rate: number;
  platform_success_rate: number;
  top_performing_users: Array<{
    user_id: number;
    name: string;
    impact_score: number;
    total_quantity: number;
    success_rate: number;
  }>;
  food_waste_reduction_kg: number;
}

interface Trends {
  trends: {
    ai_adoption_rate: number;
    success_rate: number;
    avg_listing_size: number;
    growth_rate: string;
    peak_hours: number[];
    popular_food_types: string[];
  };
  recommendations: string[];
}

const AdminDashboardPage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();
  const [platformAnalytics, setPlatformAnalytics] = useState<PlatformAnalytics | null>(null);
  const [trends, setTrends] = useState<Trends | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"platform" | "trends">("platform");
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      navigate("/admin");
      return;
    }
    
    if (user.role !== "admin") {
      navigate("/admin");
      return;
    }

    // Only load data once
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadAdminData();
    }
  }, [user, navigate]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [platformRes, trendsRes] = await Promise.all([
        fetch("http://localhost:8000/analytics/platform"),
        fetch("http://localhost:8000/analytics/trends")
      ]);

      if (platformRes.ok) {
        const platformData = await platformRes.json();
        setPlatformAnalytics(platformData);
      }

      if (trendsRes.ok) {
        const trendsData = await trendsRes.json();
        setTrends(trendsData);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if user is not admin
  if (!user || user.role !== "admin") {
    return null;
  }

  if (loading) {
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
        
        <div className="relative z-10 container mx-auto px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-lg text-white/80 mt-4">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 container mx-auto px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-white/80">
            Platform insights and system trends
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white/80 p-1 rounded-lg">
            <Button
              variant={activeTab === "platform" ? "default" : "ghost"}
              onClick={() => setActiveTab("platform")}
              className="rounded-md"
            >
              Platform Analytics
            </Button>
            <Button
              variant={activeTab === "trends" ? "default" : "ghost"}
              onClick={() => setActiveTab("trends")}
              className="rounded-md"
            >
              Trends & Insights
            </Button>
          </div>
        </div>

        {/* Platform Analytics Tab */}
        {activeTab === "platform" && platformAnalytics && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Platform Overview */}
            <Card className="col-span-full bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Platform Overview</CardTitle>
                <CardDescription className="text-gray-600">
                  Overall platform performance and impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{platformAnalytics.total_users}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{platformAnalytics.total_listings}</div>
                    <div className="text-sm text-gray-600">Total Listings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{platformAnalytics.total_quantity_kg}kg</div>
                    <div className="text-sm text-gray-600">Food Donated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{platformAnalytics.total_meals_provided}</div>
                    <div className="text-sm text-gray-600">Meals Provided</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{platformAnalytics.platform_success_rate.toFixed(1)}%</div>
                <Progress value={platformAnalytics.platform_success_rate} className="mt-2" />
                <p className="text-gray-600 mt-2">listings collected</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">AI Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{platformAnalytics.ai_optimization_rate.toFixed(1)}%</div>
                <Progress value={platformAnalytics.ai_optimization_rate} className="mt-2" />
                <p className="text-gray-600 mt-2">AI-optimized listings</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Total Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">₹{platformAnalytics.total_savings_rupees}</div>
                <p className="text-gray-600">estimated savings</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Active Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{platformAnalytics.active_listings}</div>
                <p className="text-gray-600">currently available</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Food Waste Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{platformAnalytics.food_waste_reduction_kg}kg</div>
                <p className="text-gray-600">waste prevented</p>
              </CardContent>
            </Card>

            {/* Top Performing Users */}
            <Card className="col-span-full bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Top Performing Users</CardTitle>
                <CardDescription className="text-gray-600">
                  Users with highest impact scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {platformAnalytics.top_performing_users.map((user, index) => (
                    <div key={user.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">{index + 1}</Badge>
                        <div>
                          <div className="font-semibold text-gray-800">{user.name}</div>
                          <div className="text-sm text-gray-600">Impact Score: {user.impact_score}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">{user.total_quantity}kg</div>
                        <div className="text-sm text-gray-600">{user.success_rate.toFixed(1)}% success</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trends & Insights Tab */}
        {activeTab === "trends" && trends && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Trends Overview */}
            <Card className="col-span-full bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Platform Trends</CardTitle>
                <CardDescription className="text-gray-600">
                  Key metrics and growth patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{trends.trends.ai_adoption_rate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">AI Adoption Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{trends.trends.success_rate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{trends.trends.avg_listing_size.toFixed(1)}kg</div>
                    <div className="text-sm text-gray-600">Avg Listing Size</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Growth Rate */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{trends.trends.growth_rate}</div>
                <p className="text-gray-600">monthly growth</p>
              </CardContent>
            </Card>

            {/* Peak Hours */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Peak Activity Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trends.trends.peak_hours.map((hour, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{hour}:00</span>
                      <Badge variant="outline">{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Food Types */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Popular Food Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trends.trends.popular_food_types.map((food, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{food}</span>
                      <Badge variant="outline">{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="col-span-full bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Recommendations</CardTitle>
                <CardDescription className="text-gray-600">
                  Actionable insights for platform improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trends.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Badge variant="secondary">{index + 1}</Badge>
                      <p className="text-gray-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage; 