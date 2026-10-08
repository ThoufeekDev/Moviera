import { Response } from "express";

export const successResponse = <T>(
  res: Response,
  statusCode: number,
  _success: boolean,
  message: string,
  data?: T,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  _success: boolean,
  message: string,
  code: string = "INTERNAL_ERROR",
  details?:unknown,
) => {
  return res.status(statusCode).json({
    success: false,
    code,
    message,
    ...(details !==undefined && {details}),
  });
};