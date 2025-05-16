import { apiRequest } from './queryClient';
import { Observation, Question } from '@shared/schema';

// Get app stats
export const getStats = async (): Promise<any> => {
  const res = await fetch('/api/stats', { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to fetch stats');
  }
  return res.json();
};

// Get all observations with optional limit
export const getObservations = async (limit?: number): Promise<Observation[]> => {
  const queryParams = limit ? `?limit=${limit}` : '';
  const res = await fetch(`/api/observations${queryParams}`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to fetch observations');
  }
  return res.json();
};

// Get observations by species type
export const getObservationsByType = async (type: string): Promise<Observation[]> => {
  const res = await fetch(`/api/observations/type/${type}`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${type} observations`);
  }
  return res.json();
};

// Search observations
export const searchObservations = async (query: string): Promise<Observation[]> => {
  const res = await fetch(`/api/observations/search?q=${encodeURIComponent(query)}`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to search observations');
  }
  return res.json();
};

// Get observation by ID
export const getObservation = async (id: number): Promise<Observation> => {
  const res = await fetch(`/api/observations/${id}`, { credentials: 'include' });
  if (!res.ok) {
    throw new Error(`Failed to fetch observation #${id}`);
  }
  return res.json();
};

// Submit a new observation
export const submitObservation = async (formData: FormData): Promise<Observation> => {
  const res = await fetch('/api/observations', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error('Failed to submit observation');
  }
  
  return res.json();
};

// Get species identification for an image
export const identifySpecies = async (imageFile: File): Promise<any[]> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const res = await fetch('/api/identify', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error('Failed to identify species');
  }
  
  return res.json();
};

// Save species identification results
export const saveIdentification = async (data: { 
  observationId: number, 
  results: any, 
  selectedIdentification?: string 
}): Promise<any> => {
  return apiRequest('POST', '/api/identifications', data);
};

// Ask a question to the RAG system
export const askQuestion = async (data: { question: string, userId?: number }): Promise<Question> => {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error('Failed to process question');
  }
  
  return res.json();
};

// Get previous questions and answers
export const getQuestions = async (): Promise<Question[]> => {
  const res = await fetch('/api/questions', { credentials: 'include' });
  if (!res.ok) {
    throw new Error('Failed to fetch questions');
  }
  return res.json();
};

// Update an observation
export const updateObservation = async (id: number, data: Partial<Observation>): Promise<Observation> => {
  return apiRequest('PATCH', `/api/observations/${id}`, data);
};

// Delete an observation
export const deleteObservation = async (id: number): Promise<void> => {
  return apiRequest('DELETE', `/api/observations/${id}`);
};
