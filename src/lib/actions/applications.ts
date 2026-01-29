'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isManager } from '@/lib/rbac';
import { ApplicationStatus } from '@prisma/client';
import * as z from 'zod';

const applicationSchema = z.object({
    jobId: z.string().min(1),
    candidateId: z.string().min(1),
    status: z.nativeEnum(ApplicationStatus).optional(),
    notes: z.string().optional(),
});

export async function createApplication(input: z.infer<typeof applicationSchema>) {
    const session = await getServerSession(authOptions);
    if (!isManager(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    const data = applicationSchema.parse(input);

    const job = await prisma.job.findUnique({ where: { id: data.jobId } });
    if (!job) throw new Error('Job not found');

    const application = await prisma.application.create({
        data: {
            ...data,
            status: data.status || ApplicationStatus.APPLIED,
        },
    });

    revalidatePath(`/jobs/${data.jobId}`);
    revalidatePath(`/candidates/${data.candidateId}`);
    return application;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
    const session = await getServerSession(authOptions);
    if (!isManager(session?.user?.role)) {
        throw new Error('Unauthorized');
    }

    const application = await prisma.application.update({
        where: { id },
        data: { status },
        include: { job: true, candidate: true }
    });

    revalidatePath(`/jobs/${application.jobId}`);
    revalidatePath(`/candidates/${application.candidateId}`);
    revalidatePath('/');
    return application;
}
