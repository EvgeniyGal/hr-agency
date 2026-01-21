import { Storage } from '@google-cloud/storage';

const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
});

export const bucket = storage.bucket(process.env.GCS_BUCKET_NAME || '');

export async function getSignedUrl(fileName: string) {
    const file = bucket.file(fileName);
    const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    return url;
}

export async function uploadFile(buffer: Buffer, fileName: string, contentType: string) {
    const file = bucket.file(fileName);
    await file.save(buffer, {
        metadata: { contentType },
    });
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

export async function deleteFile(fileName: string) {
    const file = bucket.file(fileName);
    await file.delete();
}
