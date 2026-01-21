'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isOwner } from '@/lib/rbac';
import { revalidatePath } from 'next/cache';
import { UserRole } from '@prisma/client';

export async function getUsers() {
    const session = await getServerSession(authOptions);
    if (!isOwner(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    return await prisma.user.findMany({
        where: { deletedAt: null },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function updateUserRole(userId: string, role: UserRole) {
    const session = await getServerSession(authOptions);
    if (!isOwner(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
    });

    revalidatePath('/dashboard/settings');
    return user;
}

export async function deleteUser(userId: string) {
    const session = await getServerSession(authOptions);
    if (!isOwner(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    // First check if it's the current user
    if (userId === session.user.id) {
        throw new Error('Cannot delete yourself');
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
    });

    revalidatePath('/dashboard/settings');
    return user;
}
