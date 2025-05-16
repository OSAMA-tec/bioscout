import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull().unique(),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  email: true,
  bio: true,
});

// Observation model
export const observations = pgTable("observations", {
  id: serial("id").primaryKey(),
  speciesName: text("species_name"),
  scientificName: text("scientific_name"),
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  dateObserved: timestamp("date_observed").notNull(),
  imageUrl: text("image_url"),
  notes: text("notes"),
  userId: integer("user_id"),
  verified: boolean("verified").default(false),
  rare: boolean("rare").default(false),
  speciesType: text("species_type"), // bird, mammal, plant, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertObservationSchema = createInsertSchema(observations).pick({
  speciesName: true,
  scientificName: true,
  location: true,
  latitude: true,
  longitude: true,
  dateObserved: true,
  imageUrl: true,
  notes: true,
  userId: true,
  speciesType: true,
});

// Question and answers for RAG
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  userId: integer("user_id"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  question: true,
  answer: true,
  userId: true,
  imageUrl: true,
});

// Species identification results
export const identifications = pgTable("identifications", {
  id: serial("id").primaryKey(),
  observationId: integer("observation_id").notNull(),
  results: json("results").notNull(), // Store the AI identification results
  selectedIdentification: text("selected_identification"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertIdentificationSchema = createInsertSchema(identifications).pick({
  observationId: true,
  results: true,
  selectedIdentification: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Observation = typeof observations.$inferSelect;
export type InsertObservation = z.infer<typeof insertObservationSchema>;

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type Identification = typeof identifications.$inferSelect;
export type InsertIdentification = z.infer<typeof insertIdentificationSchema>;

// Stats model for app statistics (total observations, species, users, etc.)
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  totalObservations: integer("total_observations").default(0),
  totalSpecies: integer("total_species").default(0),
  totalContributors: integer("total_contributors").default(0),
  totalProtectedSpecies: integer("total_protected_species").default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});
