import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import heroBackground from "@/assets/hero-background.jpg";

const AboutPage = () => {
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
      <div className="relative z-20 container mx-auto px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-white">About SurplusServe</h1>
          
          <div className="space-y-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Our Story</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed mb-4 text-white">
                  SurplusServe is dedicated to solving two urgent challenges: food wastage and food insecurity. 
                  We are a technology-driven platform that bridges the gap between surplus food sources—like 
                  restaurants and stores—and the NGOs working tirelessly to nourish vulnerable communities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-white">
                  To build a smarter, more sustainable food ecosystem by empowering businesses to minimize 
                  waste and maximize their social impact.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">What We Do</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">Connect Food Donors and NGOs</h3>
                  <p className="text-base leading-relaxed text-white">
                    SurplusServe provides an easy-to-use platform where restaurants and stores can list 
                    surplus or near-expiry food, and NGOs can quickly claim what they need to serve communities.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">Smart Insights for Businesses</h3>
                  <p className="text-base leading-relaxed text-white">
                    Our AI-powered forecasting tools help businesses predict demand, optimize procurement, 
                    and reduce unnecessary food surplus—saving money and the planet.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">Streamlined, Transparent Process</h3>
                  <p className="text-base leading-relaxed text-white">
                    With real-time dashboards and notifications, both donors and NGOs can track donations, 
                    schedule pick-ups, and measure their collective positive impact.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">Promote Community and Sustainability</h3>
                  <p className="text-base leading-relaxed text-white">
                    Beyond food rescue, SurplusServe nurtures a network of changemakers working towards 
                    a more sustainable and equitable future.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Why We Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-white">
                  We saw how much good food is wasted every day, while so many still go hungry. We believe 
                  technology can connect resources to real needs, turning surplus food into hope, nutrition, 
                  and positive change.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Join the Movement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed mb-4 text-white">
                  Every donation, every claim, and every data-driven insight helps us move closer to a 
                  zero-waste, hunger-free world. Whether you're a business, an NGO, or someone passionate 
                  about social good—SurplusServe welcomes you to join our mission.
                </p>
                <p className="text-lg leading-relaxed font-semibold text-yellow-300">
                  Together, let's create a world where surplus serves society.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;