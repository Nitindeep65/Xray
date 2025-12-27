import { startRun, recordStep, endRun } from '../xray-sdk';
import { mockCandidates } from './mockData';
import { parseAllResumes } from './parseResume';
import { applyTechnicalFilter } from './techFilter';
import { evaluateCultureFit } from './cultureFit';
import { selectFinalCandidates } from './finalSelection';

export interface PipelineResult {
  runId: string;
  selectedCandidates: {
    candidateId: string;
    candidateName: string;
    rank: number;
    cultureScore: number;
    yearsExperience: number;
    totalScore: number;
    selected: boolean;
    reason: string;
  }[];
  summary: {
    totalCandidates: number;
    technicallyQualified: number;
    rejected: number;
    selected: number;
  };
}

/**
 * Run the complete Smart Hiring Screener pipeline with X-Ray logging
 */
export async function runHiringScreenerPipeline(): Promise<PipelineResult> {
  const runId = startRun('Smart Hiring Screener');
  
  try {
    // Step 1: Resume Parsing
    const stepStart = Date.now();
    const parsedResumes = parseAllResumes(mockCandidates);
    const parseDuration = Date.now() - stepStart;
    
    recordStep(
      runId,
      'resume_parsing',
      { candidateCount: mockCandidates.length },
      { parsedResumes },
      `Successfully parsed ${parsedResumes.length} resumes. Extracted skills, experience years, and bio summaries from each candidate using simulated LLM extraction.`,
      {
        status: 'success',
        durationMs: parseDuration,
        metadata: {
          candidateNames: parsedResumes.map(r => r.candidateName)
        }
      }
    );
    
    // Step 2: Technical Filter
    const filterStart = Date.now();
    const technicalResults = applyTechnicalFilter(parsedResumes);
    const filterDuration = Date.now() - filterStart;
    
    const qualified = technicalResults.filter(r => r.qualified);
    const rejected = technicalResults.filter(r => !r.qualified);
    
    const evaluations = technicalResults.map(result => ({
      itemName: result.candidateName,
      passed: result.qualified,
      details: {
        candidateId: result.candidateId,
        experienceCheck: result.checks.experienceCheck,
        skillCheck: result.checks.skillCheck
      }
    }));
    
    recordStep(
      runId,
      'technical_filter',
      { candidates: parsedResumes.length, requirements: { minExperience: 3, requiredSkills: ['React', 'Next.js'] } },
      { qualified: qualified.length, rejected: rejected.length, results: technicalResults },
      `Applied technical filters: ${rejected.length} candidates rejected, ${qualified.length} qualified. ` +
      `Rejection reasons: ${rejected.map(r => `${r.candidateName} - ${r.reason}`).join('; ')}. ` +
      `Requirements: >= 3 years experience AND (React OR Next.js) skills.`,
      {
        status: rejected.length > 0 ? 'warning' : 'success',
        evaluations,
        durationMs: filterDuration,
        metadata: {
          rejectedCandidates: rejected.map(r => ({ name: r.candidateName, reason: r.reason }))
        }
      }
    );
    
    // Step 3: Culture Fit Evaluation
    const cultureStart = Date.now();
    const cultureFitScores = evaluateCultureFit(parsedResumes, technicalResults);
    const cultureDuration = Date.now() - cultureStart;
    
    const cultureEvaluations = cultureFitScores.map(score => ({
      itemName: score.candidateName,
      passed: score.score >= 6,
      score: score.score,
      details: {
        candidateId: score.candidateId,
        alignmentDetails: score.alignmentDetails,
        evaluation: score.evaluation
      }
    }));
    
    recordStep(
      runId,
      'culture_fit_evaluation',
      { candidates: qualified.length },
      { scores: cultureFitScores },
      `Evaluated culture fit for ${cultureFitScores.length} qualified candidates using simulated LLM analysis of bio against company values (teamwork, ownership, growth, impact). ` +
      `Scores: ${cultureFitScores.map(s => `${s.candidateName}: ${s.score}/10`).join(', ')}. ` +
      `High-scoring candidates show strong alignment with collaborative culture and ownership mindset.`,
      {
        status: 'success',
        evaluations: cultureEvaluations,
        durationMs: cultureDuration,
        metadata: {
          averageScore: Math.round((cultureFitScores.reduce((sum, s) => sum + s.score, 0) / cultureFitScores.length) * 10) / 10
        }
      }
    );
    
    // Step 4: Final Selection
    const selectionStart = Date.now();
    const finalCandidates = selectFinalCandidates(cultureFitScores, parsedResumes, 3);
    const selectionDuration = Date.now() - selectionStart;
    
    const selected = finalCandidates.filter(c => c.selected);
    const notSelected = finalCandidates.filter(c => !c.selected);
    
    const selectionEvaluations = finalCandidates.map(candidate => ({
      itemName: candidate.candidateName,
      passed: candidate.selected,
      score: candidate.totalScore,
      details: {
        candidateId: candidate.candidateId,
        rank: candidate.rank,
        cultureScore: candidate.cultureScore,
        experience: candidate.yearsExperience,
        totalScore: candidate.totalScore
      }
    }));
    
    recordStep(
      runId,
      'final_selection',
      { candidates: cultureFitScores.length, topN: 3 },
      { selectedCandidates: selected, allRankings: finalCandidates },
      `Ranked all candidates by composite score (60% culture fit + 40% experience). ` +
      `Selected top 3: ${selected.map(c => `${c.candidateName} (Rank ${c.rank}, Score ${c.totalScore})`).join(', ')}. ` +
      `Not selected: ${notSelected.map(c => `${c.candidateName} (Rank ${c.rank}, Score ${c.totalScore})`).join(', ')}. ` +
      `Selection prioritizes strong cultural alignment while valuing experience.`,
      {
        status: 'success',
        evaluations: selectionEvaluations,
        durationMs: selectionDuration,
        metadata: {
          topCandidates: selected.map(c => ({ name: c.candidateName, score: c.totalScore }))
        }
      }
    );
    
    // End run with summary
    endRun(runId, {
      totalCandidates: mockCandidates.length,
      technicallyQualified: qualified.length,
      rejected: rejected.length,
      selected: selected.length,
      topCandidateNames: selected.map(c => c.candidateName)
    });
    
    return {
      runId,
      selectedCandidates: selected,
      summary: {
        totalCandidates: mockCandidates.length,
        technicallyQualified: qualified.length,
        rejected: rejected.length,
        selected: selected.length
      }
    };
    
  } catch (error) {
    // Record error and end run as failed
    recordStep(
      runId,
      'pipeline_error',
      {},
      { error: String(error) },
      `Pipeline failed with error: ${error}`,
      { status: 'failure' }
    );
    endRun(runId);
    throw error;
  }
}
