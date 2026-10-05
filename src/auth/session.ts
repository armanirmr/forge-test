export type User = { id: string; email: string; role: "admin" | "analyst" | "viewer"; regions: string[] };

const sessions = new Map<string, User>();

export function createSession(user: User): string {
  const token = crypto.randomUUID();
  sessions.set(token, user);
  return token;
}

export function getSession(token: string | undefined): User | null {
  if (!token) return null;
  return sessions.get(token) ?? null;
}

export function destroySession(token: string): void {
  sessions.delete(token);
}