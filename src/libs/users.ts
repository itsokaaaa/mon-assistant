export const users = process.env.NEXT_PUBLIC_USERS
  ? JSON.parse(process.env.NEXT_PUBLIC_USERS)
  : {};