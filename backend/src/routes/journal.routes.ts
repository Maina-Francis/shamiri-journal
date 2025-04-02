import { Router } from 'express';
import { JournalController } from '../controllers/journal.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { journalSchema, journalUpdateSchema, journalQuerySchema, toggleFavoriteSchema } from '../models/journal.model.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../lib/async-handler.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /journals:
 *   post:
 *     summary: Create a new journal entry
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               content:
 *                 type: string
 *                 minLength: 1
 *               category:
 *                 type: string
 *               mood:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Journal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Journal'
 *       400:
 *         description: Bad request
 *         $ref: '#/components/responses/Error'
 */
router.post('/', validate(journalSchema), asyncHandler(JournalController.create));

/**
 * @swagger
 * /journals:
 *   get:
 *     summary: Get all journal entries with pagination and filtering
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: favorite
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: mood
 *         schema:
 *           type: string
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of journal entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Journal'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
router.get('/', validate(journalQuerySchema), asyncHandler(JournalController.getAll));

/**
 * @swagger
 * /journals/all:
 *   get:
 *     summary: Get all journal entries for insights (no pagination)
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of journal entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Journal'
 */
router.get('/all', asyncHandler(JournalController.getAllForInsights));

/**
 * @swagger
 * /journals/stats:
 *   get:
 *     summary: Get journal statistics
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Journal statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEntries:
 *                   type: integer
 *                 favoriteEntries:
 *                   type: integer
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 moods:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 recentActivity:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: integer
 *                 insights:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: string
 *                     topTopics:
 *                       type: array
 *                       items:
 *                         type: string
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: string
 *                     moodTrend:
 *                       type: string
 */
router.get('/stats', asyncHandler(JournalController.getStats));

/**
 * @swagger
 * /journals/{id}:
 *   get:
 *     summary: Get a single journal entry by ID
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Journal entry details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journal'
 *       404:
 *         description: Journal not found
 *         $ref: '#/components/responses/Error'
 */
router.get('/:id', asyncHandler(JournalController.getOne));

/**
 * @swagger
 * /journals/{id}:
 *   put:
 *     summary: Update a journal entry
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Journal'
 *     responses:
 *       200:
 *         description: Journal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Journal'
 *       404:
 *         description: Journal not found
 *         $ref: '#/components/responses/Error'
 */
router.put('/:id', validate(journalUpdateSchema), asyncHandler(JournalController.update));

/**
 * @swagger
 * /journals/{id}/favorite:
 *   patch:
 *     summary: Toggle favorite status of a journal entry
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isFavorite
 *             properties:
 *               isFavorite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Favorite status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 isFavorite:
 *                   type: boolean
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Journal not found
 *         $ref: '#/components/responses/Error'
 */
router.patch('/:id/favorite', asyncHandler(JournalController.toggleFavorite));

/**
 * @swagger
 * /journals/{id}:
 *   delete:
 *     summary: Delete a journal entry
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Journal deleted successfully
 *       404:
 *         description: Journal not found
 *         $ref: '#/components/responses/Error'
 */
router.delete('/:id', asyncHandler(JournalController.delete));

export default router;
