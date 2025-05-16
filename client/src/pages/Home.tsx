import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import StatsCounter from "@/components/StatsCounter";
import ObservationList from "@/components/ObservationList";
import ResourcesSection from "@/components/ResourcesSection";
import LeaderboardSection from "@/components/LeaderboardSection";
import { getStats } from "@/lib/api";

const Home = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: getStats
  });

  return (
    <main className="flex-grow">
      <HeroSection />
      
      <div className="container mx-auto px-4 relative z-10 -mt-8">
        <StatsCounter
          totalObservations={stats?.totalObservations || 0}
          totalSpecies={stats?.totalSpecies || 0}
          totalContributors={stats?.totalContributors || 0}
          totalProtectedSpecies={stats?.totalProtectedSpecies || 0}
          isLoading={statsLoading}
        />
      </div>
      
      <ObservationList />
      
      <LeaderboardSection />
      
      <ResourcesSection />
    </main>
  );
};

export default Home;
