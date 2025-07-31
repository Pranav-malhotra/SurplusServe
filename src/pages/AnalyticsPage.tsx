import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/Navigation";
import heroBackground from "@/assets/hero-background.jpg";

interface UserAnalytics {
  user_id: number;
  total_listings: number;
  total_quantity_kg: number;
  success_rate: number;
  ai_optimization_rate: number;
  avg_listing_size: number;
  most_common_food_types: string[];
  peak_activity_hours: number[];
  total_savings_rupees: number;
  impact_score: number;
}

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

const AnalyticsPage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [platformAnalytics, setPlatformAnalytics] = useState<PlatformAnalytics | null>(null);
  const [trends, setTrends] = useState<Trends | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"user" | "platform" | "trends">("user");

  useEffect(() => {
    loadAnalytics();
    
    // Reset to user tab if non-admin user tries to access admin tabs
    if (user && user.role !== "admin" && (activeTab === "platform" || activeTab === "trends")) {
      setActiveTab("user");
    }
  }, []);

  const loadAnalytics = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Always fetch user analytics
      const userRes = await fetch(`http://localhost:8000/analytics/user/${user.id}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setUserAnalytics(userData);
      }

      // Only fetch platform and trends data for admin users
      if (user?.role === "admin") {
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
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getImpactBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

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
            <p className="text-lg text-white/80 mt-4">Loading analytics...</p>
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
            Analytics Dashboard
          </h1>
          <p className="text-xl text-white/80">
            Track your impact and platform performance
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white/80 p-1 rounded-lg">
            <Button
              variant={activeTab === "user" ? "default" : "ghost"}
              onClick={() => setActiveTab("user")}
              className="rounded-md"
            >
              Your Analytics
            </Button>
            {/* Admin-only tabs */}
            {user?.role === "admin" && (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* User Analytics Tab */}
        {activeTab === "user" && userAnalytics && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Impact Score */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Your Impact Score
                  {getImpactBadge(userAnalytics.impact_score)}
                </CardTitle>
                <CardDescription>
                  Overall performance based on success rate, AI usage, and quantity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getImpactColor(userAnalytics.impact_score)}`}>
                    {userAnalytics.impact_score.toFixed(0)}
                  </div>
                  <p className="text-muted-foreground mt-2">out of 100</p>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Total Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userAnalytics.total_listings}</div>
                <p className="text-muted-foreground">listings created</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userAnalytics.total_quantity_kg}kg</div>
                <p className="text-muted-foreground">food donated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userAnalytics.success_rate.toFixed(1)}%</div>
                <Progress value={userAnalytics.success_rate} className="mt-2" />
                <p className="text-muted-foreground mt-2">listings collected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userAnalytics.ai_optimization_rate.toFixed(1)}%</div>
                <Progress value={userAnalytics.ai_optimization_rate} className="mt-2" />
                <p className="text-muted-foreground mt-2">AI-optimized listings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{userAnalytics.total_savings_rupees}</div>
                <p className="text-muted-foreground">estimated savings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Listing Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{userAnalytics.avg_listing_size.toFixed(1)}kg</div>
                <p className="text-muted-foreground">per listing</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Platform Analytics Tab */}
        {activeTab === "platform" && platformAnalytics && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Platform Overview */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>
                  Overall platform performance and impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{platformAnalytics.total_users}</div>
                    <p className="text-sm text-muted-foreground">Users</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{platformAnalytics.total_listings}</div>
                    <p className="text-sm text-muted-foreground">Listings</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{platformAnalytics.total_meals_provided}</div>
                    <p className="text-sm text-muted-foreground">Meals Provided</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">₹{platformAnalytics.total_savings_rupees}</div>
                    <p className="text-sm text-muted-foreground">Total Savings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Success Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{platformAnalytics.platform_success_rate.toFixed(1)}%</div>
                <Progress value={platformAnalytics.platform_success_rate} className="mt-2" />
                <p className="text-muted-foreground mt-2">listings collected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Adoption Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{platformAnalytics.ai_optimization_rate.toFixed(1)}%</div>
                <Progress value={platformAnalytics.ai_optimization_rate} className="mt-2" />
                <p className="text-muted-foreground mt-2">AI-optimized listings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Waste Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{platformAnalytics.food_waste_reduction_kg.toFixed(0)}kg</div>
                <p className="text-muted-foreground">food waste prevented</p>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Top Performing Users</CardTitle>
                <CardDescription>
                  Users with the highest impact scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {platformAnalytics.top_performing_users.map((user, index) => (
                    <div key={user.user_id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.total_quantity}kg donated • {user.success_rate.toFixed(1)}% success rate
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{user.impact_score.toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">impact score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === "trends" && trends && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Trends Overview */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Platform Trends</CardTitle>
                <CardDescription>
                  Key metrics and growth indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{trends.trends.ai_adoption_rate.toFixed(1)}%</div>
                    <p className="text-sm text-muted-foreground">AI Adoption</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{trends.trends.success_rate.toFixed(1)}%</div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{trends.trends.avg_listing_size.toFixed(1)}kg</div>
                    <p className="text-sm text-muted-foreground">Avg Listing Size</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold capitalize">{trends.trends.growth_rate}</div>
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Actionable insights to improve your impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trends.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-blue-800">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Food Types */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Food Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trends.trends.popular_food_types.map((foodType, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{foodType}</span>
                      <Badge variant="secondary">{Math.floor(Math.random() * 50) + 20}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Peak Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Activity Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {trends.trends.peak_hours.map((hour, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{hour}:00</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}
                        ></div>
                      </div>
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

export default AnalyticsPage; 