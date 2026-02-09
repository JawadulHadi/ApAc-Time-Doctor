import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
export class TeamLeadDetail {
  @ApiProperty({
    description: 'User ID',
    example: '68fa4a9b3a50f116c7311796',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
  @ApiProperty({
    description: 'Username',
    example: 'samrullahnazir',
  })
  @Prop({ type: String })
  username: string;
  @ApiProperty({
    description: 'Email address',
    example: 'ron@mailinator.com',
  })
  @Prop({ type: String })
  email: string;
  @ApiProperty({
    description: 'User role',
    example: 'TEAM_LEAD',
  })
  @Prop({ type: String })
  role: string;
  @ApiPropertyOptional({
    description: 'Designation',
    example: 'Team Lead - Business Development',
  })
  @Prop({ type: String })
  designation?: string;
  @ApiProperty({
    description: 'First name',
    example: 'Samrullah',
  })
  @Prop({ type: String })
  firstName: string;
  @ApiProperty({
    description: 'Last name',
    example: 'Nazir',
  })
  @Prop({ type: String })
  lastName: string;
}
@Schema({
  timestamps: true,
})
export class Department {
  @ApiProperty({
    description: 'Department ID',
    example: '68d087eb52b91a26b1bf858b',
  })
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;
  @ApiProperty({
    description: 'Department name',
    example: 'BD Canada',
    required: true,
  })
  @Prop({
    required: true,
    trim: true,
    unique: true,
    index: true,
  })
  name: string;
  @ApiPropertyOptional({
    description: 'Department description',
    example:
      'Focuses on business development, client relationships, and market expansion strategies across Canada.',
  })
  @Prop({
    type: String,
    trim: true,
  })
  description?: string;
  @ApiProperty({
    description: 'Department active status',
    example: true,
    default: true,
  })
  @Prop({
    default: true,
    index: true,
  })
  isActive: boolean;
  @ApiPropertyOptional({
    description: 'Team Lead user reference ID',
    example: '68fa4a9b3a50f116c7311796',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  })
  teamLead?: Types.ObjectId;
  @ApiPropertyOptional({
    description: 'Team lead details embedded object',
    type: TeamLeadDetail,
  })
  @Prop({
    type: {
      userId: { type: Types.ObjectId, ref: 'User', required: true },
      username: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      role: { type: String, trim: true },
      designation: { type: String, trim: true },
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
    },
    default: null,
    _id: false,
  })
  teamLeadDetail?: TeamLeadDetail | null;
  createdAt: Date;
  updatedAt: Date;
}
export const DepartmentSchema = SchemaFactory.createForClass(Department);
