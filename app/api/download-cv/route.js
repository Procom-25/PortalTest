import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = 'procom-job-portal-storage';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get('url');

        if (!url) {
            return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
        }

        // Extract the key from the S3 URL
        const s3Url = new URL(url);
        const key = decodeURIComponent(s3Url.pathname.substring(1)); // Remove leading slash

        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key
        });

        const response = await s3Client.send(command);
        const arrayBuffer = await response.Body.transformToByteArray();
        
        // Get the content type from the S3 object metadata
        const contentType = response.ContentType || 'application/pdf';
        
        // Create response with appropriate headers for viewing in browser
        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': 'inline', // Changed to inline for viewing in browser
            },
        });

    } catch (error) {
        console.error('Error downloading file:', error);
        return NextResponse.json(
            { error: 'Error downloading file' },
            { status: 500 }
        );
    }
}
