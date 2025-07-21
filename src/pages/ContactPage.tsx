import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-4">
        <Navigation />
      </div>
      
      <div className="container mx-auto px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">contact@foodheroacademia.com</p>
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-muted-foreground">
                    123 Hero Street<br />
                    Food City, FC 12345
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Monday - Friday</h3>
                  <p className="text-muted-foreground">9:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <h3 className="font-semibold">Saturday</h3>
                  <p className="text-muted-foreground">10:00 AM - 4:00 PM</p>
                </div>
                <div>
                  <h3 className="font-semibold">Sunday</h3>
                  <p className="text-muted-foreground">Closed</p>
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