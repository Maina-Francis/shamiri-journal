
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { 
  journalSchema, 
  journalUpdateSchema, 
  journalQuerySchema,
  toggleFavoriteSchema 
} from '../models/journal.model.js';
import { ApiError } from '../lib/errors.js';
import { AIService } from '../services/AIService.js';

export class JournalController {
  // Create a new journal
  static async create(req: Request, res: Response) {
    try {
      const validatedData = journalSchema.parse(req.body);
      
      // Process content with AI to extract mood and tags
      const [mood, tags] = await Promise.all([
        AIService.analyzeMood(validatedData.content),
        AIService.generateTags(validatedData.content)
      ]);
      
      const journal = await prisma.journal.create({
        data: {
          ...validatedData,
          userId: req.user.id,
          mood,
          tags,
        } as any,
      });

      res.status(201).json(journal);
    } catch (error) {
      console.error("Error creating journal:", error);
      throw error;
    }
  }

  // Get all journals with pagination and filtering
  static async getAll(req: Request, res: Response) {
    try {
      const { page, limit, category, search, favorite, mood, tags } = journalQuerySchema.parse(req.query);
      
      // Use explicit any type to avoid TypeScript errors with Prisma
      const where: any = {
        userId: req.user.id,
      };
      
      if (category) where.category = category;
      if (favorite !== undefined) where.isFavorite = favorite;
      if (mood) where.mood = mood;
      if (tags && Array.isArray(tags)) where.tags = { hasSome: tags };
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [journals, total] = await Promise.all([
        prisma.journal.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.journal.count({ where }),
      ]);

      res.json({
        data: journals,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error in getAll journals:', error);
      throw error;
    }
  }

  // Get a single journal by ID
  static async getOne(req: Request, res: Response) {
    try {
      const journal = await prisma.journal.findUnique({
        where: { id: req.params.id },
      });

      if (!journal) {
        throw new ApiError(404, 'Journal not found');
      }

      // Check if user owns the journal
      if (journal.userId !== req.user.id) {
        throw new ApiError(403, 'Unauthorized access to journal');
      }

      res.json(journal);
    } catch (error) {
      console.error('Error in getOne journal:', error);
      throw error;
    }
  }

  // Update a journal
  static async update(req: Request, res: Response) {
    try {
      const validatedData = journalUpdateSchema.parse(req.body);
      
      const journal = await prisma.journal.findUnique({
        where: { id: req.params.id },
      });

      if (!journal) {
        throw new ApiError(404, 'Journal not found');
      }

      // Check if user owns the journal
      if (journal.userId !== req.user.id) {
        throw new ApiError(403, 'Unauthorized access to journal');
      }

      // If content has changed, re-analyze for mood and tags
      let updateData: any = { ...validatedData };
      
      if (validatedData.content && validatedData.content !== journal.content) {
        const [mood, tags] = await Promise.all([
          AIService.analyzeMood(validatedData.content),
          AIService.generateTags(validatedData.content)
        ]);
        
        updateData.mood = mood;
        updateData.tags = tags;
      }

      // Using an explicit type cast to avoid TypeScript errors
      const updatedJournal = await prisma.journal.update({
        where: { id: req.params.id },
        data: updateData,
      });

      res.json(updatedJournal);
    } catch (error) {
      console.error('Error updating journal:', error);
      throw error;
    }
  }

  // Toggle favorite status
  static async toggleFavorite(req: Request, res: Response) {
    try {
      const { isFavorite } = toggleFavoriteSchema.parse(req.body);
      
      const journal = await prisma.journal.findUnique({
        where: { id: req.params.id },
      });

      if (!journal) {
        throw new ApiError(404, 'Journal not found');
      }

      // Check if user owns the journal
      if (journal.userId !== req.user.id) {
        throw new ApiError(403, 'Unauthorized access to journal');
      }

      // Using an explicit type cast to avoid TypeScript errors
      const updatedJournal = await prisma.journal.update({
        where: { id: req.params.id },
        data: { isFavorite } as any,
      });

      res.json(updatedJournal);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  // Get journal stats
  static async getStats(req: Request, res: Response) {
    try {
      const userId = req.user.id;

      const [totalCount, favoriteCount, categoryStats, moodStats, recentActivity] = await Promise.all([
        // Total count
        prisma.journal.count({
          where: { userId },
        }),
        
        // Favorite count
        prisma.journal.count({
          where: { 
            userId,
            isFavorite: true,
          } as any,
        }),
        
        // Categories with counts
        prisma.$queryRaw`
          SELECT 
            "category",
            COUNT(*) as count
          FROM "Journal"
          WHERE 
            "userId" = ${userId}
            AND "category" IS NOT NULL
          GROUP BY "category"
          ORDER BY count DESC
          LIMIT 5
        `,
        
        // Mood distribution
        prisma.$queryRaw`
          SELECT 
            "mood",
            COUNT(*) as count
          FROM "Journal"
          WHERE 
            "userId" = ${userId}
            AND "mood" IS NOT NULL
          GROUP BY "mood"
        `,
        
        // Recent activity (entries per day for the last 7 days)
        prisma.$queryRaw`
          SELECT 
            DATE("createdAt") as date, 
            COUNT(*) as count
          FROM "Journal"
          WHERE 
            "userId" = ${userId}
            AND "createdAt" >= NOW() - INTERVAL '7 days'
          GROUP BY DATE("createdAt")
          ORDER BY date DESC
        `,
      ]);

      // Get AI insights
      const insights = await AIService.generateInsights(userId);

      res.json({
        totalEntries: totalCount,
        favoriteEntries: favoriteCount,
        categories: categoryStats,
        moods: moodStats,
        recentActivity,
        insights
      });
    } catch (error) {
      console.error('Error in getStats:', error);
      throw error;
    }
  }

  // Delete a journal
  static async delete(req: Request, res: Response) {
    try {
      const journal = await prisma.journal.findUnique({
        where: { id: req.params.id },
      });

      if (!journal) {
        throw new ApiError(404, 'Journal not found');
      }

      // Check if user owns the journal
      if (journal.userId !== req.user.id) {
        throw new ApiError(403, 'Unauthorized access to journal');
      }

      await prisma.journal.delete({
        where: { id: req.params.id },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting journal:', error);
      throw error;
    }
  }
}
