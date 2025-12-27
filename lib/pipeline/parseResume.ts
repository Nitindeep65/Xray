// Step 1: Resume Parsing (LLM simulated)
import { Candidate } from './mockData';

export interface ParsedResume {
  candidateId: string;
  candidateName: string;
  skills: string[];
  yearsExperience: number;
  bioSummary: string;
}

/**
 * Simulate LLM parsing of resume to extract structured data
 */
export function parseResume(candidate: Candidate): ParsedResume {
  // In a real system, this would call an LLM API
  // For demo, we use the pre-structured data
  return {
    candidateId: candidate.id,
    candidateName: candidate.name,
    skills: candidate.rawData.skills,
    yearsExperience: candidate.rawData.yearsExperience,
    bioSummary: candidate.rawData.bio
  };
}

export function parseAllResumes(candidates: Candidate[]): ParsedResume[] {
  return candidates.map(parseResume);
}
