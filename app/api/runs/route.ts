// GET /api/runs - List all runs
import { NextResponse } from 'next/server';
import { listRuns } from '@/lib/xray-sdk/storage';

export async function GET() {
  try {
    const runs = listRuns();
    return NextResponse.json({ runs });
  } catch (error) {
    console.error('Error listing runs:', error);
    return NextResponse.json(
      { error: 'Failed to list runs' },
      { status: 500 }
    );
  }
}
