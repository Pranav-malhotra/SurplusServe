import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useBackNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    
    const handlePopState = (event: PopStateEvent) => {
      // If user is logged in and trying to go to the main landing page
      if (user && window.location.pathname === '/') {
        event.preventDefault();
        
        // Redirect to appropriate dashboard based on user role
        if (user.role === "ngo") {
          navigate("/ngo-dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    };

    // Also handle direct navigation to landing page for logged-in users
    if (user && location.pathname === '/') {
      if (user.role === "ngo") {
        navigate("/ngo-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }

    // Listen for popstate events (back/forward button)
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location]);
}; 