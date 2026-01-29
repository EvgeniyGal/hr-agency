import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
    if (process.env.IS_BUILD) {
        console.log('Using mock PrismaClient for build');
        return new Proxy({}, {
            get: (target, prop) => {
                if (prop === 'then') return undefined;
                return new Proxy({}, {
                    get: (t, method) => {
                        if (method === 'findUnique' || method === 'findFirst') return () => Promise.resolve(null);
                        return () => Promise.resolve([]);
                    }
                });
            }
        }) as unknown as PrismaClient;
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
