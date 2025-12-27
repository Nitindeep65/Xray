import { ParsedResume } from './parseResume';
import { TechnicalFilterResult } from './techFilter';

export interface CultureFitScore {
  candidateId: string;
  candidateName: string;
  score: number; // 1-10
  evaluation: string;
  alignmentDetails: {
    teamwork: number;
    ownership: number;
    growth: number;
    impact: number;
  };
}

/**
 * Simulate LLM evaluation of culture fit based on bio and company values
 */
export function evaluateCultureFit(
  parsedResumes: ParsedResume[],
  technicalResults: TechnicalFilterResult[]
): CultureFitScore[] {
  // Only evaluate candidates who passed technical filter
  const qualifiedCandidates = technicalResults.filter(r => r.qualified);
  
  return qualifiedCandidates.map(result => {
    const resume = parsedResumes.find(r => r.candidateId === result.candidateId)!;
    const bio = resume.bioSummary.toLowerCase();
    
    // Simulate LLM scoring based on keyword matching
    // In real system, this would use GPT/Claude to analyze fit
    const teamworkScore = (
      bio.includes('team') || bio.includes('collaborat') || bio.includes('together')
    ) ? 9 : (bio.includes('solo') || bio.includes('independent')) ? 4 : 6;
    
    const ownershipScore = (
      bio.includes('ownership') || bio.includes('responsibility') || bio.includes('deliver')
    ) ? 9 : 5;
    
    const growthScore = (
      bio.includes('learn') || bio.includes('mentor') || bio.includes('grow')
    ) ? 8 : 5;
    
    const impactScore = (
      bio.includes('impact') || bio.includes('matter') || bio.includes('difference')
    ) ? 9 : 6;
    
    const overallScore = Math.round((teamworkScore + ownershipScore + growthScore + impactScore) / 4);
    
    let evaluation = '';
    if (overallScore >= 8) {
      evaluation = `Strong cultural fit. ${resume.candidateName} demonstrates clear alignment with company values around teamwork, ownership, and impact. Bio shows strong emphasis on collaboration and taking responsibility for outcomes.`;
    } else if (overallScore >= 6) {
      evaluation = `Moderate cultural fit. ${resume.candidateName} shows some alignment with company values but less emphasis on collaboration or growth mindset.`;
    } else {
      evaluation = `Limited cultural fit. ${resume.candidateName}'s bio suggests preference for independent work with less focus on team dynamics and shared values.`;
    }
    
    return {
      candidateId: result.candidateId,
      candidateName: result.candidateName,
      score: overallScore,
      evaluation,
      alignmentDetails: {
        teamwork: teamworkScore,
        ownership: ownershipScore,
        growth: growthScore,
        impact: impactScore
      }
    };
  });
}
