/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import BlogModel from '../blog/blog.model';
import { TComment } from './comment.interface';
import commentModel from './comment.model';

const getComments = async (id: any) => {
  const comments = await commentModel.find({ blog: id });

  return comments;
};

const createComment = async (payload: TComment) => {
  const blog = await BlogModel.findById(payload.blog);

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  return await commentModel.create(payload);
};

export const commentService = {
  getComments,
  createComment,
};
