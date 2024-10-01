/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import BlogModel from '../blog/blog.model';
import { TComment } from './comment.interface';
import CommentModel from './comment.model';

const getComments = async (id: any) => {
  const comments = await CommentModel.find({ blog: id })
    .populate('user')
    .sort({ createdAt: -1 });

  return comments;
};

const createComment = async (user: any, payload: TComment) => {
  const blog = await BlogModel.findById(payload.blog);

  if (!blog) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
  }

  payload.user = user?._id;

  const comment = await CommentModel.create(payload);

  return comment;
};

const updateComment = async (
  user: any,
  payload: { commentId: string; comment: string },
) => {
  const { commentId, comment } = payload;
  const isCommentExist = await CommentModel.findOne({ _id: commentId, user });

  if (!isCommentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  // Use a single query to find and update the comment
  const updatedComment = await CommentModel.findOneAndUpdate(
    { _id: commentId, user }, // Check both _id and user
    { comment }, // Update the comment field
    {
      new: true,
      runValidators: true,
    },
  );

  // Check if the comment was found and updated
  if (!updatedComment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Comment not found or you do not have permission to edit this comment',
    );
  }

  return updatedComment;
};

const deleteComment = async (user: any, commentId: string) => {
  console.log(user, commentId);

  const deletedComment = await CommentModel.findOneAndDelete({
    user, // Check if the comment belongs to the user
    _id: commentId,
  });

  // Check if the comment was found and deleted
  if (!deletedComment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Comment not found or you do not have permission to delete this comment',
    );
  }

  return deletedComment;
};

export const commentService = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
