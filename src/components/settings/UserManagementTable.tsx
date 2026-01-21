'use client';

import { useTransition } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { UserRole } from '@prisma/client';
import { updateUserRole, deleteUser } from '@/lib/actions/users';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface ManagedUser {
    id: string;
    name: string | null;
    email: string;
    role: UserRole;
    createdAt: Date;
}

export function UserManagementTable({ users }: { users: ManagedUser[] }) {
    const [isPending, startTransition] = useTransition();

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        startTransition(async () => {
            try {
                await updateUserRole(userId, newRole);
                toast.success(`User role updated to ${newRole}`);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to update role';
                toast.error(message);
            }
        });
    };

    const handleDelete = (userId: string) => {
        if (!confirm('Are you sure you want to deactivate this user?')) return;

        startTransition(async () => {
            try {
                await deleteUser(userId);
                toast.success('User deactivated');
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to delete user';
                toast.error(message);
            }
        });
    };

    return (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="group">
                            <TableCell>
                                <div>
                                    <div className="font-medium text-slate-900">{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.email}</div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Select
                                    defaultValue={user.role}
                                    onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                                    disabled={isPending}
                                >
                                    <SelectTrigger className="w-32 h-8 text-xs font-semibold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(UserRole).map((role) => (
                                            <SelectItem key={role} value={role} className="text-xs font-medium">
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="text-slate-500 text-sm">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-slate-400 hover:text-red-600 transition-colors"
                                    onClick={() => handleDelete(user.id)}
                                    disabled={isPending}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
