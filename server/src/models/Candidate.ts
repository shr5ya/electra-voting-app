import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICandidate extends Document {
  name: string;
  election: Types.ObjectId;
  voteCount: number;
}

const CandidateSchema = new Schema<ICandidate>({
  name: { type: String, required: true },
  election: { type: Schema.Types.ObjectId, ref: 'Election', required: true },
  voteCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<ICandidate>('Candidate', CandidateSchema); 