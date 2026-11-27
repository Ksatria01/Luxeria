import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ website: 'available', bot: 'not_connected', database: 'not_checked', timestamp: new Date().toISOString() });
}
