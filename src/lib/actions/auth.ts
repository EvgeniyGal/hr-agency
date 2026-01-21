'use server';

import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations/auth';
import { UserRole } from '@prisma/client';

export async function register(formData: Record<string, string>) {
    const validatedFields = registerSchema.safeParse(formData);

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    const { email, password, name } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // First user is Owner, others are Managers by default
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? UserRole.OWNER : UserRole.MANAGER;

    try {
        await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role,
            },
        });

        return { success: 'User created' };
    } catch {
        return { error: 'Something went wrong' };
    }
}
