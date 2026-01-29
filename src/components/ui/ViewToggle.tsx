'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from './button';
import { LayoutGrid, List } from 'lucide-react';

export function ViewToggle() {
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const view = searchParams.get('view') || 'list';

    const handleToggle = (newView: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('view', newView);

        startTransition(() => {
            replace(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleToggle('list')}
                className={`h-7 px-3 ${view === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                disabled={isPending}
            >
                <List className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-[11px] font-semibold">List</span>
            </Button>
            <Button
                variant={view === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleToggle('kanban')}
                className={`h-7 px-3 ${view === 'kanban' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                disabled={isPending}
            >
                <LayoutGrid className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-[11px] font-semibold">Board</span>
            </Button>
        </div>
    );
}
