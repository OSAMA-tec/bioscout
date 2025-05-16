import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Observation } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

// Fix default icon issue with React-Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface ObservationMapProps {
  observations: Observation[];
  isLoading: boolean;
  height?: string;
}

// Custom marker icons for different species types
const createMarkerIcon = (type: string) => {
  const colors: Record<string, string> = {
    'bird': '#1565C0', // accent
    'mammal': '#D32F2F', // danger
    'plant': '#2E7D32', // primary
    'reptile': '#FFA000', // secondary
    'default': '#757575', // neutral-500
  };

  return new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
    className: `marker-${type}`,
  });
};

export const ObservationMap = ({ observations, isLoading, height = "400px" }: ObservationMapProps) => {
  // Center coordinates for Islamabad (default)
  const islamabadCenter: [number, number] = [33.6844, 73.0479];
  
  // Use useRef to store the map instance
  const mapRef = useRef<L.Map | null>(null);

  // Update map bounds when observations change
  useEffect(() => {
    if (mapRef.current && observations.length > 0) {
      const points = observations
        .filter(obs => obs.latitude && obs.longitude)
        .map(obs => [parseFloat(obs.latitude!), parseFloat(obs.longitude!)] as [number, number]);
      
      if (points.length > 0) {
        const bounds = L.latLngBounds(points);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [observations]);

  if (isLoading) {
    return <Skeleton className="w-full h-96 rounded-md" />;
  }

  return (
    <div className="map-container" style={{ height }}>
      <MapContainer 
        center={islamabadCenter} 
        zoom={12} 
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {observations.map((observation) => {
          // Only create markers for observations with lat/lng data
          if (!observation.latitude || !observation.longitude) return null;
          
          const lat = parseFloat(observation.latitude);
          const lng = parseFloat(observation.longitude);
          
          // Skip invalid coordinates
          if (isNaN(lat) || isNaN(lng)) return null;
          
          const markerIcon = createMarkerIcon(observation.speciesType || 'default');
          
          return (
            <Marker 
              key={observation.id} 
              position={[lat, lng]}
              icon={markerIcon}
            >
              <Popup>
                <div className="popup-content">
                  <h3 className="font-medium text-base">{observation.speciesName}</h3>
                  {observation.scientificName && (
                    <p className="text-xs italic text-neutral-500">{observation.scientificName}</p>
                  )}
                  <p className="text-sm mt-1">{observation.location}</p>
                  <p className="text-xs text-neutral-500 mt-2">
                    {new Date(observation.dateObserved).toLocaleDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
