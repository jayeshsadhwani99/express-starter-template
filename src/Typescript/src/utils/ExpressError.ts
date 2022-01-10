class ExpressError extends Error {
  public message;
  public statusCode;

  constructor(message: any, statusCode: any) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

export = ExpressError;
