import { useState } from 'react';

interface LeaderboardUser {
  rank: number;
  name: string;
  observations: number;
  species: number;
  rareFunds: number;
  badges: {
    type: 'observer' | 'bird' | 'plant' | 'insect' | 'rare';
    title: string;
  }[];
}

const LeaderboardSection = () => {
  // Sample data for demonstration - in a real app, this would come from API
  const [users] = useState<LeaderboardUser[]>([
    {
      rank: 1,
      name: 'Amina R.',
      observations: 127,
      species: 84,
      rareFunds: 12,
      badges: [
        { type: 'observer', title: 'Master Observer' },
        { type: 'bird', title: 'Bird Expert' },
        { type: 'rare', title: 'Rare Species Finder' },
      ],
    },
    {
      rank: 2,
      name: 'Tariq A.',
      observations: 98,
      species: 67,
      rareFunds: 8,
      badges: [
        { type: 'observer', title: 'Master Observer' },
        { type: 'plant', title: 'Plant Expert' },
      ],
    },
    {
      rank: 3,
      name: 'Saadia M.',
      observations: 82,
      species: 59,
      rareFunds: 5,
      badges: [
        { type: 'observer', title: 'Active Observer' },
        { type: 'bird', title: 'Bird Expert' },
      ],
    },
    {
      rank: 4,
      name: 'Imran K.',
      observations: 75,
      species: 52,
      rareFunds: 3,
      badges: [
        { type: 'observer', title: 'Active Observer' },
        { type: 'insect', title: 'Insect Expert' },
      ],
    },
    {
      rank: 5,
      name: 'Naila Z.',
      observations: 63,
      species: 41,
      rareFunds: 2,
      badges: [
        { type: 'observer', title: 'Active Observer' },
        { type: 'plant', title: 'Plant Expert' },
      ],
    },
  ]);

  // Badge icon mapping
  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'observer':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M18.4 5.6a9 9 0 1 0 0 12.8"></path>
            <path d="M21.5 2.5a12 12 0 0 0 0 19"></path>
          </svg>
        );
      case 'bird':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 4l2 2"></path>
            <path d="M20 6l-5 5m-7-3l10 10-5 5v-5H8l5-5M8 13.5L4 8M2.5 4.5L7 9"></path>
          </svg>
        );
      case 'plant':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2c1.2.8 2 2.2 2 4 0 3-2 5-6 5h-1"></path>
            <path d="M7 10v6"></path>
            <path d="M20.5 17.5C19 19 16.5 19 14.5 18c-1.5 3.5-4 5.5-7 5.5-3.5 0-6-3-6-7 0-4.5 3-5.5 5-5.5 2.5 0 4 1.5 4 1.5"></path>
          </svg>
        );
      case 'insect':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 2s.5 2.9.7 4.8c.2 1.9 2.3 1.2 2.3 1.2"></path>
            <path d="M5 2s-.5 2.9-.7 4.8c-.2 1.9-2.3 1.2-2.3 1.2"></path>
            <path d="M12 17v-7"></path>
            <path d="M8 17v-5"></path>
            <path d="M16 17v-5"></path>
            <path d="M6 11l2.5-2.5c1-.8 2.5-.8 3.5 0l2.5 2.5"></path>
            <path d="M18 11l.3.3a1.9 1.9 0 0 1 .3 2.1l-1.2 2.4a2.1 2.1 0 0 1-1.2 1.1L12 18l-4.2-1.1a2.1 2.1 0 0 1-1.2-1.1l-1.2-2.4a1.9 1.9 0 0 1 .3-2.1L6 11"></path>
          </svg>
        );
      case 'rare':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  // Badge color mapping
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'observer': return 'bg-success';
      case 'bird': return 'bg-primary';
      case 'plant': return 'bg-accent';
      case 'insect': return 'bg-warning';
      case 'rare': return 'bg-secondary';
      default: return 'bg-neutral-400';
    }
  };

  return (
    <section className="bg-neutral-100 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-neutral-800 mb-2">Community Leaders</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Recognizing our top contributors who help document and protect Islamabad's biodiversity.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-neutral-50 text-neutral-600 text-left">
                  <th className="py-3 px-4 font-medium">Rank</th>
                  <th className="py-3 px-4 font-medium">Contributor</th>
                  <th className="py-3 px-4 font-medium">Observations</th>
                  <th className="py-3 px-4 font-medium">Species</th>
                  <th className="py-3 px-4 font-medium">Rare Finds</th>
                  <th className="py-3 px-4 font-medium">Badges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {users.map((user) => (
                  <tr key={user.rank} className="hover:bg-neutral-50">
                    <td className="py-3 px-4">{user.rank}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center mr-3 relative">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          {user.rank === 1 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center text-white text-xs">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8 21h8"></path>
                                <path d="M12 17v4"></path>
                                <path d="M17 8l-5-5-5 5"></path>
                                <path d="M12 3v10"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.observations}</td>
                    <td className="py-3 px-4">{user.species}</td>
                    <td className="py-3 px-4">{user.rareFunds}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-1">
                        {user.badges.map((badge, index) => (
                          <span 
                            key={index} 
                            className={`w-6 h-6 rounded-full ${getBadgeColor(badge.type)} flex items-center justify-center text-white text-xs`} 
                            title={badge.title}
                          >
                            {getBadgeIcon(badge.type)}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Badges Guide:</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-success flex items-center justify-center text-white text-xs mr-2">
                  {getBadgeIcon('observer')}
                </span>
                <span>Observer</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs mr-2">
                  {getBadgeIcon('bird')}
                </span>
                <span>Bird Expert</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs mr-2">
                  {getBadgeIcon('plant')}
                </span>
                <span>Plant Expert</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-warning flex items-center justify-center text-white text-xs mr-2">
                  {getBadgeIcon('insect')}
                </span>
                <span>Insect Expert</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-white text-xs mr-2">
                  {getBadgeIcon('rare')}
                </span>
                <span>Rare Finder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
