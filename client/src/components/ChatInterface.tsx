import React from 'react';
import ReactMarkdown from 'react-markdown';
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
  return (
    <div className="bg-neutral-50 rounded-lg h-[420px] overflow-y-auto custom-scrollbar p-4 mb-4 shadow-inner">
      {/* Messages */}
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'items-start'} mb-5 animate-fadeIn`}
        >
          {message.sender === 'bot' && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center text-white mr-3 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"></path>
                <path d="M12 22V14"></path>
                <path d="M20 13V6"></path>
                <path d="M4 13V6"></path>
                <path d="M6 4L18 14"></path>
                <path d="M18 4L6 14"></path>
              </svg>
            </div>
          )}

          {message.sender === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white ml-3 order-2 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}

          <div 
            className={`${message.sender === 'user' 
              ? 'bg-blue-50 border-blue-100 order-1 text-right' 
              : 'bg-white shadow-md border-l-4 border-green-500'} 
              p-4 rounded-lg max-w-[80%] transition-all duration-200 hover:shadow-lg`}
          >
            {message.imageUrl && (
              <div className="mb-3">
                <img 
                  src={message.imageUrl} 
                  alt="Uploaded" 
                  className="max-w-full rounded-md max-h-60 object-contain border border-gray-200 shadow-sm" 
                />
                <p className="text-xs text-gray-500 mt-1">Uploaded image</p>
              </div>
            )}
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center text-white mr-3 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"></path>
              <path d="M12 22V14"></path>
              <path d="M20 13V6"></path>
              <path d="M4 13V6"></path>
              <path d="M6 4L18 14"></path>
              <path d="M18 4L6 14"></path>
            </svg>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md max-w-[80%] border-l-4 border-green-500">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <div className="text-xs text-gray-400 mt-2">BioScout is thinking...</div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full bg-white bg-opacity-60 rounded-xl p-6">
          <div className="p-4 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z"></path>
              <path d="M12 22V14"></path>
              <path d="M20 13V6"></path>
              <path d="M4 13V6"></path>
              <path d="M6 4L18 14"></path>
              <path d="M18 4L6 14"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Welcome to BioScout Chat</h3>
          <p className="text-gray-600 text-center mb-3">Ask questions about Islamabad's biodiversity or upload images for species identification</p>
          <div className="text-sm text-green-700 font-medium">Powered by Google Gemini AI</div>
        </div>
      )}

      {/* This div is used for scrolling to the bottom of the chat */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatInterface;
