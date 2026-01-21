import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
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

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
