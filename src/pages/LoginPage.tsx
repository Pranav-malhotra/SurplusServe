import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import heroBackground from "@/assets/hero-background.jpg";
import API_ENDPOINTS from "@/config/api";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userType = searchParams.get("type") || "user";

  // Registration state
  const [isRegister, setIsRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
    role: "restaurant",
  });
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Login state
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loginError, setLoginError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    try {
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Registration failed");
      }
      setRegisterSuccess("Registration successful! Please log in.");
      setIsRegister(false);
    } catch (err: any) {
      setRegisterError(err.message || "Unknown error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: formData.email,
          password: formData.password
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Login failed");
      }
      const data = await res.json();
      // Store user info and token (if needed)
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      setLoginError(err.message || "Unknown error");
    }
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case "ngo": return isRegister ? "NGO Sign Up" : "NGO Login";
      case "restaurant": return isRegister ? "Restaurant Sign Up" : "Restaurant Login";
      case "store": return isRegister ? "Store Sign Up" : "Store Login";
      default: return isRegister ? "Sign Up" : "Login";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        <div className="mb-8 text-center">
         
        </div>

        <Card className="w-full max-w-md bg-white/30 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              {getUserTypeTitle()}
            </CardTitle>
            <CardDescription className="text-white/80">
              {isRegister ? "Create your account" : "Enter your credentials to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRegister ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                    className="bg-white/40 border-white/50 text-white placeholder:text-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    className="bg-white/40 border-white/50 text-white placeholder:text-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    className="bg-white/40 border-white/50 text-white placeholder:text-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">Role</Label>
                  <select
                    id="role"
                    name="role"
                    value={registerData.role}
                    onChange={handleRegisterChange}
                    className="w-full border border-white/50 rounded px-2 py-2 bg-white/40 text-white"
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="store">Store</option>
                    <option value="ngo">NGO</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Register
                </Button>
                {registerError && <div className="text-red-300 text-sm mt-2">{registerError}</div>}
                {registerSuccess && <div className="text-green-300 text-sm mt-2">{registerSuccess}</div>}
                <div className="text-center">
                  <Button variant="link" className="text-sm text-white hover:text-white/80" type="button" onClick={() => setIsRegister(false)}>
                    Already have an account? Log in
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-white/40 border-white/50 text-white placeholder:text-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-white/40 border-white/50 text-white placeholder:text-white/70"
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Login
                </Button>
                {loginError && <div className="text-red-300 text-sm mt-2">{loginError}</div>}
                <div className="text-center">
                  <Button variant="link" className="text-sm text-white hover:text-white/80" type="button" onClick={() => setIsRegister(true)}>
                    Don't have an account? Sign up
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;