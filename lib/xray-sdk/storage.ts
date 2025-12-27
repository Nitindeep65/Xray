import { XRayRun } from './types';

const runStore = new Map<string, XRayRun>();

export function saveRun(run: XRayRun): void {
  runStore.set(run.runId, JSON.parse(JSON.stringify(run)));
}

export function loadRun(runId: string): XRayRun | null {
  const run = runStore.get(runId);
  return run ? JSON.parse(JSON.stringify(run)) : null;
}

export function listRuns(): Array<{ runId: string; startTime: string; pipelineName: string; status: string }> {
  const runs = Array.from(runStore.values());
  
  return runs.map(run => ({
    runId: run.runId,
    startTime: run.startTime,
    pipelineName: run.pipelineName,
    status: run.status
  })).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}

export function deleteRun(runId: string): boolean {
  if (runStore.has(runId)) {
    runStore.delete(runId);
    return true;
  }
  return false;
}
