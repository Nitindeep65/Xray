// GET /api/runs/[runId] - Get specific run details
import { NextResponse } from 'next/server';
import { loadRun } from '@/lib/xray-sdk/storage';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await params;
    const run = loadRun(runId);
    
    if (!run) {
      return NextResponse.json(
        { error: 'Run not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ run });
  } catch (error) {
    console.error('Error loading run:', error);
    return NextResponse.json(
      { error: 'Failed to load run' },
      { status: 500 }
    );
  }
}
