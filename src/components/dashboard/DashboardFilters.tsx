'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function DashboardFilters({ clients }: { clients: { id: string, name: string }[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const clientId = searchParams.get('clientId') || '';
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push('/');
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 animate-in slide-in-from-top duration-500">
            <div className="flex-1 space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Filter by Client</Label>
                <Select value={clientId} onValueChange={(v) => updateFilter('clientId', v)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Clients" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Clients</SelectItem>
                        {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                                {client.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">From Date</Label>
                <Input
                    type="date"
                    value={from}
                    onChange={(e) => updateFilter('from', e.target.value)}
                    className="w-full md:w-[180px]"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">To Date</Label>
                <Input
                    type="date"
                    value={to}
                    onChange={(e) => updateFilter('to', e.target.value)}
                    className="w-full md:w-[180px]"
                />
            </div>

            <div className="flex items-end">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFilters}
                    className="text-slate-400 hover:text-slate-600 h-10 w-10"
                    title="Clear Filters"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
