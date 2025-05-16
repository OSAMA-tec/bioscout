import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SpeciesIdentifierProps {
  uploadedImage: File | null;
  identificationResults: any[];
  isIdentifying: boolean;
  onRemoveImage: () => void;
}

const SpeciesIdentifier = ({ 
  uploadedImage, 
  identificationResults, 
  isIdentifying, 
  onRemoveImage 
}: SpeciesIdentifierProps) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [progressValue, setProgressValue] = useState(0);

  // Create preview URL for the uploaded image
  useEffect(() => {
    if (uploadedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(uploadedImage);
    } else {
      setImagePreviewUrl(null);
    }
  }, [uploadedImage]);

  // Simulate analysis progress for better user experience
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isIdentifying) {
      setProgressValue(0);
      interval = setInterval(() => {
        setProgressValue(prevProgress => {
          const newProgress = prevProgress + 5;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 150);
    } else if (identificationResults.length > 0) {
      setProgressValue(100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isIdentifying, identificationResults]);

  const handleRemoveImage = () => {
    setImagePreviewUrl(null);
    onRemoveImage();
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-heading font-medium text-lg text-neutral-800 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="10" cy="8" r="1"></circle>
            <circle cx="14" cy="8" r="1"></circle>
            <polyline points="16 16 14 12 12 16 10 12 8 16"></polyline>
          </svg>
          AI Species Identification
        </h3>
        <p className="text-sm text-neutral-600 mb-4">Our AI assistant will analyze your image and suggest possible species identifications.</p>
      </div>
      
      {/* Preview Area */}
      {imagePreviewUrl ? (
        <div className="mb-6">
          <div className="relative rounded-lg overflow-hidden bg-neutral-200 h-48 mb-2">
            <img 
              src={imagePreviewUrl} 
              className="w-full h-full object-contain" 
              alt="Your uploaded image" 
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 p-1 bg-neutral-800/70 text-white rounded-full hover:bg-neutral-800"
              title="Remove image"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Progress value={progressValue} className="h-1.5 mb-1" />
          <p className="text-xs text-neutral-500 mt-1">
            {isIdentifying ? "Analyzing image..." : (identificationResults.length > 0 ? "Analysis complete" : "Ready for analysis")}
          </p>
        </div>
      ) : (
        <div className="mb-6 space-y-4">
          <p className="text-sm text-neutral-600">Upload an image to get AI-powered species suggestions.</p>
        </div>
      )}
      
      {/* AI Results */}
      {identificationResults.length > 0 && (
        <div className="space-y-4 mb-6">
          <div className="p-4 border border-primary-light bg-primary-light/10 rounded-lg">
            <h4 className="font-medium text-primary-dark mb-2">Potential Species Matches</h4>
            
            <div className="space-y-3">
              {identificationResults.map((result, index) => {
                let colorClass;
                if (index === 0) {
                  colorClass = "bg-success";
                } else if (index === 1) {
                  colorClass = "bg-warning";
                } else {
                  colorClass = "bg-neutral-400";
                }
                
                return (
                  <div key={index} className="flex items-center p-2 bg-white rounded-lg border border-neutral-200">
                    <div className={`w-2 h-14 ${colorClass} rounded-l-sm mr-2`}></div>
                    <div className="flex-grow">
                      <p className="font-medium">{result.species}</p>
                      <p className="text-xs text-neutral-500 italic">{result.scientificName}</p>
                    </div>
                    <div className="text-right">
                      <p className={`${index === 0 ? "text-success" : index === 1 ? "text-warning" : "text-neutral-500"} font-medium`}>
                        {Math.round(result.confidence * 100)}%
                      </p>
                      <p className="text-xs text-neutral-500">confidence</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-xs text-neutral-600 mt-3">Note: AI suggestions are estimates. Expert verification may be needed.</p>
          </div>
        </div>
      )}
      
      {/* Guidelines */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <h4 className="font-medium text-neutral-700 mb-2">Submission Guidelines</h4>
        <ul className="text-sm text-neutral-600 space-y-2">
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success mt-1 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Clear photos help with accurate identification</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success mt-1 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Include habitat details when possible</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success mt-1 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Respect wildlife - maintain safe distances</span>
          </li>
          <li className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success mt-1 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>For rare/endangered species, consider hiding exact location</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SpeciesIdentifier;
