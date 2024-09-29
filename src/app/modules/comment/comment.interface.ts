import { Types } from 'mongoose';

export interface TComment {
  user: Types.ObjectId;
  comment: string;
  blog: Types.ObjectId;
}
