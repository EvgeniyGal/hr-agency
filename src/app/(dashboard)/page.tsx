import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Building2,
    Briefcase,
    Users,
    TrendingUp,
    Clock,
    ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";

export const dynamic = 'force-dynamic';

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ clientId?: string; from?: string; to?: string }>;
}) {
    const resolvedParams = await searchParams;
    const clientId = resolvedParams.clientId;
    const from = resolvedParams.from ? new Date(resolvedParams.from) : undefined;
    const to = resolvedParams.to ? new Date(resolvedParams.to) : undefined;

    const commonWhere = {
        deletedAt: null,
        ...(clientId && { clientId }),
        ...(from || to ? {
            createdAt: {
                ...(from && { gte: from }),
                ...(to && { lte: to }),
            }
        } : {}),
    };

    const [
        clientCount,
        jobCount,
        candidateCount,
        recentApplications,
        systemActivities,
        jobStatusRaw,
        candidateStatusRaw,
        clients
    ] = await Promise.all([
        prisma.client.count({ where: { deletedAt: null } }),
        prisma.job.count({ where: { ...commonWhere, status: 'OPEN' } }),
        prisma.candidate.count({ where: { deletedAt: null } }),
        prisma.application.findMany({
            take: 5,
            where: clientId ? { job: { clientId } } : undefined,
            include: {
                job: true,
                candidate: true,
            },
            orderBy: { appliedAt: 'desc' },
        }),
        prisma.activity.findMany({
            take: 5,
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        }),
        (prisma.job as any).groupBy({
            by: ['status'],
            _count: true,
            where: commonWhere
        }),
        (prisma.candidate as any).groupBy({
            by: ['status'],
            _count: true,
            where: { deletedAt: null }
        }),
        prisma.client.findMany({
            where: { deletedAt: null },
            select: { id: true, name: true }
        })
    ]);

    const jobStats = jobStatusRaw.map((s: any) => ({ name: s.status, value: s._count }));
    const candidateStats = candidateStatusRaw.map((s: any) => ({ name: s.status, value: s._count }));

    const stats = [
        { label: "Active Clients", value: clientCount, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Open Positions", value: jobCount, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Total Candidates", value: candidateCount, icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
        { label: "Placements", value: 12, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
                    <p className="text-slate-500 text-sm">Real-time performance metrics and funnel analysis.</p>
                </div>
            </div>

            <DashboardFilters clients={clients} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-slate-500">{stat.label}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                            <p className="text-xs text-slate-400 mt-1 flex items-center">
                                <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">12%</span> from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <DashboardCharts jobStats={jobStats} candidateStats={candidateStats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-800">Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentApplications.length === 0 ? (
                                <div className="text-sm text-slate-400 py-4">No recent applications found.</div>
                            ) : (
                                recentApplications.map((app: any) => (
                                    <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all cursor-pointer">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                                {app.candidate.firstName[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{app.candidate.firstName} {app.candidate.lastName}</div>
                                                <div className="text-sm text-slate-500">applied for {app.job.title}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="mb-1 text-[10px] uppercase tracking-wider">{app.status}</Badge>
                                            <div className="text-xs text-slate-400 flex items-center justify-end">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-800">System Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {systemActivities.length === 0 ? (
                                <div className="text-sm text-slate-400 py-4">No recent activity.</div>
                            ) : (
                                systemActivities.map((activity: any) => (
                                    <div key={activity.id} className="flex space-x-3 text-sm">
                                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${activity.action.includes('CREATE') ? 'bg-green-500' :
                                            activity.action.includes('UPDATE') ? 'bg-blue-500' : 'bg-slate-500'
                                            }`} />
                                        <div>
                                            <p className="text-slate-900 font-medium capitalize">
                                                {activity.action.toLowerCase().replace('_', ' ')}
                                            </p>
                                            <p className="text-slate-500">{activity.user.name} modified {activity.entityType}</p>
                                            <span className="text-xs text-slate-400">
                                                {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
