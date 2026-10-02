import { NextResponse } from 'next/server';
import { getDbStatus } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await getDbStatus();
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('API /api/admin/status error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
