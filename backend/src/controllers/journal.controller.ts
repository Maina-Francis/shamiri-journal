import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { journalSchema, journalUpdateSchema, journalQuerySchema } from '../models/journal.model.js';
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
    const { page, limit, category, search } = journalQuerySchema.parse(req.query);
    
    const where = {
      userId: req.user.id,
      ...(category && { category }),
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

    const updatedJournal = await prisma.journal.update({
      where: { id: req.params.id },
      data: validatedData,
    });

    res.json(updatedJournal);
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