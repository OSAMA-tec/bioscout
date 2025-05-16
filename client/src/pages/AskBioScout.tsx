import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { askQuestion, getQuestions, uploadChatImage } from '@/lib/api';
import ChatInterface from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Image, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  imageUrl?: string;
}

const AskBioScout = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Welcome to BioScout! I can answer questions about Islamabad's biodiversity, local wildlife, and conservation efforts. You can also upload images to identify species. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get previous questions
  const { data: previousQuestions } = useQuery({
    queryKey: ['/api/questions'],
    queryFn: getQuestions
  });

  // Ask question mutation
  const askMutation = useMutation({
    mutationFn: askQuestion,
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content: data.answer,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to get an answer. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadChatImage(file, inputValue || undefined),
    onSuccess: (data) => {
      // Add the image message from user
      setMessages(prev => [
        ...prev,
        {
          id: `user-img-${Date.now()}`,
          content: inputValue || "What can you tell me about this image?",
          sender: 'user',
          timestamp: new Date(),
          imageUrl: data.imageUrl || undefined
        }
      ]);
      
      // Add the response from the AI
      setMessages(prev => [
        ...prev,
        {
          id: `bot-img-${Date.now()}`,
          content: data.answer,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      // Clear the image and input
      setSelectedImage(null);
      setImagePreview(null);
      setInputValue('');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to process the image. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  // Scroll to bottom of chat on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle selecting an image
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive'
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPEG, PNG).',
        variant: 'destructive'
      });
      return;
    }
    
    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle sending question or image
  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedImage) {
      // If there's an image, send it with the current input as the question
      uploadImageMutation.mutate(selectedImage);
    } else if (inputValue.trim()) {
      // Otherwise, send the text question
      // Add user message to chat
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content: inputValue,
          sender: 'user',
          timestamp: new Date()
        }
      ]);
      
      // Send question to API
      askMutation.mutate({ question: inputValue });
      
      // Clear input
      setInputValue('');
    }
  };
  
  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <section id="ask" className="container mx-auto px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-neutral-800 mb-2">Ask BioScout</h2>
        <p className="text-neutral-600 max-w-2xl mx-auto">Have questions about Islamabad's biodiversity? Our AI-powered guide can answer using local knowledge and community observations.</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <form onSubmit={handleSendQuestion} className="relative">
              <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Input
                      id="questionInput"
                      type="text"
                      placeholder="E.g., What birds are common in Margalla Hills? or Are there leopards in Islamabad?"
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      disabled={uploadImageMutation.isPending}
                    />
                    <Button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full hover:from-green-700 hover:to-green-600 transition-all shadow-md"
                      disabled={askMutation.isPending || uploadImageMutation.isPending || (!inputValue.trim() && !selectedImage)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    id="imageUpload" 
                    className="hidden" 
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageSelect}
                    disabled={uploadImageMutation.isPending}
                  />
                  <Button
                    type="button"
                    className={`p-3 rounded-full transition-all shadow hover:shadow-md ${
                      selectedImage !== null 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadImageMutation.isPending || selectedImage !== null}
                    title="Upload an image to identify species"
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Image preview */}
                {imagePreview && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="relative max-w-sm mx-auto">
                      <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200">
                        <img 
                          src={imagePreview} 
                          alt="Selected" 
                          className="w-full h-auto max-h-48 object-contain rounded" 
                        />
                      </div>
                      <Button
                        type="button"
                        className="absolute -top-2 -right-2 p-1 h-8 w-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                        onClick={handleRemoveImage}
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                        <span className="font-medium">{selectedImage?.name}</span>
                        <span className="bg-gray-200 px-2 py-1 rounded-full">
                          {(selectedImage?.size || 0) / 1024 < 1000 ? 
                            `${Math.round((selectedImage?.size || 0) / 1024)} KB` : 
                            `${((selectedImage?.size || 0) / 1024 / 1024).toFixed(1)} MB`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center mt-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedImage 
                      ? "Add an optional question about the image or click send to identify species" 
                      : "Ask questions about local wildlife, plants, conservation, or upload images for identification"}
                  </p>
                </div>
              </div>
            </form>
          </div>
          
          {/* Chat Interface */}
          <ChatInterface 
            messages={messages}
            isLoading={askMutation.isPending}
            messagesEndRef={messagesEndRef}
          />
          
          {/* Suggested Questions */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-700">Suggested Questions</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="bg-white hover:bg-blue-50 text-gray-700 text-sm rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all py-2 px-3 justify-start text-left"
                onClick={() => handleSuggestedQuestion("What endangered species live in Islamabad?")}
              >
                <span className="text-blue-600 mr-2">→</span>
                What endangered species live in Islamabad?
              </Button>
              <Button 
                variant="outline" 
                className="bg-white hover:bg-blue-50 text-gray-700 text-sm rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all py-2 px-3 justify-start text-left"
                onClick={() => handleSuggestedQuestion("How can I identify local snake species?")}
              >
                <span className="text-blue-600 mr-2">→</span>
                How can I identify local snake species?
              </Button>
              <Button 
                variant="outline" 
                className="bg-white hover:bg-blue-50 text-gray-700 text-sm rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all py-2 px-3 justify-start text-left"
                onClick={() => handleSuggestedQuestion("What's the best time to spot wildlife in Margalla Hills?")}
              >
                <span className="text-blue-600 mr-2">→</span>
                What's the best time to spot wildlife in Margalla Hills?
              </Button>
              <Button 
                variant="outline" 
                className="bg-white hover:bg-blue-50 text-gray-700 text-sm rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all py-2 px-3 justify-start text-left"
                onClick={() => handleSuggestedQuestion("Are there recent barking deer sightings?")}
              >
                <span className="text-blue-600 mr-2">→</span>
                Are there recent barking deer sightings?
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-3 italic">
              Click on any question above to quickly get information about Islamabad's biodiversity
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AskBioScout;
