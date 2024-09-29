import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { commentService } from './comment.service';

const createComment = catchAsync(async (req, res) => {
  const result = await commentService.getComments(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment created successfully',
    data: result,
  });
});

const getComments = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await commentService.getComments(blogId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments retrieved successfully',
    data: result,
  });
});

export const commentController = {
  createComment,
  getComments,
};
