import { formatDistanceToNow } from 'date-fns';
import { Observation } from '@shared/schema';

interface ObservationCardProps {
  observation: Observation;
}

const ObservationCard = ({ observation }: ObservationCardProps) => {
  // Format date as relative time (e.g., "2 days ago")
  const formatRelativeTime = (date: Date): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      {observation.imageUrl && (
        <img 
          src={observation.imageUrl} 
          alt={observation.speciesName || 'Observation image'} 
          className="w-full h-48 object-cover" 
        />
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-heading font-medium text-lg">{observation.speciesName}</h3>
            {observation.scientificName && (
              <p className="text-sm text-neutral-500 italic">{observation.scientificName}</p>
            )}
          </div>
          <span className={`px-2 py-1 ${observation.verified ? 'bg-green-100 text-success' : 'bg-blue-100 text-accent'} text-xs rounded-full`}>
            {observation.verified ? 'Verified' : 'Needs ID'}
          </span>
        </div>
        
        <div className="flex items-center mb-3 text-sm text-neutral-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{observation.location}</span>
        </div>
        
        {observation.notes && (
          <p className="text-sm text-neutral-600 mb-4">{observation.notes}</p>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span className="text-sm">User #{observation.userId || 'Anonymous'}</span>
          </div>
          <span className="text-xs text-neutral-500">{formatRelativeTime(observation.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ObservationCard;
