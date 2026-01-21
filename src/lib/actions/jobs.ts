'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isManager } from '@/lib/rbac';
import { JobStatus } from '@prisma/client';
import * as z from 'zod';

const jobSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    requirements: z.string().optional(),
    status: z.nativeEnum(JobStatus),
    clientId: z.string().min(1, 'Client is required'),
});

export async function createJob(data: z.infer<typeof jobSchema>) {
    const session = await getServerSession(authOptions);
    if (!isManager(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    const validated = jobSchema.parse(data);

    const job = await prisma.job.create({
        data: validated,
    });

    revalidatePath('/dashboard/jobs');
    revalidatePath(`/dashboard/clients/${validated.clientId}`);
    return job;
}

export async function updateJob(id: string, data: z.infer<typeof jobSchema>) {
    const session = await getServerSession(authOptions);
    if (!isManager(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    const validated = jobSchema.parse(data);

    const job = await prisma.job.update({
        where: { id },
        data: validated,
    });

    revalidatePath('/dashboard/jobs');
    revalidatePath(`/dashboard/jobs/${id}`);
    return job;
}

export async function deleteJob(id: string) {
    const session = await getServerSession(authOptions);
    if (!isManager(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    const job = await prisma.job.update({
        where: { id },
        data: { deletedAt: new Date() },
    });

    revalidatePath('/dashboard/jobs');
    return job;
}

export async function updateJobStatus(id: string, status: JobStatus) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Unauthorized');

    const job = await prisma.job.update({
        where: { id },
        data: { status },
    });

    revalidatePath('/dashboard/jobs');
    return job;
}
