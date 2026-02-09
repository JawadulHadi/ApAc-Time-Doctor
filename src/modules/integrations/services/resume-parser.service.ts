import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ResumeParserService {
  private readonly logger = new Logger(ResumeParserService.name);
  private readonly sovrenAPI = 'https://rest.resumeparsing.com/v10';

  async parseWithSovren(fileBuffer: Buffer, fileName: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.sovrenAPI}/parser/resume`,
        {
          DocumentAsBase64String: fileBuffer.toString('base64'),
          DocumentLastModified: new Date().toISOString(),
          Configuration: {
            SkillsSettings: {
              Normalize: true,
              TaxonomyVersion: '7.0',
            },
          },
        },
        {
          headers: {
            'Sovren-AccountId': process.env.SOVREN_ACCOUNT_ID,
            'Sovren-ServiceKey': process.env.SOVREN_SERVICE_KEY,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      return this.formatForAPAC(response.data);
    } catch (error) {
      this.logger.error('Sovren parsing failed:', error.response?.data || error.message);
      return this.basicParse(fileBuffer, fileName);
    }
  }

  private formatForAPAC(parsedData: any): any {
    const contact = parsedData.Value?.ResumeData?.ContactInformation;
    const employment = parsedData.Value?.ResumeData?.EmploymentHistory;
    const education = parsedData.Value?.ResumeData?.Education;
    const skills = parsedData.Value?.ResumeData?.Skills;

    return {
      contact: {
        name: contact?.CandidateName?.FormattedName || '',
        firstName: contact?.CandidateName?.GivenName || '',
        lastName: contact?.CandidateName?.FamilyName || '',
        email: contact?.EmailAddresses?.[0]?.Address || '',
        phone: contact?.Telephones?.[0]?.Normalized || '',
        location: contact?.Location?.Normalized || '',
      },
      summary: parsedData.Value?.ResumeData?.ProfessionalSummary || '',
      skills:
        skills?.Data?.map(skill => ({
          name: skill.Name,
          years: skill.Experience,
          lastUsed: skill.LastUsed,
          confidence: skill.Confidence || 0,
        })) || [],
      experience:
        employment?.map(job => ({
          company: job.Employer?.Name?.Normalized,
          title: job.JobTitle?.Normalized,
          startDate: job.StartDate,
          endDate: job.EndDate,
          duration: job.Duration,
          description: job.Description,
        })) || [],
      education:
        education?.map(edu => ({
          institution: edu.SchoolName?.Normalized,
          degree: edu.Degree?.Name?.Normalized,
          field: edu.Degree?.FieldOfStudy,
          year: edu.GraduationDate?.Year,
        })) || [],
      certifications: parsedData.Value?.ResumeData?.Certifications?.map(cert => cert.Name) || [],
      languages:
        parsedData.Value?.ResumeData?.LanguageCompetencies?.map(lang => ({
          language: lang.Language,
          proficiency: lang.Proficiency,
        })) || [],
      metadata: {
        confidenceScore: parsedData.Value?.ResumeData?.Scoring?.Overall || 0,
        parserUsed: 'Sovren',
        parsedAt: new Date().toISOString(),
      },
    };
  }

  private basicParse(fileBuffer: Buffer, fileName: string): any {
    this.logger.warn('Using basic parsing as fallback');

    return {
      contact: {
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
      },
      summary: '',
      skills: [],
      experience: [],
      education: [],
      certifications: [],
      languages: [],
      metadata: {
        confidenceScore: 0,
        parserUsed: 'Basic',
        parsedAt: new Date().toISOString(),
        fileName,
      },
    };
  }

  async scoreCandidate(parsedData: any, jobRequirements: any): Promise<any> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert technical recruiter. Analyze the candidate resume against job requirements and return a structured assessment.',
            },
            {
              role: 'user',
              content: `Job Requirements:\n${JSON.stringify(jobRequirements, null, 2)}\n\nCandidate Data:\n${JSON.stringify(parsedData, null, 2)}\n\nReturn JSON with:\n- overallScore (0-100)\n- skillsMatch (array of matched skills with confidence)\n- missingSkills (array)\n- experienceLevel (Junior/Mid/Senior)\n- recommendedInterviewQuestions (array of 3 questions)\n- hireRecommendation (Strong/Moderate/Weak)\n- reasoning (brief explanation)`,
            },
          ],
          temperature: 0.3,
          max_tokens: 1000,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      this.logger.error('AI scoring failed:', error.response?.data || error.message);
      return {
        overallScore: 50,
        skillsMatch: [],
        missingSkills: [],
        experienceLevel: 'Mid',
        recommendedInterviewQuestions: [],
        hireRecommendation: 'Moderate',
        reasoning: 'AI scoring unavailable, manual review required',
      };
    }
  }
}
