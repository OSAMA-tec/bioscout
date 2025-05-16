import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { insertObservationSchema, insertQuestionSchema, insertIdentificationSchema } from "@shared/schema";
import { identifySpecies } from "./ai/speciesIdentification";
import { askQuestion } from "./ai/ragSystem";
import { sampleObservations } from "./data/sampleObservations";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.') as any);
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Ensure uploads directory exists
  const uploadPath = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  // Serve uploaded files
  app.use("/uploads", express.static(uploadPath));

  // Initialize sample data
  await initializeSampleData();

  // API Routes
  // Get stats
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch stats", error: error?.message || "Unknown error" });
    }
  });

  // Get all observations
  app.get("/api/observations", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
      const observations = await storage.getAllObservations(limit, offset);
      res.json(observations);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch observations", error: error?.message || "Unknown error" });
    }
  });

  // Get observations by type
  app.get("/api/observations/type/:type", async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      const observations = await storage.getObservationsByType(type);
      res.json(observations);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch observations by type", error: error?.message || "Unknown error" });
    }
  });

  // Search observations
  app.get("/api/observations/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const observations = await storage.searchObservations(query);
      res.json(observations);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to search observations", error: error?.message || "Unknown error" });
    }
  });

  // Get a single observation
  app.get("/api/observations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const observation = await storage.getObservation(id);
      
      if (!observation) {
        return res.status(404).json({ message: "Observation not found" });
      }
      
      res.json(observation);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch observation", error: error?.message || "Unknown error" });
    }
  });

  // Create an observation
  app.post("/api/observations", upload.single("image"), async (req: Request, res: Response) => {
    try {
      // Get file path if an image was uploaded
      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      // Parse and validate the observation data
      const observationData = {
        ...req.body,
        imageUrl,
        dateObserved: new Date(req.body.dateObserved)
      };

      // Create the observation
      const validatedData = insertObservationSchema.parse(observationData);
      const observation = await storage.createObservation(validatedData);
      
      res.status(201).json(observation);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid observation data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create observation", error: error?.message || "Unknown error" });
    }
  });

  // Update an observation
  app.patch("/api/observations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedObservation = await storage.updateObservation(id, updates);
      
      if (!updatedObservation) {
        return res.status(404).json({ message: "Observation not found" });
      }
      
      res.json(updatedObservation);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update observation", error: error?.message || "Unknown error" });
    }
  });

  // Delete an observation
  app.delete("/api/observations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteObservation(id);
      
      if (!success) {
        return res.status(404).json({ message: "Observation not found" });
      }
      
      res.json({ message: "Observation deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete observation", error: error?.message || "Unknown error" });
    }
  });

  // Identify species in an image
  app.post("/api/identify", upload.single("image"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const imagePath = req.file.path;
      const results = await identifySpecies(imagePath);
      
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to identify species", error: error?.message || "Unknown error" });
    }
  });

  // Save identification results
  app.post("/api/identifications", async (req: Request, res: Response) => {
    try {
      const validatedData = insertIdentificationSchema.parse(req.body);
      const identification = await storage.createIdentification(validatedData);
      
      res.status(201).json(identification);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid identification data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save identification", error: error?.message || "Unknown error" });
    }
  });

  // Get identification for an observation
  app.get("/api/identifications/observation/:observationId", async (req: Request, res: Response) => {
    try {
      const observationId = parseInt(req.params.observationId);
      const identification = await storage.getIdentificationByObservation(observationId);
      
      if (!identification) {
        return res.status(404).json({ message: "Identification not found" });
      }
      
      res.json(identification);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch identification", error: error?.message || "Unknown error" });
    }
  });

  // Ask a question to the RAG system
  app.post("/api/ask", async (req: Request, res: Response) => {
    try {
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }
      
      const answer = await askQuestion(question);
      
      // Store the Q&A
      const qaData = {
        question,
        answer,
        userId: req.body.userId
      };
      
      const validatedData = insertQuestionSchema.parse(qaData);
      const savedQA = await storage.createQuestion(validatedData);
      
      res.json(savedQA);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to process question", error: error?.message || "Unknown error" });
    }
  });

  // Get all questions
  app.get("/api/questions", async (req: Request, res: Response) => {
    try {
      const questions = await storage.getAllQuestions();
      res.json(questions);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch questions", error: error?.message || "Unknown error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Initialize sample data
async function initializeSampleData() {
  const stats = await storage.getStats();
  
  // Only add sample data if there are no observations yet
  if (stats.totalObservations === 0) {
    for (const observation of sampleObservations) {
      await storage.createObservation(observation);
    }
    
    console.log("Sample data initialized successfully");
  }
}

import express from "express";
