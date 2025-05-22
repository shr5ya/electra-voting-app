import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVote extends Document {
  user: Types.ObjectId;
  candidate: Types.ObjectId;
  election: Types.ObjectId;
}

const VoteSchema = new Schema<IVote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  candidate: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  election: { type: Schema.Types.ObjectId, ref: 'Election', required: true },
}, { timestamps: true });

export default mongoose.model<IVote>('Vote', VoteSchema); 