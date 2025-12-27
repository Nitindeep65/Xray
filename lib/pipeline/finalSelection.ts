import { CultureFitScore } from './cultureFit';
import { ParsedResume } from './parseResume';

export interface FinalCandidate {
  candidateId: string;
  candidateName: string;
  rank: number;
  cultureScore: number;
  yearsExperience: number;
  totalScore: number;
  selected: boolean;
  reason: string;
}

/**
 * Rank candidates and select top 3
 */
export function selectFinalCandidates(
  cultureFitScores: CultureFitScore[],
  parsedResumes: ParsedResume[],
  topN: number = 3
): FinalCandidate[] {
  // Calculate composite score: 60% culture fit, 40% experience
  const rankedCandidates = cultureFitScores.map(cultureResult => {
    const resume = parsedResumes.find(r => r.candidateId === cultureResult.candidateId)!;
    
    // Normalize experience (cap at 10 years = 10 points)
    const experienceScore = Math.min(resume.yearsExperience, 10);
    
    // Weighted total score
    const totalScore = (cultureResult.score * 0.6) + (experienceScore * 0.4);
    
    return {
      candidateId: cultureResult.candidateId,
      candidateName: cultureResult.candidateName,
      cultureScore: cultureResult.score,
      yearsExperience: resume.yearsExperience,
      totalScore: Math.round(totalScore * 10) / 10,
      rank: 0, // Will be assigned after sorting
      selected: false,
      reason: ''
    };
  });
  
  // Sort by total score descending
  rankedCandidates.sort((a, b) => b.totalScore - a.totalScore);
  
  // Assign ranks and selection status
  rankedCandidates.forEach((candidate, index) => {
    candidate.rank = index + 1;
    candidate.selected = index < topN;
    
    if (candidate.selected) {
      candidate.reason = `Selected (Rank ${candidate.rank}): Strong combination of culture fit (${candidate.cultureScore}/10) and ${candidate.yearsExperience} years experience. Total score: ${candidate.totalScore}`;
    } else {
      candidate.reason = `Not selected (Rank ${candidate.rank}): Lower overall score (${candidate.totalScore}) compared to top ${topN} candidates.`;
    }
  });
  
  return rankedCandidates;
}
