import { NextResponse } from 'next/server';
import { updateSiteSection, updateAdminPassword } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { section, data } = body;

    if (!section) {
      return NextResponse.json({ success: false, error: 'Section name is required' }, { status: 400 });
    }

    if (section === 'password') {
      if (!data || !data.newPassword || data.newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'New password must be at least 6 characters long' },
          { status: 400 }
        );
      }
      await updateAdminPassword(data.newPassword);
      return NextResponse.json({ success: true, message: 'Admin password changed successfully' });
    }

    const validSections = ['profile', 'themeSettings', 'services', 'chambers', 'schedules', 'gallery', 'posts'];
    if (!validSections.includes(section)) {
      return NextResponse.json({ success: false, error: `Invalid section: ${section}` }, { status: 400 });
    }

    const updated = await updateSiteSection(section, data);
    return NextResponse.json({ success: true, section, data: updated, message: `${section} updated successfully` });
  } catch (error) {
    console.error('API /api/admin/update error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
