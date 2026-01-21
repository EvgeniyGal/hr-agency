import { prisma } from './prisma';

export async function logActivity(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    metadata: Record<string, unknown> = {}
) {
    return await prisma.activity.create({
        data: {
            userId,
            action,
            entityType,
            entityId,
            metadata,
        },
    });
}
