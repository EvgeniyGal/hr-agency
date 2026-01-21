'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isManager } from '@/lib/rbac';
import * as z from 'zod';

const clientSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    industry: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    description: z.string().optional(),
});

export async function createClient(data: z.infer<typeof clientSchema>) {
    const session = await getServerSession(authOptions);
    if (!isManager(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    const validated = clientSchema.parse(data);

    const client = await prisma.client.create({
        data: validated,
    });

    revalidatePath('/dashboard/clients');
    return client;
}

export async function updateClient(id: string, data: z.infer<typeof clientSchema>) {
    const session = await getServerSession(authOptions);
    if (!isManager(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    const validated = clientSchema.parse(data);

    const client = await prisma.client.update({
        where: { id },
        data: validated,
    });

    revalidatePath('/dashboard/clients');
    revalidatePath(`/dashboard/clients/${id}`);
    return client;
}

export async function deleteClient(id: string) {
    const session = await getServerSession(authOptions);
    if (!isManager(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    // Soft delete
    const client = await prisma.client.update({
        where: { id },
        data: { deletedAt: new Date() },
    });

    revalidatePath('/dashboard/clients');
    return client;
}
