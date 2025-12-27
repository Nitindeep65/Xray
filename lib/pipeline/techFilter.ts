// Step 2: Technical Filter
import { ParsedResume } from './parseResume';
import { technicalRequirements } from './mockData';

export interface TechnicalFilterResult {
  candidateId: string;
  candidateName: string;
  qualified: boolean;
  checks: {
    experienceCheck: {
      passed: boolean;
      actual: number;
      required: number;
      detail: string;
    };
    skillCheck: {
      passed: boolean;
      foundSkills: string[];
      requiredSkills: string[];
      detail: string;
    };
  };
  reason: string;
}

/**
 * Apply technical filters to candidates
 */
export function applyTechnicalFilter(parsedResumes: ParsedResume[]): TechnicalFilterResult[] {
  return parsedResumes.map(resume => {
    // Check minimum experience
    const experiencePassed = resume.yearsExperience >= technicalRequirements.minExperience;
    const experienceDetail = experiencePassed
      ? `${resume.yearsExperience} years >= required ${technicalRequirements.minExperience} years`
      : `${resume.yearsExperience} years < required ${technicalRequirements.minExperience} years`;
    
    // Check required skills
    const foundSkills = resume.skills.filter(skill =>
      technicalRequirements.requiredSkills.some(req => 
        skill.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(skill.toLowerCase())
      )
    );
    const skillsPassed = foundSkills.length > 0;
    const skillDetail = skillsPassed
      ? `Found required skills: ${foundSkills.join(', ')}`
      : `Missing required skills (${technicalRequirements.requiredSkills.join(' or ')}). Has: ${resume.skills.join(', ')}`;
    
    const qualified = experiencePassed && skillsPassed;
    
    let reason = '';
    if (!qualified) {
      const issues = [];
      if (!experiencePassed) issues.push('insufficient experience');
      if (!skillsPassed) issues.push('missing required skills');
      reason = `Rejected: ${issues.join(' and ')}`;
    } else {
      reason = 'Passed technical requirements';
    }
    
    return {
      candidateId: resume.candidateId,
      candidateName: resume.candidateName,
      qualified,
      checks: {
        experienceCheck: {
          passed: experiencePassed,
          actual: resume.yearsExperience,
          required: technicalRequirements.minExperience,
          detail: experienceDetail
        },
        skillCheck: {
          passed: skillsPassed,
          foundSkills,
          requiredSkills: technicalRequirements.requiredSkills,
          detail: skillDetail
        }
      },
      reason
    };
  });
}
