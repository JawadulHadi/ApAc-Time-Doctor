import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true, index: true })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  location: string;

  @Prop({ enum: ['remote', 'hybrid', 'onsite'] })
  workType: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: Object })
  details: {
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    salaryRange: {
      min: number;
      max: number;
      currency: string;
      isPublic: boolean;
    };
  };

  @Prop({ enum: ['draft', 'published', 'closed', 'archived'] })
  status: string;

  @Prop({ type: Date })
  publishedAt: Date;

  @Prop({ type: Date })
  closesAt: Date;

  @Prop({ type: Number, default: 0 })
  viewCount: number;

  @Prop({ type: Number, default: 0 })
  applicationCount: number;

  @Prop({ type: String, unique: true })
  applyUrl: string;

  @Prop({ type: Object })
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export const JobSchema = SchemaFactory.createForClass(Job);
