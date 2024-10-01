import { z } from 'zod';

const createCommentValidationSchema = z.object({
  body: z.object({
    comment: z.string().min(3, 'Slug is required'),
    blog: z.string(),
  }),
});
const updateCommentValidationSchema = z.object({
  body: z.object({
    comment: z.string().min(3, 'Slug is required'),
    commentId: z.string(),
  }),
});

export const commentValidation = {
  createCommentValidationSchema,
  updateCommentValidationSchema,
};
