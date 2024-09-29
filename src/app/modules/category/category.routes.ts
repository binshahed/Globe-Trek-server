import { Router } from 'express';

import auth from '../../middlewares/auth';
import { categoryController } from './category.controller';

const router = Router();

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(auth('admin'), categoryController.createCategory);

export const categoryRouter = router;
