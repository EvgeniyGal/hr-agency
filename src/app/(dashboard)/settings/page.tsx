import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Bell, Zap, Users as UsersIcon } from "lucide-react";
import { getUsers } from "@/lib/actions/users";
import { UserManagementTable } from "@/components/settings/UserManagementTable";
import { InviteUserDialog } from "@/components/settings/InviteUserDialog";

import { ProfileForm } from "@/components/settings/ProfileForm";
import { PasswordForm } from "@/components/settings/PasswordForm";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    const users = session?.user?.role === 'OWNER' ? await getUsers() : [];

    const initialProfile = {
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        image: session?.user?.image || undefined,
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account and agency preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <aside className="space-y-1">
                    {[
                        { label: "Profile", icon: User, active: true },
                        { label: "Security", icon: Shield, active: false },
                        { label: "Notifications", icon: Bell, active: false },
                        { label: "Integrations", icon: Zap, active: false },
                    ].map((item) => (
                        <Button
                            key={item.label}
                            variant={item.active ? "secondary" : "ghost"}
                            className={`w-full justify-start space-x-3 ${item.active ? 'bg-purple-50 text-purple-700 hover:bg-purple-100' : 'text-slate-600'}`}
                        >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </Button>
                    ))}
                </aside>

                <div className="md:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Public Profile</CardTitle>
                            <CardDescription>How others see you in the agency.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm initialData={initialProfile} />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>System Security</CardTitle>
                            <CardDescription>Update your login credentials.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PasswordForm />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Role & Permissions</CardTitle>
                            <CardDescription>Your current access level.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <p className="font-bold text-slate-900 uppercase tracking-wider text-xs">Current Role</p>
                                    <p className="text-slate-600">{session?.user?.role}</p>
                                </div>
                                <Badge className="bg-purple-100 text-purple-700 uppercase p-1 px-3 text-[10px]">Verified</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {session?.user?.role === 'OWNER' && (
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between w-full">
                                    <CardTitle className="flex items-center gap-2">
                                        <UsersIcon className="w-5 h-5 text-purple-600" />
                                        User Management
                                    </CardTitle>
                                    <InviteUserDialog />
                                </div>
                                <CardDescription>Manage team roles and access levels.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UserManagementTable users={users} />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
