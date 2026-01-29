'use client';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Building2,
    Settings,
    TrendingUp
} from "lucide-react";

const sidebarLinks = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Building2 },
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/candidates", label: "Candidates", icon: Users },
    { href: "/reports", label: "Reports", icon: TrendingUp },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-4">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-slate-900 text-white border-r-slate-800 p-0">
                <SheetHeader className="p-6 text-left">
                    <SheetTitle className="text-xl font-bold tracking-wider text-purple-400">HR CRM</SheetTitle>
                </SheetHeader>
                <nav className="flex-1 px-4 space-y-1">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${pathname === link.href
                                    ? 'bg-slate-800 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <link.icon className="w-5 h-5" />
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
