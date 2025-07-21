import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FeedbackPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-4">
        <Navigation />
      </div>
      
      <div className="container mx-auto px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Share Your Feedback</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>We'd love to hear from you</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
                <div>
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea id="feedback" placeholder="Share your thoughts..." rows={5} />
                </div>
                <Button className="w-full">Submit Feedback</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;