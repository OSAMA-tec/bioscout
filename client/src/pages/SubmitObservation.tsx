import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { submitObservation, identifySpecies } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CardTitle, CardDescription, Card, CardContent } from "@/components/ui/card";
import ObservationForm from "@/components/ObservationForm";
import SpeciesIdentifier from "@/components/SpeciesIdentifier";

const SubmitObservation = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [identificationResults, setIdentificationResults] = useState<any[]>([]);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setUploadedImage(file);
    setIsIdentifying(true);
    
    try {
      const results = await identifySpecies(file);
      setIdentificationResults(results);
    } catch (error) {
      toast({
        title: "Identification failed",
        description: "Could not identify species. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleObservationSubmit = async (data: any) => {
    try {
      // Include the uploaded image
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });
      
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }
      
      await submitObservation(formData);
      
      toast({
        title: "Observation submitted",
        description: "Thank you for contributing to BioScout Islamabad!",
      });
      
      // Reset form and state
      setUploadedImage(null);
      setIdentificationResults([]);
      
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your observation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="submit" className="bg-neutral-100 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-neutral-800 mb-2">Submit Your Observation</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Help document the biodiversity of Islamabad region by submitting your wildlife observations. Our AI will assist in identifying the species.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Form Section */}
            <div className="md:w-1/2 p-6 md:border-r border-neutral-200">
              <ObservationForm 
                onSubmit={handleObservationSubmit} 
                onImageUpload={handleImageUpload}
                identificationResults={identificationResults}
              />
            </div>
            
            {/* AI Assistant Section */}
            <div className="md:w-1/2 p-6 bg-neutral-50">
              <SpeciesIdentifier 
                uploadedImage={uploadedImage}
                identificationResults={identificationResults}
                isIdentifying={isIdentifying}
                onRemoveImage={() => setUploadedImage(null)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubmitObservation;
