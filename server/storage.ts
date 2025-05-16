import {
  users, User, InsertUser,
  observations, Observation, InsertObservation,
  questions, Question, InsertQuestion,
  identifications, Identification, InsertIdentification,
  stats
} from "@shared/schema";

// Interface for all storage operations needed for the BioScout app
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Observation operations
  getObservation(id: number): Promise<Observation | undefined>;
  getAllObservations(limit?: number, offset?: number): Promise<Observation[]>;
  getObservationsByType(type: string): Promise<Observation[]>;
  searchObservations(query: string): Promise<Observation[]>;
  createObservation(observation: InsertObservation): Promise<Observation>;
  updateObservation(id: number, observation: Partial<Observation>): Promise<Observation | undefined>;
  deleteObservation(id: number): Promise<boolean>;

  // Question operations
  getQuestion(id: number): Promise<Question | undefined>;
  getAllQuestions(): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // Species identification operations
  getIdentification(id: number): Promise<Identification | undefined>;
  getIdentificationByObservation(observationId: number): Promise<Identification | undefined>;
  createIdentification(identification: InsertIdentification): Promise<Identification>;

  // Stats operations
  getStats(): Promise<any>;
  updateStats(updates: any): Promise<any>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private observations: Map<number, Observation>;
  private questions: Map<number, Question>;
  private identifications: Map<number, Identification>;
  private appStats: any;
  
  private userCurrentId: number;
  private observationCurrentId: number;
  private questionCurrentId: number;
  private identificationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.observations = new Map();
    this.questions = new Map();
    this.identifications = new Map();
    
    this.userCurrentId = 1;
    this.observationCurrentId = 1;
    this.questionCurrentId = 1;
    this.identificationCurrentId = 1;

    // Initialize app stats
    this.appStats = {
      id: 1,
      totalObservations: 0,
      totalSpecies: 0,
      totalContributors: 0,
      totalProtectedSpecies: 0,
      lastUpdated: new Date()
    };
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      bio: insertUser.bio || null
    };
    this.users.set(id, user);
    return user;
  }

  // Observation operations
  async getObservation(id: number): Promise<Observation | undefined> {
    return this.observations.get(id);
  }

  async getAllObservations(limit?: number, offset?: number): Promise<Observation[]> {
    const observations = Array.from(this.observations.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (offset !== undefined && limit !== undefined) {
      return observations.slice(offset, offset + limit);
    }
    
    if (limit !== undefined) {
      return observations.slice(0, limit);
    }
    
    return observations;
  }

  async getObservationsByType(type: string): Promise<Observation[]> {
    return Array.from(this.observations.values())
      .filter(obs => obs.speciesType === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async searchObservations(query: string): Promise<Observation[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.observations.values())
      .filter(obs => 
        (obs.speciesName && obs.speciesName.toLowerCase().includes(lowerQuery)) ||
        (obs.scientificName && obs.scientificName.toLowerCase().includes(lowerQuery)) ||
        (obs.location && obs.location.toLowerCase().includes(lowerQuery)) ||
        (obs.notes && obs.notes.toLowerCase().includes(lowerQuery))
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createObservation(insertObservation: InsertObservation): Promise<Observation> {
    const id = this.observationCurrentId++;
    const observation: Observation = { 
      id, 
      verified: false, 
      rare: false,
      createdAt: new Date(),
      location: insertObservation.location,
      dateObserved: insertObservation.dateObserved,
      userId: insertObservation.userId || null,
      speciesName: insertObservation.speciesName || null,
      scientificName: insertObservation.scientificName || null,
      latitude: insertObservation.latitude || null,
      longitude: insertObservation.longitude || null,
      imageUrl: insertObservation.imageUrl || null,
      notes: insertObservation.notes || null,
      speciesType: insertObservation.speciesType || null
    };
    this.observations.set(id, observation);
    
    // Update stats
    this.appStats.totalObservations += 1;
    
    // Update species count if new species
    const existingSpecies = Array.from(this.observations.values())
      .filter(obs => obs.id !== id)
      .some(obs => 
        (observation.scientificName && obs.scientificName === observation.scientificName) ||
        (observation.speciesName && obs.speciesName === observation.speciesName)
      );
      
    if (!existingSpecies && (observation.speciesName || observation.scientificName)) {
      this.appStats.totalSpecies += 1;
    }
    
    // Update contributors count if new user
    if (observation.userId) {
      const userHasObservations = Array.from(this.observations.values())
        .filter(obs => obs.id !== id)
        .some(obs => obs.userId === observation.userId);
        
      if (!userHasObservations) {
        this.appStats.totalContributors += 1;
      }
    }
    
    this.appStats.lastUpdated = new Date();
    
    return observation;
  }

  async updateObservation(id: number, updates: Partial<Observation>): Promise<Observation | undefined> {
    const observation = this.observations.get(id);
    if (!observation) return undefined;

    const updatedObservation = { ...observation, ...updates };
    this.observations.set(id, updatedObservation);
    return updatedObservation;
  }

  async deleteObservation(id: number): Promise<boolean> {
    return this.observations.delete(id);
  }

  // Question operations
  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.questionCurrentId++;
    const question: Question = { 
      ...insertQuestion, 
      id, 
      userId: insertQuestion.userId || null,
      imageUrl: insertQuestion.imageUrl || null,
      createdAt: new Date() 
    };
    this.questions.set(id, question);
    return question;
  }

  // Species identification operations
  async getIdentification(id: number): Promise<Identification | undefined> {
    return this.identifications.get(id);
  }

  async getIdentificationByObservation(observationId: number): Promise<Identification | undefined> {
    return Array.from(this.identifications.values())
      .find(identification => identification.observationId === observationId);
  }

  async createIdentification(insertIdentification: InsertIdentification): Promise<Identification> {
    const id = this.identificationCurrentId++;
    // Create identification with proper typing for results
    const identification: Identification = { 
      observationId: insertIdentification.observationId,
      results: insertIdentification.results as unknown,
      id, 
      createdAt: new Date(),
      selectedIdentification: insertIdentification.selectedIdentification || null 
    };
    this.identifications.set(id, identification);
    return identification;
  }

  // Stats operations
  async getStats(): Promise<any> {
    return this.appStats;
  }

  async updateStats(updates: any): Promise<any> {
    this.appStats = { ...this.appStats, ...updates, lastUpdated: new Date() };
    return this.appStats;
  }
}

export const storage = new MemStorage();
