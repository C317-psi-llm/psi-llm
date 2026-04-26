export function success(payload: any) {
  return { success: true, data: payload };
}

export function fail(message: string, details?: any) {
  return { success: false, message, details };
}
