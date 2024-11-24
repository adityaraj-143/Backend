class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors: any[];
  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
