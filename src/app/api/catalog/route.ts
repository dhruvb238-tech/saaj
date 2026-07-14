import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { SEED_PRODUCTS } from '@/data/products';
import { SEED_SHOWCASE, SEED_COLLECTIONS, SEED_BTS, SEED_INSTAGRAM } from '@/data/content';

export const dynamic = 'force-dynamic';

function getRedisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      `Missing Upstash environment variables. ` +
      `URL set: ${!!url}, Token set: ${!!token}. ` +
      `Please add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your Vercel project environment variables.`
    );
  }

  return new Redis({ url, token });
}

const SEED_DATA = {
  products: SEED_PRODUCTS,
  showcaseItems: SEED_SHOWCASE,
  collectionItems: SEED_COLLECTIONS,
  behindScenesImages: SEED_BTS,
  instagramPosts: SEED_INSTAGRAM,
};

export async function GET() {
  try {
    const redis = getRedisClient();
    let data = await redis.get('catalog');
    if (!data) {
      // Seed the database on first access
      await redis.set('catalog', SEED_DATA);
      data = SEED_DATA;
    }
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Failed to read from Upstash Redis:', error);
    // Fallback to seed data so site still works
    return NextResponse.json(SEED_DATA);
  }
}

export async function POST(request: Request) {
  try {
    const redis = getRedisClient();
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
    return NextResponse.json(
      { error: 'Failed to write to database', details: error.message },
      { status: 500 }
    );
  }
}
