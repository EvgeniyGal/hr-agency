'use server';

import { prisma } from '@/lib/prisma';
import { uploadFile } from '@/lib/gcs';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function uploadCV(candidateId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Unauthorized');

    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    // Validate file
    if (file.size > 10 * 1024 * 1024) throw new Error('File size exceeds 10MB');
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        throw new Error('Invalid file type. Only PDF and DOCX are allowed.');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const gcsFileName = `cvs/${candidateId}/${Date.now()}-${file.name}`;
    const gcsUrl = await uploadFile(buffer, gcsFileName, file.type);

    const cv = await prisma.cV.create({
        data: {
            candidateId,
            fileName: file.name,
            gcsUrl, // In a real app, you might store the gcsFileName and generate signed URLs on the fly
            fileSize: file.size,
        },
    });

    revalidatePath(`/dashboard/candidates/${candidateId}`);
    return cv;
}

export async function deleteCV(cvId: string, candidateId: string) {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Unauthorized');

    await prisma.cV.update({
        where: { id: cvId },
        data: { deletedAt: new Date() },
    });

    revalidatePath(`/dashboard/candidates/${candidateId}`);
}
