import { PrismaClient } from '@prisma/client';

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
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    }).$extends({
        query: {
            $allModels: {
                async $allOperations({ operation, args, query }) {
                    // Automatic soft-delete filtering
                    if (
                        ['findMany', 'findFirst', 'findUnique', 'count', 'groupBy', 'aggregate'].includes(
                            operation
                        )
                    ) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (args as any).where = { ...(args as any).where, deletedAt: null };
                    }
                    return query(args);
                },
            },
        },
        model: {
            $allModels: {
                async softDelete(id: string) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const model = (this as any).name;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return (prisma as any)[model].update({
                        where: { id },
                        data: { deletedAt: new Date() },
                    });
                },
            },
        },
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
// export const prisma = {} as any; // DEBUG

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
