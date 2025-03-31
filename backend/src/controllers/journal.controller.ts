
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { 
  journalSchema, 
  journalUpdateSchema, 
  journalQuerySchema,
  toggleFavoriteSchema 
} from '../models/journal.model.js';
import { ApiError } from '../lib/errors.js';

export class JournalController {
  // Create a new journal
  static async create(req: Request, res: Response) {
    const validatedData = journalSchema.parse(req.body);
    
    const journal = await prisma.journal.create({
      data: {
        ...validatedData,
        userId: req.user.id, // From auth middleware
      },
    });

    res.status(201).json(journal);
  }

  // Get all journals with pagination and filtering
  static async getAll(req: Request, res: Response) {
    const { page, limit, category, search, favorite, mood, tags } = journalQuerySchema.parse(req.query);
    
    const where: any = {
      userId: req.user.id,
      ...(category && { category }),
      ...(favorite !== undefined && { isFavorite: favorite }),
      ...(mood && { mood }),
      ...(tags && { tags: { hasSome: tags } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

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
  }

  // Get a single journal by ID
  static async getOne(req: Request, res: Response) {
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
  }

  // Update a journal
  static async update(req: Request, res: Response) {
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

    // Using an explicit type cast to avoid TypeScript errors
    const updatedJournal = await prisma.journal.update({
      where: { id: req.params.id },
      data: validatedData as any,
    });

    res.json(updatedJournal);
  }

  // Toggle favorite status
  static async toggleFavorite(req: Request, res: Response) {
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
  }

  // Get journal stats
  static async getStats(req: Request, res: Response) {
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

    res.json({
      totalEntries: totalCount,
      favoriteEntries: favoriteCount,
      categories: categoryStats,
      moods: moodStats,
      recentActivity,
    });
  }

  // Delete a journal
  static async delete(req: Request, res: Response) {
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
  }
}
