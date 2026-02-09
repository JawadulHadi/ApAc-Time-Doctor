  import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
  import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
  import { Types, Document } from 'mongoose';

  @Schema({ timestamps: true })
  export class Company extends Document {
      @ApiProperty({ description: 'Company name', example: 'Kutta Company' })
    @Prop({ required: true, type: String })
    name: string;

    @ApiProperty({ description: 'Company slug', example: 'kutta-company' })
    @Prop({ required: true, unique: true })
    slug: string;

    @ApiProperty({ description: 'Company domain', example: 'kutta-company' })
    @Prop({ required: true, unique: true })
    domain: string;

    @ApiProperty({ description: 'Company subdomain', example: 'kutta-company' })
    @Prop({ required: true, unique: true })
    subdomain: string;

    @ApiProperty({ description: 'Company parent company', example: 'kutta-company' })
    @Prop({ type: Types.ObjectId, ref: 'Company' })
    parentCompany: Types.ObjectId;

    @ApiProperty({ description: 'Company type', example: 'client' })
    @Prop({
      enum: ['holding', 'subsidiary', 'client', 'partner'],
      default: 'client',
    })
    type: string;

    @ApiProperty({ description: 'Company branding', example: 'client' })
    @Prop({ type: Object })
    branding: {
      logo: string;
      primaryColor: string;
      secondaryColor: string;
      favicon: string;
      customDomain: string;
      customEmail: string;
    };

    @ApiProperty({ description: 'Company subscription', example: 'client' })
    @Prop({ type: Object })
    subscription: {
      plan: 'free' | 'starter' | 'professional' | 'enterprise';
      status: 'active' | 'trial' | 'past_due' | 'canceled';
      startsAt: Date;
      renewsAt: Date;
      users: number;
      jobSlots: number;
      features: string[];
    };

    @ApiProperty({ description: 'Company settings', example: 'client' })
    @Prop({ type: Object })
    settings: {
      careersPage: {
        enabled: boolean;
        customUrl: string;
        theme: 'modern' | 'classic' | 'minimal';
      };
      applicationForm: {
        fields: string[];
        requireResume: boolean;
        allowQuickApply: boolean;
      };
      notifications: {
        newApplication: string[];
        interviewScheduled: string[];
        offerSent: string[];
      };
    };

    @ApiProperty({ description: 'Company administrators', example: 'client' })
    @Prop({ type: [Types.ObjectId], ref: 'User' })
    administrators: Types.ObjectId[];

    @ApiProperty({description : 'Is company active', example: true})
    @Prop({ default: true })
    isActive: boolean;
  }

  export const CompanySchema = SchemaFactory.createForClass(Company);
