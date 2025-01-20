export function isAuthenticated(password: string): boolean {
    return password === process.env.NEXT_PUBLIC_APP_PASSWORD;
  }