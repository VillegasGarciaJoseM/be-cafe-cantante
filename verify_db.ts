import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const artistCount = await prisma.artist.count();
    const lyricCount = await prisma.lyric.count();
    const paloCount = await prisma.palo.count();

    console.log(`Database Verification:`);
    console.log(`- Artists: ${artistCount}`);
    console.log(`- Palos: ${paloCount}`);
    console.log(`- Lyrics: ${lyricCount}`);

    if (lyricCount > 0) {
        const sample = await prisma.lyric.findFirst({
            include: { artist: true, palo: true }
        });
        console.log('\nSample Lyric:');
        console.log(`Title: ${sample?.title}`);
        console.log(`Artist: ${sample?.artist.name}`);
        console.log(`Palo: ${sample?.palo?.name}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
