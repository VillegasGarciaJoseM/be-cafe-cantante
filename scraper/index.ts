import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TARGET_URL = 'https://canteytoque.es/letrastodas.htm';

interface Artist {
    name: string;
    slug: string;
}

interface Song {
    title: string;
    palo: string | null;
    content: string[];
    artistSlug?: string;
}

// Helper to create slugs
function slugify(text: string): string {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function main() {
    console.log('Starting scraper...');
    try {
        const response = await axios.get(TARGET_URL);
        const $ = cheerio.load(response.data);

        console.log('Page loaded. Parsing content...');

        let currentArtist: Artist | null = null;
        let currentSong: Song | null = null;

        const artists: Artist[] = [];
        const songs: Song[] = [];

        // Iterate over all <p> tags in the body
        $('body > p').each((index, element) => {
            const $el = $(element);
            const style = $el.attr('style') || '';
            const text = $el.text().trim();

            if (!text) return;

            // Detect Artist Header: font-weight:bold;font-size:1.5em
            if (style.includes('font-size:1.5em') || (style.includes('font-weight:bold') && text.length < 50 && !text.match(/^\d+\./))) {
                // Save previous song if exists
                if (currentSong && currentArtist) {
                    const song = currentSong as Song;
                    const artist = currentArtist as Artist;
                    songs.push({ ...song, artistSlug: artist.slug });
                    currentSong = null;
                }

                const name = text.replace('Flamenco vivo.', '').trim();
                currentArtist = {
                    name,
                    slug: slugify(name)
                };
                artists.push(currentArtist);
                console.log(`Found Artist: ${name}`);
                return;
            }

            // Detect Song Title: font: bold .8em verdana or starts with number
            // Example: "1. Un tiro al aire (alegrías)"
            // Exclude the index list which contains newlines
            if ((style.includes('font: bold') || style.includes('font:bold') || text.match(/^\d+\./)) && !text.includes('\n')) {
                // Save previous song
                if (currentSong && currentArtist) {
                    const song = currentSong as Song;
                    const artist = currentArtist as Artist;
                    songs.push({ ...song, artistSlug: artist.slug });
                }

                // Parse Title and Palo
                // "1. Un tiro al aire (alegrías)" -> Title: "Un tiro al aire", Palo: "alegrías"
                let title = text.replace(/^\d+\.\s*/, '').trim();
                let palo = null;

                const paloMatch = title.match(/\((.*?)\)$/);
                if (paloMatch) {
                    palo = paloMatch[1];
                    title = title.replace(/\s*\(.*?\)$/, '').trim();
                }

                currentSong = {
                    title,
                    palo,
                    content: []
                };
                // console.log(`  Found Song: ${title} (${palo})`);
                return;
            }

            // If we have a current song, this must be lyrics
            if (currentSong) {
                // Replace <br> with newlines for content
                const html = $el.html() || '';
                const lines = html.split(/<br\s*\/?>/i).map(l => $(`<div>${l}</div>`).text().trim()).filter(l => l);
                (currentSong as Song).content.push(...lines);
            }
        });

        // Save last song
        if (currentSong && currentArtist) {
            const song = currentSong as Song;
            const artist = currentArtist as Artist;
            songs.push({ ...song, artistSlug: artist.slug });
        }

        console.log(`Parsed ${artists.length} artists and ${songs.length} songs.`);

        // Preview first few items
        if (artists.length > 0) console.log('First artist:', artists[0]);
        if (songs.length > 0) console.log('First song:', songs[0]);

        console.log('Inserting data into database...');
        for (const artist of artists) {
            const dbArtist = await prisma.artist.upsert({
                where: { slug: artist.slug },
                update: {},
                create: artist,
            });

            const artistSongs = songs.filter(s => s.artistSlug === artist.slug);
            for (const song of artistSongs) {
                let paloId = null;
                if (song.palo) {
                    const dbPalo = await prisma.palo.upsert({
                        where: { name: song.palo },
                        update: {},
                        create: { name: song.palo, description: '' },
                    });
                    paloId = dbPalo.id;
                }

                await prisma.lyric.create({
                    data: {
                        title: song.title,
                        content: song.content.join('\n'),
                        artistId: dbArtist.id,
                        paloId: paloId,
                        sourceUrl: TARGET_URL
                    }
                });
            }
        }
        console.log('Database population complete.');

    } catch (error) {
        console.error('Error scraping:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
