import { Router } from 'express';
import { commentController } from './blog.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { commentValidation } from './comment.validation';

const router = Router();

router.route('/:blogId').get(commentController.getComments);
router
  .route('/')
  .post(
    auth('admin', 'user'),
    validateRequest(commentValidation.createCommentValidationSchema),
    commentController.createComment,
  );

router
  .route('/updateComment')
  .patch(
    auth(),
    validateRequest(commentValidation.updateCommentValidationSchema),
    commentController.updateComment,
  );

router
  .route('/:commentId')
  .delete(auth('admin', 'user'), commentController.deleteComment);

export const commentRouter = router;
