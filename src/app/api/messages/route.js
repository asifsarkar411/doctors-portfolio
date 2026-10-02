import { NextResponse } from 'next/server';
import { getContactMessages, createContactMessage, toggleMessageRead, deleteContactMessage } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await getContactMessages();
    return NextResponse.json({ success: true, messages: list });
  } catch (error) {
    console.error('API /api/messages GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }
    const newMsg = await createContactMessage(body);
    return NextResponse.json({ success: true, message: newMsg });
  } catch (error) {
    console.error('API /api/messages POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, read } = body;
    if (!id || typeof read !== 'boolean') {
      return NextResponse.json({ success: false, error: 'ID and read status required' }, { status: 400 });
    }
    await toggleMessageRead(id, read);
    return NextResponse.json({ success: true, message: 'Message read status updated' });
  } catch (error) {
    console.error('API /api/messages PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Message ID required' }, { status: 400 });
    }
    await deleteContactMessage(id);
    return NextResponse.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('API /api/messages DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
