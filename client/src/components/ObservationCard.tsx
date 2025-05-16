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

  // Function to handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Hide the image and show the placeholder instead
    e.currentTarget.style.display = 'none';
    e.currentTarget.parentElement?.classList.add('image-error');
    e.currentTarget.onerror = null; // Prevent infinite fallback loop
  };

  // Determine species type class for badge
  const getSpeciesTypeClass = () => {
    switch(observation.speciesType?.toLowerCase()) {
      case 'bird': return 'bg-orange-100 text-orange-700';
      case 'mammal': return 'bg-purple-100 text-purple-700';
      case 'plant': return 'bg-green-100 text-green-700';
      case 'insect': return 'bg-amber-100 text-amber-700';
      case 'reptile': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
      <div className="relative">
        {/* Image container with fixed height */}
        <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
          {observation.imageUrl ? (
            <>
              <img 
                src={observation.imageUrl} 
                alt={observation.speciesName || 'Observation image'} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                onError={handleImageError}
                loading="lazy"
              />
              {/* Fallback that shows when image error occurs */}
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 absolute top-0 left-0 image-error-placeholder" style={{display: 'none'}}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-gray-500">Image unavailable</p>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-gray-500">No image provided</p>
            </div>
          )}
        </div>
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 ${observation.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} text-xs font-medium rounded-full shadow-sm`}>
            {observation.verified ? 'Verified' : 'Needs ID'}
          </span>
        </div>
        
        {/* Species type badge if available */}
        {observation.speciesType && (
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 ${getSpeciesTypeClass()} text-xs font-medium rounded-full shadow-sm`}>
              {observation.speciesType}
            </span>
          </div>
        )}
        
        {/* Rare indicator */}
        {observation.rare && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-pulse shadow-sm">
              Rare Find!
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-heading font-semibold text-lg text-gray-800 leading-tight">
            {observation.speciesName || 'Unknown Species'}
          </h3>
          {observation.scientificName && (
            <p className="text-sm text-gray-500 italic">{observation.scientificName}</p>
          )}
        </div>
        
        <div className="flex items-center mb-3 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="truncate">{observation.location}</span>
        </div>
        
        {observation.notes && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{observation.notes}</p>
        )}
        
        <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span className="text-sm text-gray-600">User #{observation.userId || 'Anonymous'}</span>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {formatRelativeTime(observation.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ObservationCard;
