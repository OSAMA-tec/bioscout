import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface Event {
  date: string;
  title: string;
  description: string;
}

interface Resource {
  icon: JSX.Element;
  color: string;
  title: string;
  description: string;
  link: string;
}

const ResourcesSection = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);

  // Sample events
  const events: Event[] = [
    {
      date: "18 MAY",
      title: "Margalla Hills Bird Walk",
      description: "Join expert guides to spot and identify local bird species on Trail 5."
    },
    {
      date: "25 MAY",
      title: "Community Conservation Workshop",
      description: "Learn practical skills for wildlife documentation and conservation at IWMB Center."
    },
    {
      date: "02 JUN",
      title: "Native Plant Restoration Project",
      description: "Help plant native species to restore habitat in degraded areas of the park."
    }
  ];

  // Sample resources
  const resources: Resource[] = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      color: "bg-primary-light",
      title: "Field Guides",
      description: "Access downloadable field guides for identifying local species in Margalla Hills and surrounding areas.",
      link: "#"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
          <line x1="8" y1="2" x2="8" y2="18"></line>
          <line x1="16" y1="6" x2="16" y2="22"></line>
        </svg>
      ),
      color: "bg-secondary",
      title: "Biodiversity Hotspots",
      description: "Explore maps and guides to the richest biodiversity areas in and around Islamabad for optimal wildlife viewing.",
      link: "#"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      color: "bg-accent",
      title: "Conservation Partners",
      description: "Connect with local organizations working to protect Islamabad's natural heritage and get involved.",
      link: "#"
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;
    
    // In a real app, this would submit to an API
    alert(`Subscribed with email: ${email}`);
    setEmail('');
    setConsent(false);
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-neutral-800 mb-2">Conservation Resources</h2>
        <p className="text-neutral-600 max-w-2xl mx-auto">Learn more about local biodiversity and how you can contribute to conservation efforts in Islamabad.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="bg-white overflow-hidden">
            <div className={`h-48 ${resource.color} flex items-center justify-center`}>
              {resource.icon}
            </div>
            <CardContent className="p-4">
              <h3 className="font-heading font-medium text-lg mb-2">{resource.title}</h3>
              <p className="text-neutral-600 text-sm mb-4">{resource.description}</p>
              <a href={resource.link} className="inline-flex items-center text-primary font-medium text-sm hover:text-primary-dark transition-colors">
                {resource.title === "Field Guides" ? "Browse Guides" : 
                  resource.title === "Biodiversity Hotspots" ? "View Hotspots" : "Find Partners"}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/2">
            <h3 className="font-heading font-bold text-xl mb-4">Get Involved: Upcoming Events</h3>
            <div className="space-y-4">
              {events.map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-light/20 rounded-lg flex items-center justify-center text-primary mr-4">
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-neutral-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <a href="#" className="inline-flex items-center mt-4 text-primary font-medium hover:text-primary-dark transition-colors">
              View All Events 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-neutral-50 rounded-lg p-6">
              <h3 className="font-heading font-medium text-lg mb-4">Subscribe to BioScout Updates</h3>
              <p className="text-sm text-neutral-600 mb-4">Receive notifications about rare sightings, conservation events, and new features.</p>
              
              <form className="space-y-4" onSubmit={handleSubscribe}>
                <div>
                  <Input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-start">
                  <Checkbox 
                    id="consent" 
                    className="mt-1 mr-2"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked as boolean)}
                  />
                  <label htmlFor="consent" className="text-xs text-neutral-600">
                    I consent to receive email updates about BioScout activities and local biodiversity news. I understand I can unsubscribe at any time.
                  </label>
                </div>
                <Button 
                  type="submit" 
                  className="px-6 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
                  disabled={!email || !consent}
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
