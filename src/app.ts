import express from 'express';
import cors from 'cors';
import { routes } from './app/router/router';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app = express();

// middlewares
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://globe-trek-server.vercel.app',
      'https://globe-trek-client.vercel.app',
      '*',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// routes
routes(app);

// global error handler
app.use(globalErrorHandler);

export default app;
