/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose';

export interface TPost {
  id: string;
  title: string;
  slug: string;
  author: Types.ObjectId;
  content: string;
  excerpt: string;
  tags: string[];
  publishedAt: any;
  updatedAt: any;
  featuredImage: string;
  status: string;
  comments: TComment[];
  likes: number;
  dislikes: number;
}

export interface TComment {
  id: string;
  author: string;
  comment: string;
  createdAt: any;
}
