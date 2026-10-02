import { NextResponse } from 'next/server';
import { resetDatabaseToDefaults } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await resetDatabaseToDefaults();
    return NextResponse.json({ success: true, message: 'All portfolio data reset to default demo data.' });
  } catch (error) {
    console.error('API /api/admin/reset error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
