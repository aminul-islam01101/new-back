import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IRefreshTokenResponse } from './auth.interface';
import { AuthService } from './auth.service';

//! User Create

const createNewUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.createNewUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
    data: result
  });
});

//User Login

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.userLogin(loginData);
  const { accessToken, refreshToken } = result;
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Logged in successfully!',
    data: {
      accessToken
    }
  });
});

// refreshToken -------------------------

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  //! set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // ! sending response
  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Refresh Token Generated successfully !',
    data: result
  });
});

export const AuthController = {
  createNewUser,
  userLogin,
  refreshToken
};
