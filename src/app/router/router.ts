import { Application, Request, Response } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { categoryRouter } from '../modules/category/category.routes';
import { blogRouter } from '../modules/blog/blog.routes';
import { commentRouter } from '../modules/comment/comment.routes';
import { paymentRouter } from '../modules/payment/payment.routes';

const modulesRouters = [
  {
    path: '/api/auth',
    route: authRouter,
  },
  {
    path: '/api/category',
    route: categoryRouter,
  },
  {
    path: '/api/blog',
    route: blogRouter,
  },
  {
    path: '/api/comment',
    route: commentRouter,
  },
  {
    path: '/api/payment',
    route: paymentRouter,
  },
];

export const routes = (app: Application) => {
  // root route
  app.get('/', (req: Request, res: Response) => {
    res.send('Globe Trek');
  });

  // all routes
  modulesRouters.forEach((router) => app.use(router.path, router.route));

  // not found route
  app.route('*').all((req: Request, res: Response) => {
    res.send({
      success: false,
      statusCode: 404,
      message: 'Route Not Found',
    });
  });
};
