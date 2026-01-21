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
import { MoreHorizontal, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { SearchInput } from "@/components/ui/SearchInput";
import { StatusFilter } from "@/components/ui/StatusFilter";
import { CandidateStatus } from "@prisma/client";
import { ViewToggle } from "@/components/ui/ViewToggle";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { AddCandidateDialog } from "@/components/candidates/AddCandidateDialog";

export default async function CandidatesPage({
    searchParams,
}: {
    searchParams: { q?: string; status?: string; view?: string };
}) {
    const query = searchParams.q || "";
    const status = searchParams.status as CandidateStatus | undefined;
    const view = searchParams.view || "list";

    const candidates = await prisma.candidate.findMany({
        where: {
            deletedAt: null,
            status: status || undefined,
            OR: query ? [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { skills: { hasSome: [query] } },
            ] : undefined,
        },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Candidates</h1>
                    <p className="text-slate-500 text-sm">Manage your talent pool and track recruitment stages.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ViewToggle />
                    <AddCandidateDialog />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                <SearchInput placeholder="Search candidates by name, email, or skills..." />
                <StatusFilter options={Object.values(CandidateStatus)} />
            </div>

            {view === 'kanban' ? (
                <KanbanBoard candidates={candidates} isGlobal />
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-semibold text-slate-700">Name</TableHead>
                                <TableHead className="font-semibold text-slate-700">Contact</TableHead>
                                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                <TableHead className="font-semibold text-slate-700">Skills</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {candidates.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                                        No candidates found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                candidates.map((candidate) => (
                                    <TableRow key={candidate.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                                    {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{candidate.firstName} {candidate.lastName}</div>
                                                    <div className="text-xs text-slate-500">Added {new Date(candidate.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center text-xs text-slate-600">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {candidate.email}
                                                </div>
                                                {candidate.phone && (
                                                    <div className="flex items-center text-xs text-slate-600">
                                                        <Phone className="w-3 h-3 mr-1" />
                                                        {candidate.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {candidate.status.toLowerCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {candidate.skills.slice(0, 3).map((skill) => (
                                                    <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0 bg-slate-100 uppercase tracking-wider">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                                {candidate.skills.length > 3 && (
                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                        +{candidate.skills.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
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
