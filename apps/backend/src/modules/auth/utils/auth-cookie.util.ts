import type { CookieOptions, Response } from 'express';

export const AUTH_COOKIE_NAME = 'homematch_access_token';

type SameSiteOption = CookieOptions['sameSite'];

function getSameSiteOption(): SameSiteOption {
  const configuredValue = process.env.AUTH_COOKIE_SAMESITE?.toLowerCase();

  if (
    configuredValue === 'lax' ||
    configuredValue === 'strict' ||
    configuredValue === 'none'
  ) {
    return configuredValue;
  }

  return process.env.NODE_ENV === 'production' ? 'none' : 'lax';
}

export function getAuthCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const secure =
    process.env.AUTH_COOKIE_SECURE === 'true' ||
    (process.env.AUTH_COOKIE_SECURE !== 'false' && isProduction);
  const domain = process.env.AUTH_COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure,
    sameSite: getSameSiteOption(),
    domain,
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  };
}

export function setAuthCookie(response: Response, accessToken: string): void {
  response.cookie(AUTH_COOKIE_NAME, accessToken, getAuthCookieOptions());
}

export function clearAuthCookie(response: Response): void {
  const { maxAge, ...cookieOptions } = getAuthCookieOptions();

  response.clearCookie(AUTH_COOKIE_NAME, cookieOptions);
}
