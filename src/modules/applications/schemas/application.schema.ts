import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class JobApplication extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true, index: true })
  jobId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true, index: true })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Object })
  resume: {
    url: string;
    fileName: string;
    parsedData: any;
  };

  @Prop({ type: Object })
  coverLetter: {
    text: string;
    url: string;
  };

  @Prop({ type: [Object] })
  answers: Array<{
    question: string;
    answer: string;
  }>;

  @Prop({
    enum: ['applied', 'reviewing', 'shortlisted', 'interview', 'offer', 'rejected', 'hired'],
    default: 'applied',
  })
  status: string;

  @Prop({ type: [Object] })
  timeline: Array<{
    stage: string;
    date: Date;
    performedBy: string;
    notes: string;
  }>;

  @Prop({ type: Object })
  evaluation: {
    score: number;
    skills: string[];
    missingSkills: string[];
    recommendedStage: string;
    aiNotes: string;
  };

  @Prop({ type: Boolean, default: false })
  isArchived: boolean;
}

export const JobApplicationSchema = SchemaFactory.createForClass(JobApplication);
