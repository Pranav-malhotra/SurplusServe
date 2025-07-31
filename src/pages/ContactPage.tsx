import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import heroBackground from "@/assets/hero-background.jpg";

const ContactPage = () => {
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
          <h1 className="text-4xl font-bold text-center mb-8 text-white">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <p className="text-white/80">contact@surplusserve.com</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Phone</h3>
                  <p className="text-white/80">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Address</h3>
                  <p className="text-white/80">
                    123 Surplus Street<br />
                    Food City, FC 12345
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Office Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white">Monday - Friday</h3>
                  <p className="text-white/80">9:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Saturday</h3>
                  <p className="text-white/80">10:00 AM - 4:00 PM</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Sunday</h3>
                  <p className="text-white/80">Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;