import { UserRole } from "@prisma/client";

export function canAccess(userRole: string | undefined, requiredRole: UserRole | UserRole[]) {
    if (!userRole) return false;

    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (userRole === UserRole.OWNER) return true;

    if (userRole === UserRole.MANAGER) {
        return requiredRoles.includes(UserRole.MANAGER) || requiredRoles.includes(UserRole.ADMIN);
    }

    if (userRole === UserRole.ADMIN) {
        return requiredRoles.includes(UserRole.ADMIN);
    }

    return false;
}

export function isAdmin(role: string | undefined) {
    return role === UserRole.OWNER || role === UserRole.ADMIN;
}

export function isManager(role: string | undefined) {
    return role === UserRole.OWNER || role === UserRole.MANAGER;
}

export function isOwner(role: string | undefined) {
    return role === UserRole.OWNER;
}
