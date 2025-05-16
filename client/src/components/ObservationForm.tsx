import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertObservationSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

// Extend the schema with extra validation
const formSchema = insertObservationSchema.extend({
  dateObserved: z.string().min(1, "Date is required"),
});

// Define prop types for the component
interface ObservationFormProps {
  onSubmit: (data: any) => void;
  onImageUpload: (file: File) => void;
  identificationResults: any[];
}

const ObservationForm = ({ onSubmit, onImageUpload, identificationResults }: ObservationFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Set up form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      speciesName: "",
      scientificName: "",
      location: "",
      dateObserved: new Date().toISOString().split("T")[0],
      notes: "",
      speciesType: "",
    },
  });

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // If species was identified by AI, use that data
    if (identificationResults.length > 0 && !values.speciesName) {
      const topResult = identificationResults[0];
      values.speciesName = topResult.species;
      values.scientificName = topResult.scientificName;
    }

    onSubmit(values);
    form.reset();
    setImageFile(null);
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      onImageUpload(file);
      
      // Update form if AI identifies a species
      if (identificationResults.length > 0) {
        const topResult = identificationResults[0];
        form.setValue("speciesName", topResult.species);
        form.setValue("scientificName", topResult.scientificName);
      }
    }
  };

  // Use current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude.toString();
          const longitude = position.coords.longitude.toString();
          form.setValue("latitude", latitude);
          form.setValue("longitude", longitude);
          // For display purposes, use a generic name
          form.setValue("location", "Current Location");
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Species Information */}
        <FormField
          control={form.control}
          name="speciesName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-neutral-700">Species Name (if known)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Common or scientific name" 
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Scientific Name */}
        <FormField
          control={form.control}
          name="scientificName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-neutral-700">Scientific Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Scientific name (if known)" 
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Species Type */}
        <FormField
          control={form.control}
          name="speciesType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-neutral-700">Species Type</FormLabel>
              <FormControl>
                <select 
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  {...field}
                >
                  <option value="">Select type</option>
                  <option value="bird">Bird</option>
                  <option value="mammal">Mammal</option>
                  <option value="plant">Plant</option>
                  <option value="reptile">Reptile</option>
                  <option value="insect">Insect</option>
                  <option value="other">Other</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Location Details */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-neutral-700">
                Location <span className="text-danger">*</span>
              </FormLabel>
              <div className="flex space-x-2">
                <FormControl>
                  <Input
                    placeholder="E.g., Margalla Hills Trail 3"
                    className="flex-grow px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                  title="Use current location"
                  onClick={handleUseCurrentLocation}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden latitude/longitude fields */}
        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Date Observed */}
        <FormField
          control={form.control}
          name="dateObserved"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-neutral-700">
                Date Observed <span className="text-danger">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Upload Image <span className="text-danger">*</span>
          </label>
          <input 
            type="file" 
            id="imageUpload" 
            className="hidden" 
            accept="image/*" 
            required={!imageFile}
            onChange={handleImageChange}
          />
          <label 
            htmlFor="imageUpload" 
            className="file-input-label flex flex-col items-center border-2 border-dashed border-neutral-300 rounded-lg p-6 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-500 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span className="text-neutral-600 text-sm">Drag & drop or click to upload</span>
            <span className="text-neutral-500 text-xs mt-1">Max size: 10MB | JPG, PNG</span>
          </label>
          {imageFile && (
            <p className="mt-2 text-sm text-primary">Image selected: {imageFile.name}</p>
          )}
        </div>
        
        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-neutral-700">Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Behavior, habitat details, or other observations..."
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Submit Observation
        </Button>
      </form>
    </Form>
  );
};

export default ObservationForm;
