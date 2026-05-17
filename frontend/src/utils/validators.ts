export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string): boolean => emailRegex.test(value.trim());

export const isNonEmpty = (value: string, min = 1): boolean =>
  value.trim().length >= min;

export interface ValidationError {
  field: string;
  message: string;
}
