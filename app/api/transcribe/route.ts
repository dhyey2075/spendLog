import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
            return NextResponse.json({ error: 'Invalid content type, expected multipart/form-data' }, { status: 400 });
        }

        const formData = await request.formData();
        const audioFile = formData.get('audio') as Blob;
    
        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }
    
        // Process the audio file (e.g., save to database, transcribe, etc.)
        // For demonstration, we will just log the file size
        console.log(`Received audio file of size: ${audioFile.size} bytes`);
    
        // Here you would typically handle the audio file, e.g., save it or process it
        // For now, we just return a success response
        return NextResponse.json({ message: 'Audio file received successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error processing audio file:', error);
        return NextResponse.json({ error: 'Failed to process audio file' }, { status: 500 });
    }
}