import { getSession, type User } from "../auth/session";

export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}

export function requireUser(token: string | undefined): User {
  const user = getSession(token);
  if (!user) throw new UnauthorizedError("Not signed in");
  return user;
}

export function requireRole(user: User, ...roles: User["role"][]): void {
  if (!roles.includes(user.role)) throw new ForbiddenError("Insufficient role");
}