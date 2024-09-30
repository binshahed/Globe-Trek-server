/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export interface TBlog {
  title: string;
  slug: string;
  author: Types.ObjectId;
  content: string;
  featuredImage: string;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
}
