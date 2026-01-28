import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExportButton } from "@/components/reports/ExportButton";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
    const [jobs, candidates, clients, jobStatusRaw, candidateStatusRaw] = await Promise.all([
        prisma.job.findMany({
            where: { deletedAt: null },
            include: { client: true, _count: { select: { applications: true } } },
        }),
        prisma.candidate.findMany({
            where: { deletedAt: null },
            include: { _count: { select: { applications: true } } },
        }),
        prisma.client.findMany({
            where: { deletedAt: null },
            include: { _count: { select: { jobs: true } } },
        }),
        (prisma.job as any).groupBy({
            by: ['status'],
            _count: true,
            where: { deletedAt: null }
        }),
        (prisma.candidate as any).groupBy({
            by: ['status'],
            _count: true,
            where: { deletedAt: null }
        })
    ]);

    const jobStats = jobStatusRaw.map((s: any) => ({ name: s.status, value: s._count }));
    const candidateStats = candidateStatusRaw.map((s: any) => ({ name: s.status, value: s._count }));

    const reportData = jobs.map((job: any) => ({
        Position: job.title,
        Client: job.client.name,
        Status: job.status,
        Applications: job._count.applications,
        Created: new Date(job.createdAt).toLocaleDateString(),
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Analytics & Reports</h1>
                    <p className="text-slate-500">Deep dive into recruitment performance and pipeline health.</p>
                </div>
                <ExportButton data={reportData} filename="full_recruitment_report" />
            </div>

            <DashboardCharts jobStats={jobStats} candidateStats={candidateStats} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-blue-50/50 dark:bg-blue-900/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{jobs.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-purple-50/50 dark:bg-purple-900/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">Talent Pool Size</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{candidates.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-green-50/50 dark:bg-green-900/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Active Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{clients.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">Active Job Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Position</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Apps</TableHead>
                                <TableHead>Created</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jobs.map((job: any) => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium">{job.title}</TableCell>
                                    <TableCell>{job.client.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{job.status}</Badge>
                                    </TableCell>
                                    <TableCell>{job._count.applications}</TableCell>
                                    <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
