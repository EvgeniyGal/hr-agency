'use client';

import { useDroppable } from '@dnd-kit/core';

interface KanbanColumnProps {
    id: string;
    title: string;
    count: number;
    children: React.ReactNode;
}

export default function KanbanColumn({ id, title, count, children }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col w-72 shrink-0 group">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
                <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {count}
                </span>
            </div>
            <div
                ref={setNodeRef}
                className="flex-1 bg-slate-100/40 rounded-2xl p-3 border-2 border-dashed border-transparent group-hover:border-slate-200 transition-colors min-h-[500px]"
            >
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
