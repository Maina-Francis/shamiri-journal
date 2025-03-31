
import { Router } from 'express';
import { JournalController } from '../controllers/journal.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../lib/async-handler';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Journal routes
router.post('/', asyncHandler(JournalController.create));
router.get('/', asyncHandler(JournalController.getAll));
router.get('/stats', asyncHandler(JournalController.getStats));
router.get('/:id', asyncHandler(JournalController.getOne));
router.put('/:id', asyncHandler(JournalController.update));
router.patch('/:id/favorite', asyncHandler(JournalController.toggleFavorite));
router.delete('/:id', asyncHandler(JournalController.delete));

export default router;
