// X-Ray SDK - Main API for logging multi-step process execution
import { XRayContext, XRayRun, XRayStep, XRayStepInput, XRayStepOutput, XRayEvaluation } from './types';
import { saveRun } from './storage';

const activeRuns = new Map<string, XRayContext>();

/**
 * Start a new X-Ray run
 * @param pipelineName Name of the pipeline being executed
 * @returns runId for tracking this execution
 */
export function startRun(pipelineName: string): string {
  const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const startTime = new Date().toISOString();
  
  const context: XRayContext = {
    runId,
    pipelineName,
    startTime,
    steps: []
  };
  
  activeRuns.set(runId, context);
  
  // Save initial run state
  const run: XRayRun = {
    runId,
    startTime,
    status: 'running',
    pipelineName,
    steps: []
  };
  saveRun(run);
  
  return runId;
}

/**
 * Record a step in the current run
 * @param runId The run identifier
 * @param stepName Name of this step
 * @param input Input data for this step
 * @param output Output data from this step
 * @param reasoning Human-readable explanation of what happened and why
 * @param options Additional options (evaluations, status, metadata)
 */
export function recordStep(
  runId: string,
  stepName: string,
  input: XRayStepInput,
  output: XRayStepOutput,
  reasoning: string,
  options?: {
    evaluations?: XRayEvaluation[];
    status?: 'success' | 'failure' | 'warning';
    metadata?: Record<string, unknown>;
    durationMs?: number;
  }
): void {
  const context = activeRuns.get(runId);
  if (!context) {
    throw new Error(`Run ${runId} not found. Did you call startRun()?`);
  }
  
  const step: XRayStep = {
    stepName,
    timestamp: new Date().toISOString(),
    durationMs: options?.durationMs,
    status: options?.status || 'success',
    input,
    output,
    evaluations: options?.evaluations,
    reasoning,
    metadata: options?.metadata
  };
  
  context.steps.push(step);
  
  // Update run file
  const run: XRayRun = {
    runId: context.runId,
    startTime: context.startTime,
    status: 'running',
    pipelineName: context.pipelineName,
    steps: context.steps
  };
  saveRun(run);
}

/**
 * End the current run and finalize data
 * @param runId The run identifier
 * @param summary Optional summary data
 */
export function endRun(runId: string, summary?: Record<string, unknown>): void {
  const context = activeRuns.get(runId);
  if (!context) {
    throw new Error(`Run ${runId} not found`);
  }
  
  const endTime = new Date().toISOString();
  const totalDurationMs = new Date(endTime).getTime() - new Date(context.startTime).getTime();
  
  const successfulSteps = context.steps.filter(s => s.status === 'success').length;
  const failedSteps = context.steps.filter(s => s.status === 'failure').length;
  
  const run: XRayRun = {
    runId: context.runId,
    startTime: context.startTime,
    endTime,
    totalDurationMs,
    status: failedSteps > 0 ? 'failed' : 'completed',
    pipelineName: context.pipelineName,
    steps: context.steps,
    summary: {
      totalSteps: context.steps.length,
      successfulSteps,
      failedSteps,
      ...summary
    }
  };
  
  saveRun(run);
  activeRuns.delete(runId);
}

/**
 * Get current step count for a run
 */
export function getStepCount(runId: string): number {
  const context = activeRuns.get(runId);
  return context ? context.steps.length : 0;
}

// Export types for consumers
export type { XRayContext, XRayRun, XRayStep, XRayStepInput, XRayStepOutput, XRayEvaluation } from './types';
