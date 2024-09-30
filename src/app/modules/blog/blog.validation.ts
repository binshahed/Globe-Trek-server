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

const createBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    author: objectIdSchema,
    content: z.string().min(1, 'Content is required'),
    featuredImage: z.string().url(),
    likes: z.array(objectIdSchema).optional(),
    dislikes: z.array(objectIdSchema).optional(),
  }),
});

export const blogValidation = {
  createBlogValidationSchema,
};
