import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Lyrics
 *   description: Lyrics management
 */

/**
 * @swagger
 * /api/lyrics:
 *   get:
 *     summary: Get lyrics with pagination and filtering
 *     tags: [Lyrics]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title or content
 *       - in: query
 *         name: palo
 *         schema:
 *           type: string
 *         description: Filter by Palo name (e.g., "Bulerías")
 *     responses:
 *       200:
 *         description: List of lyrics
 */
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const palo = req.query.palo as string;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (palo) {
            where.palo = {
                name: { contains: palo, mode: 'insensitive' }
            };
        }

        const [lyrics, total] = await prisma.$transaction([
            prisma.lyric.findMany({
                skip,
                take: limit,
                where,
                include: { artist: true, palo: true },
                orderBy: { title: 'asc' }
            }),
            prisma.lyric.count({ where })
        ]);

        res.json({
            data: lyrics,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lyrics' });
    }
});

/**
 * @swagger
 * /api/lyrics/{id}:
 *   get:
 *     summary: Get lyric by ID
 *     tags: [Lyrics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The lyric ID
 *     responses:
 *       200:
 *         description: The lyric details
 *       404:
 *         description: Lyric not found
 */
router.get('/:id', async (req, res) => {
    try {
        const lyric = await prisma.lyric.findUnique({
            where: { id: req.params.id },
            include: { artist: true, palo: true }
        });
        if (!lyric) {
            return res.status(404).json({ error: 'Lyric not found' });
        }
        res.json(lyric);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lyric' });
    }
});

export default router;
