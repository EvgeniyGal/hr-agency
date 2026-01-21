import { PrismaClient, UserRole, JobStatus, CandidateStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Owner
    const hashedOwnerPassword = await bcrypt.hash('owner123', 10);
    await prisma.user.upsert({
        where: { email: 'owner@hragency.com' },
        update: {},
        create: {
            email: 'owner@hragency.com',
            name: 'Agency Owner',
            password: hashedOwnerPassword,
            role: UserRole.OWNER,
        },
    });

    // Create Manager
    const hashedManagerPassword = await bcrypt.hash('manager123', 10);
    await prisma.user.upsert({
        where: { email: 'manager@hragency.com' },
        update: {},
        create: {
            email: 'manager@hragency.com',
            name: 'Recruitment Manager',
            password: hashedManagerPassword,
            role: UserRole.MANAGER,
        },
    });

    // Create Admin
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@hragency.com' },
        update: {},
        create: {
            email: 'admin@hragency.com',
            name: 'System Admin',
            password: hashedAdminPassword,
            role: UserRole.ADMIN,
        },
    });

    // Create Client
    const client = await prisma.client.create({
        data: {
            name: 'Tech Corp',
            industry: 'Technology',
            description: 'A leading tech company.',
            email: 'info@techcorp.com',
        },
    });

    // Create Job
    const job = await prisma.job.create({
        data: {
            title: 'Senior Frontend Developer',
            description: 'We are looking for an experienced React developer.',
            requirements: '- 5+ years React experience\n- Next.js knowledge',
            status: JobStatus.OPEN,
            clientId: client.id,
        },
    });

    // Create Candidate
    const candidate = await prisma.candidate.create({
        data: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            status: CandidateStatus.INTERVIEWING,
            skills: ['React', 'Next.js', 'TypeScript'],
        },
    });

    // Create Application
    await prisma.application.create({
        data: {
            jobId: job.id,
            candidateId: candidate.id,
            status: 'INTERVIEW',
            notes: 'Strong candidate with relevant experience.',
        },
    });

    console.log('Seeding finished!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
