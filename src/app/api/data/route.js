import { NextResponse } from 'next/server';
import { getSiteData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getSiteData();
    // Exclude sensitive adminAuth from public API response
    const { adminAuth, appointments, messages, ...publicData } = data;
    return NextResponse.json({ success: true, data: publicData });
  } catch (error) {
    console.error('API /api/data error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio data' },
      { status: 500 }
    );
  }
}
