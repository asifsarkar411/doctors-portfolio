import { NextResponse } from 'next/server';
import { getAppointments, createAppointment, updateAppointmentStatus, deleteAppointment } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await getAppointments();
    return NextResponse.json({ success: true, appointments: list });
  } catch (error) {
    console.error('API /api/appointments GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.patientName || !body.patientPhone || !body.chamberName) {
      return NextResponse.json(
        { success: false, error: 'Patient name, phone number, and chamber are required.' },
        { status: 400 }
      );
    }
    const newApt = await createAppointment(body);
    return NextResponse.json({ success: true, appointment: newApt });
  } catch (error) {
    console.error('API /api/appointments POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status required' }, { status: 400 });
    }
    await updateAppointmentStatus(id, status);
    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('API /api/appointments PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Appointment ID required' }, { status: 400 });
    }
    await deleteAppointment(id);
    return NextResponse.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    console.error('API /api/appointments DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
