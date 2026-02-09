import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { RequestStage, RequestStatus, RequestType } from '../../../types/enums/request.enums';
export type RequestDocument = Request & Document;
@Schema({
  timestamps: true,
  collection: 'requests',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Request {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
  @Prop({ type: String, required: true, enum: RequestType })
  requestType: RequestType;
  @Prop({
    type: [String],
    required: true,
    validate: {
      validator: function (dates: string[]) {
        return dates && dates.length > 0;
      },
      message: 'At least one date must be selected',
    },
  })
  requestedDates: string[];
  @Prop({ required: true, min: 1 })
  days: number;
  @Prop()
  reason?: string;
  @Prop({ type: String, enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;
  @Prop({ type: String, enum: RequestStage, default: RequestStage.HR })
  currentStage: RequestStage;
  @Prop({ type: String })
  teamLeadName?: string;
  @Prop({
    type: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      userId: { type: Types.ObjectId, required: true },
    },
    required: false,
  })
  teamLeadData?: {
    fullName: string;
    email: string;
    userId: Types.ObjectId;
  };
  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;
  @Prop({ type: Date })
  approvedAt?: Date;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejectedBy?: Types.ObjectId;
  @Prop({ type: Date })
  rejectedAt?: Date;
  @Prop([
    {
      by: { type: Types.ObjectId, ref: 'User', required: true },
      role: { type: String, required: true },
      remark: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ])
  remarks: Array<{
    by: Types.ObjectId;
    role: string;
    remark: string;
    date: Date;
  }>;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Department' })
  department?: Types.ObjectId | null;
}
export const RequestSchema = SchemaFactory.createForClass(Request);
RequestSchema.pre('save', async function () {
  if (this.requestedDates && this.requestedDates.length > 0) {
    this.days = this.requestedDates.length;
  }
});
RequestSchema.index({ user: 1, requestedDates: 1 });
RequestSchema.index({ user: 1, requestType: 1 });
