import { Skeleton } from "@/components/ui/skeleton";

interface StatsCounterProps {
  totalObservations: number;
  totalSpecies: number;
  totalContributors: number;
  totalProtectedSpecies: number;
  isLoading: boolean;
}

const StatsCounter = ({
  totalObservations,
  totalSpecies,
  totalContributors,
  totalProtectedSpecies,
  isLoading
}: StatsCounterProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-wrap justify-around gap-4">
      <div className="text-center">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-20 mx-auto mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <p className="text-4xl font-bold text-primary">{totalObservations}</p>
            <p className="text-sm text-neutral-600">Total Observations</p>
          </>
        )}
      </div>
      <div className="text-center">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-20 mx-auto mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <p className="text-4xl font-bold text-secondary">{totalSpecies}</p>
            <p className="text-sm text-neutral-600">Species Recorded</p>
          </>
        )}
      </div>
      <div className="text-center">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-20 mx-auto mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <p className="text-4xl font-bold text-accent">{totalContributors}</p>
            <p className="text-sm text-neutral-600">Active Contributors</p>
          </>
        )}
      </div>
      <div className="text-center">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-20 mx-auto mb-2" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : (
          <>
            <p className="text-4xl font-bold text-success">{totalProtectedSpecies}</p>
            <p className="text-sm text-neutral-600">Protected Species</p>
          </>
        )}
      </div>
    </div>
  );
};

export default StatsCounter;
