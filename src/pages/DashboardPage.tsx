import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <Navigation />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Food Hero Academia Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your food donation activities and make a difference
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">Quick Actions</CardTitle>
              <CardDescription>
                Get started with your food donation journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  Create New Listing
                </Button>
                <Button className="w-full" variant="outline">
                  View Active Donations
                </Button>
                <Button className="w-full" variant="outline">
                  Contact NGOs
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-secondary">Statistics</CardTitle>
              <CardDescription>
                Your impact on the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Donations:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Meals Provided:</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Listings:</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-success">Recent Activity</CardTitle>
              <CardDescription>
                Your latest contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <p>No recent activity</p>
                <p className="text-sm">Start by creating your first donation listing</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;