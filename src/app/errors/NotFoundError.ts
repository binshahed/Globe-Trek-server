class NotFoundError extends Error {
  public statusCode: number;
  public data: unknown;
  constructor(statusCode: number, message: string, data?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default NotFoundError;
