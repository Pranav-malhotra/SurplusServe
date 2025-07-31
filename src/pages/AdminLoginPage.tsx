import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already logged in as admin
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.role === "admin") {
      navigate("/admin/admin_dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("access_token", data.access_token);
        
        // Check if user is admin
        if (data.user.role === "admin") {
          navigate("/admin/admin_dashboard");
        } else {
          setError("Access denied. Admin credentials required.");
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
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

      <div className="relative z-10 flex items-center justify-center min-h-screen px-8">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-white/30 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Admin Login</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-800">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                  placeholder="admin@surplusserve.com"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-800">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500"
                  placeholder="Enter your password"
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login as Admin"}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Demo Admin Credentials:
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Email: admin@surplusserve.com<br/>
                Password: AdminPass123!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage; 