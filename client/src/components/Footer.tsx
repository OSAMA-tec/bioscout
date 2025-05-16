import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"></path>
                  <path d="M12 22V14"></path>
                  <path d="M20 13V6"></path>
                  <path d="M4 13V6"></path>
                  <path d="M6 4L18 14"></path>
                  <path d="M18 4L6 14"></path>
                </svg>
              </div>
              <span className="font-heading font-bold text-xl">BioScout<span className="text-secondary">Islamabad</span></span>
            </div>
            <p className="text-neutral-300 text-sm mb-4">A community-driven platform for documenting, identifying, and learning about biodiversity in Islamabad and surrounding areas.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-neutral-300 hover:text-white transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/observations">
                  <a className="text-neutral-300 hover:text-white transition-colors">Explore Observations</a>
                </Link>
              </li>
              <li>
                <Link href="/submit">
                  <a className="text-neutral-300 hover:text-white transition-colors">Submit Observation</a>
                </Link>
              </li>
              <li>
                <Link href="/ask">
                  <a className="text-neutral-300 hover:text-white transition-colors">Ask BioScout</a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-neutral-300 hover:text-white transition-colors">About the Project</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-medium text-lg mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Field Guides</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Conservation Partners</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Biodiversity Maps</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Educational Materials</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Scientific Publications</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-medium text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 mr-2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span className="text-neutral-300">contact@bioscout-islamabad.org</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 mr-2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span className="text-neutral-300">+92 51 2345678</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1 mr-2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="text-neutral-300">Islamabad Wildlife Management Board, F-8, Islamabad</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-6 text-center text-sm text-neutral-400">
          <p>© 2025 BioScout Islamabad. All rights reserved.</p>
          <p className="mt-2">Developed for AI for a Sustainable Future Hackathon.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-neutral-400 hover:text-neutral-300 transition-colors">Terms of Service</a>
            <a href="#" className="text-neutral-400 hover:text-neutral-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-neutral-400 hover:text-neutral-300 transition-colors">Data Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
