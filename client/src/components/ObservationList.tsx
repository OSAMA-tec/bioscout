import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getObservations } from "@/lib/api";
import ObservationCard from "@/components/ObservationCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const ObservationList = () => {
  const [limit, setLimit] = useState(6);
  
  // Fetch observations with limit
  const { data: observations, isLoading } = useQuery({
    queryKey: ['/api/observations', limit],
    queryFn: () => getObservations(limit)
  });

  const loadMore = () => {
    setLimit(prevLimit => prevLimit + 6);
  };

  return (
    <section id="observations" className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-neutral-800">Recent Observations</h2>
        <Link href="/observations">
          <a className="text-primary hover:text-primary-dark transition-colors text-sm font-medium flex items-center">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </Link>
      </div>

      {/* Observation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array(6).fill(null).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))
        ) : observations?.length ? (
          observations.map(observation => (
            <ObservationCard key={observation.id} observation={observation} />
          ))
        ) : (
          <div className="col-span-3 py-8 text-center">
            <p className="text-neutral-500">No observations found.</p>
          </div>
        )}
      </div>
      
      {observations && observations.length >= limit && (
        <div className="flex justify-center mt-8">
          <Button 
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-full transition-colors"
            onClick={loadMore}
          >
            Load More Observations
          </Button>
        </div>
      )}
    </section>
  );
};

export default ObservationList;
