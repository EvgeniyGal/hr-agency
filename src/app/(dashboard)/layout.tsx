import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Building2,
    Settings,
    LogOut,
    Menu,
    TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const sidebarLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Building2 },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/candidates", label: "Candidates", icon: Users },
    { href: "/reports", label: "Reports", icon: TrendingUp },
    { href: "/settings", label: "Settings", icon: Settings },
];

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white">
                <div className="p-6">
                    <h1 className="text-xl font-bold tracking-wider text-purple-400">HR CRM</h1>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <link.icon className="w-5 h-5 text-slate-400" />
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center space-x-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-sm font-bold">
                            {session.user.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{session.user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{session.user.role}</p>
                        </div>
                    </div>
                    <Link href="/api/auth/signout">
                        <Button variant="ghost" className="w-full mt-2 justify-start text-slate-400 hover:text-white hover:bg-slate-800">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 md:px-12">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="md:hidden mr-4">
                            <Menu className="w-6 h-6" />
                        </Button>
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Overview</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <Button variant="outline" size="sm" className="hidden sm:flex">New Entry</Button>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
