export const AUTH_ROLES = {
  ADMIN: {
    id: 10000,
    name: "׳׳ ׳”׳",
  },
  VOLUNTEER: {
    id: 1,
    name: "׳׳×׳ ׳“׳‘",
  },
  TRAINEE: {
    id: 2,
    name: "׳—׳ ׳™׳",
  },
};

export const AUTH_STORAGE_KEYS = {
  token: "etlaasot_auth_token",
  roles: "etlaasot_auth_roles",
};

const isBrowser = () => typeof window !== "undefined";

export const getAuthToken = () => {
  if (!isBrowser()) {
    return "";
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEYS.token)?.trim() ?? "";
};

export const getStoredRoleIds = () => {
  if (!isBrowser()) {
    return [] as number[];
  }

  const rawRoles = window.localStorage.getItem(AUTH_STORAGE_KEYS.roles);

  if (!rawRoles) {
    return [] as number[];
  }

  try {
    const parsedRoles = JSON.parse(rawRoles);

    if (!Array.isArray(parsedRoles)) {
      return [] as number[];
    }

    return parsedRoles
      .map((role) => {
        if (typeof role === "number") {
          return role;
        }

        if (
          typeof role === "object" &&
          role !== null &&
          "roleId" in role &&
          typeof role.roleId === "number"
        ) {
          return role.roleId;
        }

        return null;
      })
      .filter((roleId): roleId is number => roleId !== null);
  } catch {
    return [] as number[];
  }
};

export const isAuthenticated = () => Boolean(getAuthToken());

export const hasRole = (roleId: number) => getStoredRoleIds().includes(roleId);

export const hasAnyRole = (roleIds: number[]) =>
  roleIds.some((roleId) => hasRole(roleId));

export const isAdmin = () => hasRole(AUTH_ROLES.ADMIN.id);
