import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IElection extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  candidates: Types.ObjectId[];
}

const ElectionSchema = new Schema<IElection>({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  candidates: [{ type: Schema.Types.ObjectId, ref: 'Candidate' }],
}, { timestamps: true });

export default mongoose.model<IElection>('Election', ElectionSchema); 