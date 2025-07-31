import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Determine the appropriate home route for logged-in users
  const getHomeRoute = () => {
    if (!user) return "/";
    if (user.role === "ngo") return "/ngo-dashboard";
    return "/dashboard";
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    window.location.href = "/";
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 p-8">
      <div className="flex items-center justify-between">
        <Link 
          to={getHomeRoute()} 
          className="text-white text-2xl font-bold hover:text-white/80 transition-colors duration-300"
        >
          SurplusServe
        </Link>
        
        <div className="flex items-center space-x-8">
          <Link 
            to="/about" 
            className="text-white hover:text-white/80 transition-colors duration-300 font-medium"
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-white hover:text-white/80 transition-colors duration-300 font-medium"
          >
            Contact
          </Link>
          
          {/* Logout Button - Only show when user is logged in */}
          {user && (
            <button
              onClick={handleLogout}
              className="text-white hover:text-white/80 transition-colors duration-300 font-medium px-4 py-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;