import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  imageUrl?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatInterface = ({ messages, isLoading, messagesEndRef }: ChatInterfaceProps) => {
  // Function to format message text with line breaks and lists
  const formatMessage = (content: string) => {
    if (!content) return null;
    
    // Split by line breaks
    const lines = content.split('\n');
    
    return lines.map((line, i) => {
      // Check if the line is a list item
      if (line.match(/^-\s/)) {
        return (
          <li key={i} className="ml-5">
            {line.replace(/^-\s/, '')}
          </li>
        );
      }
      
      // If it's an empty line, add some spacing
      if (line.trim() === '') {
        return <br key={i} />;
      }
      
      // Otherwise, return the line as a paragraph
      return <p key={i}>{line}</p>;
    });
  };

  return (
    <div className="bg-neutral-50 rounded-lg h-96 overflow-y-auto custom-scrollbar p-4 mb-4">
      {/* Messages */}
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'items-start'} mb-4`}
        >
          {message.sender === 'bot' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"></path>
                <path d="M12 22V14"></path>
                <path d="M20 13V6"></path>
                <path d="M4 13V6"></path>
                <path d="M6 4L18 14"></path>
                <path d="M18 4L6 14"></path>
              </svg>
            </div>
          )}

          <div 
            className={`${message.sender === 'user' 
              ? 'bg-primary-light/20' 
              : 'bg-white shadow-sm'} p-3 rounded-lg max-w-[80%]`}
          >
            {message.imageUrl && (
              <div className="mb-2">
                <img 
                  src={message.imageUrl} 
                  alt="Uploaded" 
                  className="max-w-full rounded-md max-h-60 object-contain" 
                />
              </div>
            )}
            {formatMessage(message.content)}
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"></path>
              <path d="M12 22V14"></path>
              <path d="M20 13V6"></path>
              <path d="M4 13V6"></path>
              <path d="M6 4L18 14"></path>
              <path d="M18 4L6 14"></path>
            </svg>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%] flex space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 15h8"></path>
            <path d="M9 9h.01"></path>
            <path d="M15 9h.01"></path>
          </svg>
          <p className="text-neutral-500 text-center">No messages yet. Ask a question to get started!</p>
        </div>
      )}

      {/* This div is used for scrolling to the bottom of the chat */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatInterface;
