import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://pixabay.com/get/g3098b63e02b0b4e6f1134d45fdd353dc68400bfd40bf2e181d492a1b976c4ee338fce47ad62df3f13d1e8d0ada780440caf90c207c2fb8d38a704f8136c9c9f8_1280.jpg" 
          alt="Margalla Hills landscape" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 to-primary/30"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4">Discover & Protect Islamabad's Biodiversity</h1>
          <p className="text-white/90 text-lg mb-8">Join our community science initiative to document, identify and learn about the rich flora and fauna in Islamabad and the Margalla Hills National Park.</p>
          
          <div className="flex flex-wrap gap-4">
            <Link href="/submit">
              <a className="px-6 py-3 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-full transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Submit Observation
              </a>
            </Link>
            <Link href="/ask">
              <a className="px-6 py-3 bg-white hover:bg-neutral-100 text-primary font-medium rounded-full transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Ask BioScout
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
