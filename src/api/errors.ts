import { API_ERROR } from "../constants";

export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorCode: API_ERROR;
  constructor(statusCode: number, message: string, errorCode: API_ERROR) {
    super()
    this.statusCode = statusCode
    this.message = message
    this.errorCode = errorCode
  }
}