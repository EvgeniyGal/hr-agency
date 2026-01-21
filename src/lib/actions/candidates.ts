'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isManager } from '@/lib/rbac';
import { CandidateStatus } from '@prisma/client';
import * as z from 'zod';

const candidateSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    status: z.nativeEnum(CandidateStatus),
    skills: z.array(z.string()).optional(),
});

export async function createCandidate(data: z.infer<typeof candidateSchema>) {
    const session = await getServerSession(authOptions);
    if (!isManager(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    const validated = candidateSchema.parse(data);

    const candidate = await prisma.candidate.create({
        data: validated,
    });

    revalidatePath('/dashboard/candidates');
    return candidate;
}

export async function updateCandidate(id: string, data: z.infer<typeof candidateSchema>) {
    const session = await getServerSession(authOptions);
    if (!isManager(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    const validated = candidateSchema.parse(data);

    const candidate = await prisma.candidate.update({
        where: { id },
        data: validated,
    });

    revalidatePath('/dashboard/candidates');
    revalidatePath(`/dashboard/candidates/${id}`);
    return candidate;
}

export async function deleteCandidate(id: string) {
    const session = await getServerSession(authOptions);
    if (!isManager(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    const candidate = await prisma.candidate.update({
        where: { id },
        data: { deletedAt: new Date() },
    });

    revalidatePath('/dashboard/candidates');
    return candidate;
}

export async function updateCandidateStatus(id: string, status: CandidateStatus) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Unauthorized');

    const candidate = await prisma.candidate.update({
        where: { id },
        data: { status },
    });

    revalidatePath('/dashboard/candidates');
    return candidate;
}
