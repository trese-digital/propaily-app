export type Role = "owner" | "admin" | "manager" | "viewer";

const rolePermissions: Record<Role, string[]> = {
  owner: ["portfolio:read", "portfolio:write", "documents:read", "documents:write", "users:manage"],
  admin: ["portfolio:read", "portfolio:write", "documents:read", "documents:write"],
  manager: ["portfolio:read", "portfolio:write", "documents:read"],
  viewer: ["portfolio:read", "documents:read"]
};

export function can(role: Role, permission: string) {
  return rolePermissions[role].includes(permission);
}
