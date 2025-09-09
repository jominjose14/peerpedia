import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isTokenNullOrExpired(): boolean {
  try {
    const jwt: string | null = localStorage.getItem('jwt');
    if (jwt === null) throw new Error("Token is null");
    const jwtPayloadBase64: string = jwt.split('.')[1];
    const jwtPayload: { sub: string, iat: number, exp: number } = JSON.parse(atob(jwtPayloadBase64));
    const expiryTimestamp: number = jwtPayload.exp;

    const now = Date.now() / 1000; // Convert current timestamp from milliseconds to seconds
    return expiryTimestamp < now;
  } catch (e) {
    console.error('Error during isTokenExpired check', e);
    return true;
  }
};

export function extractUsernameFromToken(): string {
  try {
    const jwt: string | null = localStorage.getItem('jwt');
    if (jwt === null) throw new Error("Token is null");
    const jwtPayloadBase64: string = jwt.split('.')[1];
    const jwtPayload: { sub: string, iat: number, exp: number } = JSON.parse(atob(jwtPayloadBase64));
    const username: string = jwtPayload.sub;
    return username;
  } catch (err) {
    console.error('Error while extracting username from token', err);
    return 'username';
  }
}

export function doesIntersect(arr1: string[], arr2: string[]): boolean {
  const intersection = arr1.filter(item => arr2.includes(item));
  return 0 < intersection.length;
}

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export function isoToDateTime(isoStr: string): string {
  const date = new Date(isoStr);
  const formattedDate = dateTimeFormatter.format(date).replace(',', '');
  return formattedDate;
}