import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0 justify-between w-full md:w-auto">
          <Link href="/">
            <a className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"></path>
                  <path d="M12 22V14"></path>
                  <path d="M20 13V6"></path>
                  <path d="M4 13V6"></path>
                  <path d="M6 4L18 14"></path>
                  <path d="M18 4L6 14"></path>
                </svg>
              </div>
              <span className="font-heading font-bold text-xl text-primary-dark">BioScout<span className="text-secondary">Islamabad</span></span>
            </a>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        
        <div className={`flex flex-col md:flex-row items-center space-y-2 md:space-y-0 space-x-0 md:space-x-4 w-full md:w-auto ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
          <Link href="/">
            <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/' ? 'bg-primary-light text-white' : 'text-neutral-700 hover:bg-primary-light hover:text-white'} transition-colors`}>
              Home
            </a>
          </Link>
          <Link href="/observations">
            <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/observations' ? 'bg-primary-light text-white' : 'text-neutral-700 hover:bg-primary-light hover:text-white'} transition-colors`}>
              Observations
            </a>
          </Link>
          <Link href="/submit">
            <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/submit' ? 'bg-primary-light text-white' : 'text-neutral-700 hover:bg-primary-light hover:text-white'} transition-colors`}>
              Submit
            </a>
          </Link>
          <Link href="/ask">
            <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/ask' ? 'bg-primary-light text-white' : 'text-neutral-700 hover:bg-primary-light hover:text-white'} transition-colors`}>
              Ask BioScout
            </a>
          </Link>
          <Link href="#" className="ml-2">
            <a className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
              Sign In
            </a>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
