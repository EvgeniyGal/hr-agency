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
import { Building2, MoreHorizontal } from "lucide-react";

import { AddClientDialog } from "@/components/clients/AddClientDialog";

import { SearchInput } from "@/components/ui/SearchInput";

export default async function ClientsPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const query = searchParams.q || "";

    const clients = await prisma.client.findMany({
        where: {
            deletedAt: null,
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { industry: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
            ],
        },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clients</h1>
                    <p className="text-slate-500 text-sm">Manage your partner companies and organizations.</p>
                </div>
                <AddClientDialog />
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                <SearchInput placeholder="Search clients by name, industry, or email..." />
                <Button variant="outline">Filter</Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-700">Name</TableHead>
                            <TableHead className="font-semibold text-slate-700">Industry</TableHead>
                            <TableHead className="font-semibold text-slate-700">Contact</TableHead>
                            <TableHead className="font-semibold text-slate-700">Jobs</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                                    No clients found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            clients.map((client) => (
                                <TableRow key={client.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-purple-50 rounded-lg">
                                                <Building2 className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <span className="font-medium text-slate-900">{client.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{client.industry || '—'}</TableCell>
                                    <TableCell className="text-slate-600">{client.email || '—'}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            Active
                                        </span>
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
        </div>
    );
}
