'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadFile } from '@/lib/gcs';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function uploadAvatar(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error('Not authenticated');
    }

    const file = formData.get('avatar') as File;
    if (!file) {
        throw new Error('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
    }

    // Validate size (max 2MB for avatars)
    if (file.size > 2 * 1024 * 1024) {
        throw new Error('Image must be less than 2MB');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `avatars/${session.user.id}-${Date.now()}-${file.name}`;

    const publicUrl = await uploadFile(buffer, fileName, file.type);

    await prisma.user.update({
        where: { id: session.user.id },
        data: { image: publicUrl },
    });

    revalidatePath('/dashboard/settings');
    return { url: publicUrl };
}
