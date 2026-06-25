export interface AdminActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export function adminSuccess<T>(data?: T): AdminActionResult<T> {
  return { success: true, data };
}

export function adminError(
  error: string,
  fieldErrors?: Record<string, string>,
): AdminActionResult<never> {
  return { success: false, error, fieldErrors };
}
