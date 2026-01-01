import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Palos
 *   description: Flamenco styles management
 */

/**
 * @swagger
 * /api/palos:
 *   get:
 *     summary: Get all palos
 *     tags: [Palos]
 *     responses:
 *       200:
 *         description: List of all palos
 */
router.get('/', async (req, res) => {
    try {
        const palos = await prisma.palo.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { lyrics: true }
                }
            }
        });
        res.json(palos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch palos' });
    }
});

export default router;
