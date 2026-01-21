import { prisma } from "@/lib/prisma";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Briefcase, MoreHorizontal, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatusFilter } from "@/components/ui/StatusFilter";
import { JobStatus } from "@prisma/client";

import { AddJobDialog } from "@/components/jobs/AddJobDialog";

import { ViewToggle } from "@/components/ui/ViewToggle";
import JobKanbanBoard from "@/components/kanban/JobKanbanBoard";

export const dynamic = 'force-dynamic';

export default async function JobsPage({
    searchParams,
}: {
    searchParams: { q?: string; status?: string; view?: string };
}) {
    const query = searchParams.q || "";
    const status = searchParams.status as JobStatus | undefined;
    const view = searchParams.view || "list";

    const [jobs, clients] = await Promise.all([
        prisma.job.findMany({
            where: {
                deletedAt: null,
                status: status || undefined,
                OR: query ? [
                    { title: { contains: query, mode: 'insensitive' } },
                    { client: { name: { contains: query, mode: 'insensitive' } } },
                ] : undefined,
            },
            include: { client: true },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.client.findMany({
            where: { deletedAt: null },
            select: { id: true, name: true },
        })
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Job Positions</h1>
                    <p className="text-slate-500 text-sm">Manage open positions and recruitment status.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ViewToggle />
                    <AddJobDialog clients={clients} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                <SearchInput placeholder="Search job titles or client names..." />
                <StatusFilter options={Object.values(JobStatus)} />
            </div>

            {view === 'kanban' ? (
                <JobKanbanBoard jobs={jobs} />
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-semibold text-slate-700">Position</TableHead>
                                <TableHead className="font-semibold text-slate-700">Client</TableHead>
                                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                <TableHead className="font-semibold text-slate-700">Posted</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jobs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                                        No jobs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                jobs.map((job) => (
                                    <TableRow key={job.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <Briefcase className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium text-slate-900">{job.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2 text-slate-600">
                                                <Building2 className="w-4 h-4" />
                                                <span>{job.client.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={job.status === 'OPEN' ? 'default' : 'secondary'} className={
                                                job.status === 'OPEN' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200' : ''
                                            }>
                                                {job.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-600 text-sm">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
