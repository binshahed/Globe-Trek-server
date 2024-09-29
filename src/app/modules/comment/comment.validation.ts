import { Types } from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z.custom<Types.ObjectId>(
  (value) => {
    return Types.ObjectId.isValid(value);
  },
  {
    message: 'Invalid ObjectId',
  },
);

const createCommentValidationSchema = z.object({
  body: z.object({
    user: objectIdSchema,
    comment: z.string().min(3, 'Slug is required'),
    blog: objectIdSchema,
  }),
});

export const commentValidation = {
  createCommentValidationSchema,
};
