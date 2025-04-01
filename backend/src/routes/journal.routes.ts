import { Router } from 'express';
import { JournalController } from '../controllers/journal.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { journalSchema, journalUpdateSchema, journalQuerySchema, toggleFavoriteSchema } from '../models/journal.model.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../lib/async-handler.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create a new journal entry
router.post('/', validate(journalSchema), asyncHandler(JournalController.create));

// Get all journal entries with pagination and filtering
router.get('/', validate(journalQuerySchema), asyncHandler(JournalController.getAll));

// Get all journal entries (no pagination) for insights page
router.get('/all', asyncHandler(JournalController.getAllForInsights));

// Get journal statistics
router.get('/stats', asyncHandler(JournalController.getStats));

// Get a single journal entry by ID
router.get('/:id', asyncHandler(JournalController.getOne));

// Update a journal entry
router.put('/:id', validate(journalUpdateSchema), asyncHandler(JournalController.update));

// Toggle favorite status
router.patch('/:id/favorite', asyncHandler(JournalController.toggleFavorite));

// Delete a journal entry
router.delete('/:id', asyncHandler(JournalController.delete));

export default router;
