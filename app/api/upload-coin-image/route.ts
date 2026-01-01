import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const iconName = formData.get('iconName') as string;

    if (!file || !iconName) {
      return NextResponse.json(
        { error: 'File and icon name are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/coins folder
    const filename = `${iconName}.png`;
    const filepath = path.join(process.cwd(), 'public', 'coins', filename);
    
    await writeFile(filepath, buffer);

    return NextResponse.json({ 
      success: true, 
      filename,
      message: 'Image uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
