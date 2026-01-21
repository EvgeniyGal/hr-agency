import { prisma } from './src/lib/prisma';
console.log('Prisma imported');
async function main() {
    console.log('Running query...');
    try {
        // await prisma.$connect(); // Don't connect, just check init
        console.log('Done');
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
main();
