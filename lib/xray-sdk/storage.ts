// Storage layer for X-Ray run data
import fs from 'fs';
import path from 'path';
import { XRayRun } from './types';

const RUNS_DIR = path.join(process.cwd(), 'runs');

// Ensure runs directory exists
export function ensureRunsDirectory(): void {
  if (!fs.existsSync(RUNS_DIR)) {
    fs.mkdirSync(RUNS_DIR, { recursive: true });
  }
}

// Save run data to JSON file
export function saveRun(run: XRayRun): void {
  ensureRunsDirectory();
  const filePath = path.join(RUNS_DIR, `${run.runId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(run, null, 2), 'utf-8');
}

// Load run data by ID
export function loadRun(runId: string): XRayRun | null {
  const filePath = path.join(RUNS_DIR, `${runId}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as XRayRun;
}

// List all run IDs
export function listRuns(): Array<{ runId: string; startTime: string; pipelineName: string; status: string }> {
  ensureRunsDirectory();
  const files = fs.readdirSync(RUNS_DIR).filter(f => f.endsWith('.json'));
  
  return files.map(file => {
    const filePath = path.join(RUNS_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as XRayRun;
    return {
      runId: data.runId,
      startTime: data.startTime,
      pipelineName: data.pipelineName,
      status: data.status
    };
  }).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}

// Delete run by ID
export function deleteRun(runId: string): boolean {
  const filePath = path.join(RUNS_DIR, `${runId}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}
