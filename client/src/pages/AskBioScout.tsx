import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { askQuestion, getQuestions } from '@/lib/api';
import ChatInterface from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AskBioScout = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Welcome to BioScout! I can answer questions about Islamabad's biodiversity, local wildlife, and conservation efforts. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  
  // Scroll to bottom of chat on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
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
              <Input
                id="questionInput"
                type="text"
                placeholder="E.g., What birds are common in Margalla Hills? or Are there leopards in Islamabad?"
                className="w-full pl-4 pr-12 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                disabled={askMutation.isPending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-neutral-500 mt-1">Ask questions about local wildlife, plants, conservation, or recent sightings</p>
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
