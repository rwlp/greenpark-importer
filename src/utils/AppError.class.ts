interface IErrorStructure {
    message: string;
    statusCode: number;
    saveError?: boolean;
  }
  
  class AppError {
    message: string;
    statusCode: number;
    private stack?: string;
    private saveError?: boolean;
  
    constructor({ message = '', statusCode = 500 }: { message: string, statusCode: number }) {
      this.message = message;
      this.statusCode = statusCode;
      this.stack = new Error().stack;
      this.saveError = false;
    }
  
    getErrorData(): IErrorStructure {
      return {
        message: this.message,
        statusCode: this.statusCode,
      };
    }

    printFullError() {
      console.log(this);
    }

    printStackTrace() {
      console.log(this.stack);
    }
  }
  
  export default AppError;