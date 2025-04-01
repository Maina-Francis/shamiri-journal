import { z } from 'zod';

// Zod schema for validation
export const journalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  category: z.string().optional(),
  userId: z.string().uuid().optional(),
  isFavorite: z.boolean().optional().default(false),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  aiInsights: z.any().optional(),
});

export type Journal = z.infer<typeof journalSchema>;

// Zod schema for updating journal
export const journalUpdateSchema = journalSchema.partial();

// Toggle favorite schema
export const toggleFavoriteSchema = z.object({
  isFavorite: z.boolean(),
});

// Query params schema for filtering and pagination
export const journalQuerySchema = z.object({
  page: z.string().optional().transform(Number).default('1'),
  limit: z.string().optional().transform(Number).default('10'),
  category: z.string().optional(),
  search: z.string().optional(),
  favorite: z.string().optional().transform(val => val === 'true'),
  mood: z.string().optional(),
  tags: z.string().optional().transform(val => val ? val.split(',') : undefined),
});

export type JournalQuery = z.infer<typeof journalQuerySchema>;
