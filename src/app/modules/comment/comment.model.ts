import { Schema, model } from 'mongoose';

import { TComment } from './comment.interface';

const commentSchema = new Schema<TComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
  },
  {
    timestamps: true,
  },
);

const CommentModel = model<TComment>('Comment', commentSchema);

export default CommentModel;
