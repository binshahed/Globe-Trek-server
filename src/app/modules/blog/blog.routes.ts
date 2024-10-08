import { Router } from 'express';
import { blogController } from './blog.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { blogValidation } from './blog.validation';

const router = Router();

router
  .route('/')
  .get(blogController.getAllBlogs)
  .post(
    auth('admin', 'user'),
    validateRequest(blogValidation.createBlogValidationSchema),
    blogController.createBlog,
  );

router.route('/my-blog').get(auth('admin', 'user'), blogController.myBlogs);

router
  .route('/:blogId')
  .get(blogController.blogDetails)
  .patch(
    auth('admin', 'user'),
    validateRequest(blogValidation.updateBlogValidation),
    blogController?.updateBlog,
  )
  .delete(auth('admin', 'user'), blogController.deleteBlog);

router
  .route('/like/:blogId')
  .patch(auth('admin', 'user'), blogController.likeToggle);
router
  .route('/dislike/:blogId')
  .patch(auth('admin', 'user'), blogController.disLikeToggle);


  router.route('/get-pdf/:blogId').post(blogController.getPdf);
export const blogRouter = router;
