// POST /api/pipeline/run - Trigger the hiring screener pipeline
import { NextResponse } from 'next/server';
import { runHiringScreenerPipeline } from '@/lib/pipeline';

export async function POST() {
  try {
    const result = await runHiringScreenerPipeline();
    
    return NextResponse.json({
      success: true,
      runId: result.runId,
      summary: result.summary,
      selectedCandidates: result.selectedCandidates
    });
  } catch (error) {
    console.error('Error running pipeline:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to run pipeline' },
      { status: 500 }
    );
  }
}
