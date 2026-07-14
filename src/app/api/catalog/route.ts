import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { SEED_PRODUCTS } from '@/data/products';
import { SEED_SHOWCASE, SEED_COLLECTIONS, SEED_BTS, SEED_INSTAGRAM } from '@/data/content';

export const dynamic = 'force-dynamic';

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    let data = await redis.get('catalog');
    if (!data) {
      // Fallback seed data if database is empty
      data = {
        products: SEED_PRODUCTS,
        showcaseItems: SEED_SHOWCASE,
        collectionItems: SEED_COLLECTIONS,
        behindScenesImages: SEED_BTS,
        instagramPosts: SEED_INSTAGRAM
      };
      await redis.set('catalog', data);
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Failed to read from Upstash Redis:', error);
    return NextResponse.json({ error: 'Failed to read from database', details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    await redis.set('catalog', data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to write to Upstash Redis:', error);
    return NextResponse.json({ error: 'Failed to write to database', details: error.message }, { status: 500 });
  }
}
