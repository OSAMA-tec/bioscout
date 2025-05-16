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
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    id="questionInput"
                    type="text"
                    placeholder="E.g., What birds are common in Margalla Hills? or Are there leopards in Islamabad?"
                    className="w-full pl-4 pr-12 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={uploadImageMutation.isPending}
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
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
                  className="p-2 bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadImageMutation.isPending || selectedImage !== null}
                  title="Upload an image to identify species"
                >
                  <Image className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Image preview */}
              {imagePreview && (
                <div className="mt-2 relative">
                  <div className="relative w-full max-w-xs mx-auto">
                    <img 
                      src={imagePreview} 
                      alt="Selected" 
                      className="w-full h-auto max-h-40 object-contain rounded-md border border-neutral-300" 
                    />
                    <Button
                      type="button"
                      className="absolute top-1 right-1 p-1 h-6 w-6 bg-neutral-800 bg-opacity-70 text-white rounded-full hover:bg-opacity-100 transition-colors"
                      onClick={handleRemoveImage}
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-600 text-center mt-1">
                    {selectedImage?.name} - {(selectedImage?.size || 0) / 1024 < 1000 ? 
                      `${Math.round((selectedImage?.size || 0) / 1024)} KB` : 
                      `${((selectedImage?.size || 0) / 1024 / 1024).toFixed(1)} MB`}
                  </p>
                </div>
              )}
              
              <p className="text-xs text-neutral-500 mt-1">
                {selectedImage ? "Add an optional question about the image or click send to identify species" : 
                "Ask questions about local wildlife, plants, conservation, or upload images for identification"}
              </p>
            </form>
          </div>
          
          {/* Chat Interface */}
          <ChatInterface 
            messages={messages}
            isLoading={askMutation.isPending}
            messagesEndRef={messagesEndRef}
          />
          
          {/* Suggested Questions */}
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">Suggested Questions:</h4>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm rounded-full transition-colors"
                onClick={() => handleSuggestedQuestion("What endangered species live in Islamabad?")}
              >
                What endangered species live in Islamabad?
              </Button>
              <Button 
                variant="outline" 
                className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm rounded-full transition-colors"
                onClick={() => handleSuggestedQuestion("How can I identify local snake species?")}
              >
                How can I identify local snake species?
              </Button>
              <Button 
                variant="outline" 
                className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm rounded-full transition-colors"
                onClick={() => handleSuggestedQuestion("What's the best time to spot wildlife in Margalla Hills?")}
              >
                What's the best time to spot wildlife in Margalla Hills?
              </Button>
              <Button 
                variant="outline" 
                className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm rounded-full transition-colors"
                onClick={() => handleSuggestedQuestion("Are there recent barking deer sightings?")}
              >
                Are there recent barking deer sightings?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AskBioScout;
