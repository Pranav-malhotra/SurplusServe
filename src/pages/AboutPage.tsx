import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-4">
        <Navigation />
      </div>
      
      <div className="container mx-auto px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About Food Hero Academia</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                Food Hero Academia is dedicated to reducing food waste and fighting hunger by connecting 
                restaurants, departmental stores, and NGOs in a unified platform. We believe that together, 
                we can make a significant impact on both environmental sustainability and community welfare.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;