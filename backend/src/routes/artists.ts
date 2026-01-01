import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Artists
 *   description: Artist management
 */

/**
 * @swagger
 * /api/artists:
 *   get:
 *     summary: Get all artists
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: List of all artists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   slug:
 *                     type: string
 */
router.get('/', async (req, res) => {
    try {
        const artists = await prisma.artist.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(artists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch artists' });
    }
});

/**
 * @swagger
 * /api/artists/{slug}:
 *   get:
 *     summary: Get artist by slug
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The artist slug
 *     responses:
 *       200:
 *         description: The artist details
 *       404:
 *         description: Artist not found
 */
router.get('/:slug', async (req, res) => {
    try {
        const artist = await prisma.artist.findUnique({
            where: { slug: req.params.slug },
            include: { lyrics: true }
        });
        if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
        }
        res.json(artist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch artist' });
    }
});

export default router;
