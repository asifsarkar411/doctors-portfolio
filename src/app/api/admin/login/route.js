import { NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Incorrect admin password' }, { status: 401 });
    }

    // Generate simple secure session token
    const token = 'admin_session_' + Buffer.from(Date.now() + '_' + Math.random().toString(36)).toString('base64');

    const response = NextResponse.json({
      success: true,
      token,
      message: 'Login successful'
    });

    // Set secure cookie as well
    response.cookies.set('doctor_admin_auth', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('API /api/admin/login error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
