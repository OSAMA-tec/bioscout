import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getObservations } from "@/lib/api";
import { ObservationMap } from "@/components/ObservationMap";
import ObservationCard from "@/components/ObservationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const ObservationsPage = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch observations
  const { data: observations, isLoading } = useQuery({
    queryKey: ['/api/observations'],
    queryFn: getObservations
  });

  // Filter observations based on active filter
  const filteredObservations = activeFilter
    ? observations?.filter(obs => obs.speciesType === activeFilter)
    : observations;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <main className="flex-grow">
      <section id="observations" className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-neutral-800">Observations</h2>
          <div className="flex gap-2">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search species..."
                className="pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 h-4 w-4" />
            </form>
            <Button
              variant="outline"
              size="icon"
              className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="21" y1="4" x2="14" y2="4"></line>
                <line x1="10" y1="4" x2="3" y2="4"></line>
                <line x1="21" y1="12" x2="12" y2="12"></line>
                <line x1="8" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="20" x2="16" y2="20"></line>
                <line x1="12" y1="20" x2="3" y2="20"></line>
                <line x1="14" y1="2" x2="14" y2="6"></line>
                <line x1="8" y1="10" x2="8" y2="14"></line>
                <line x1="16" y1="18" x2="16" y2="22"></line>
              </svg>
            </Button>
          </div>
        </div>

        {/* Map View Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-medium text-lg">Observation Map</h3>
            <div className="flex gap-2">
              <Button
                variant={activeFilter === null ? "default" : "outline"}
                size="sm"
                className={activeFilter === null ? "bg-primary text-white" : "bg-neutral-100 text-neutral-700"}
                onClick={() => setActiveFilter(null)}
              >
                All
              </Button>
              <Button
                variant={activeFilter === "bird" ? "default" : "outline"}
                size="sm"
                className={activeFilter === "bird" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-700"}
                onClick={() => setActiveFilter("bird")}
              >
                Birds
              </Button>
              <Button
                variant={activeFilter === "mammal" ? "default" : "outline"}
                size="sm"
                className={activeFilter === "mammal" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-700"}
                onClick={() => setActiveFilter("mammal")}
              >
                Mammals
              </Button>
              <Button
                variant={activeFilter === "plant" ? "default" : "outline"}
                size="sm"
                className={activeFilter === "plant" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-700"}
                onClick={() => setActiveFilter("plant")}
              >
                Plants
              </Button>
            </div>
          </div>

          {/* Interactive Map */}
          <ObservationMap observations={filteredObservations || []} isLoading={isLoading} />
        </div>

        {/* Observation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 h-80 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))
          ) : filteredObservations?.length ? (
            filteredObservations.map(observation => (
              <ObservationCard key={observation.id} observation={observation} />
            ))
          ) : (
            <div className="col-span-3 py-8 text-center">
              <p className="text-neutral-500">No observations found.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-full transition-colors">
            Load More Observations
          </Button>
        </div>
      </section>
    </main>
  );
};

export default ObservationsPage;
