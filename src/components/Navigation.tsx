import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 p-8">
      <div className={`flex items-center ${isLandingPage ? 'justify-end' : 'justify-between'}`}>
        {!isLandingPage && (
          <Link 
            to="/" 
            className="text-white text-2xl font-bold hover:text-white/80 transition-colors duration-300"
          >
            SurplusServe
          </Link>
        )}
        
        <div className="flex space-x-8">
          <Link 
            to="/" 
            className="text-white hover:text-white/80 transition-colors duration-300 font-medium"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="text-white hover:text-white/80 transition-colors duration-300 font-medium"
          >
            About
          </Link>
          <Link 
            to="/feedback" 
            className="text-white hover:text-white/80 transition-colors duration-300 font-medium"
          >
            Feedback
          </Link>
          <Link 
            to="/contact" 
            className="text-white hover:text-white/80 transition-colors duration-300 font-medium"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;