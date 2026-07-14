import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const catalogFilePath = path.join(process.cwd(), 'src', 'data', 'catalog.json');

// Force dynamic so Next.js doesn't cache GET request response at build time
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const fileContent = await fs.readFile(catalogFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error reading catalog file:', error);
    return NextResponse.json(
      { error: 'Failed to load catalog data from server.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic structure validation
    if (
      !data ||
      !Array.isArray(data.products) ||
      !Array.isArray(data.showcaseItems) ||
      !Array.isArray(data.collectionItems) ||
      !Array.isArray(data.behindScenesImages) ||
      !Array.isArray(data.instagramPosts)
    ) {
      return NextResponse.json(
        { error: 'Invalid catalog data structure.' },
        { status: 400 }
      );
    }

    // Write to catalog.json
    await fs.writeFile(catalogFilePath, JSON.stringify(data, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error writing catalog file:', error);
    return NextResponse.json(
      { error: 'Failed to save catalog data to server.' },
      { status: 500 }
    );
  }
}
