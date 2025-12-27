export interface XRayStepInput {
  [key: string]: unknown;
}

export interface XRayStepOutput {
  [key: string]: unknown;
}

export interface XRayEvaluation {
  itemName: string;
  passed: boolean;
  details: Record<string, unknown>;
  score?: number;
}

export interface XRayStep {
  stepName: string;
  timestamp: string;
  durationMs?: number;
  status: 'success' | 'failure' | 'warning';
  input: XRayStepInput;
  output: XRayStepOutput;
  evaluations?: XRayEvaluation[];
  reasoning: string;
  metadata?: Record<string, unknown>;
}

export interface XRayRun {
  runId: string;
  startTime: string;
  endTime?: string;
  totalDurationMs?: number;
  status: 'running' | 'completed' | 'failed';
  pipelineName: string;
  steps: XRayStep[];
  summary?: {
    totalSteps: number;
    successfulSteps: number;
    failedSteps: number;
    [key: string]: unknown;
  };
}

export interface XRayContext {
  runId: string;
  pipelineName: string;
  startTime: string;
  steps: XRayStep[];
}
