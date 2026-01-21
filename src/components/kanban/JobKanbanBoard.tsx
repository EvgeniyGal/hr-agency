'use client';

import { useState, useTransition } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { updateJobStatus } from '@/lib/actions/jobs';
import { JobStatus } from '@prisma/client';
import { toast } from 'sonner';

const COLUMNS = [
    { id: 'DRAFT', title: 'Draft' },
    { id: 'OPEN', title: 'Open' },
    { id: 'CLOSED', title: 'Closed' },
    { id: 'FILLED', title: 'Filled' },
];

interface Job {
    id: string;
    title: string;
    description: string | null;
    status: string;
    createdAt: string | Date;
    client: { name: string };
    _count?: { applications: number };
}

export default function JobKanbanBoard({ jobs }: { jobs: Job[] }) {
    const [, startTransition] = useTransition();
    const [items, setItems] = useState<{ [key: string]: Job[] }>(() => {
        const initial: { [key: string]: Job[] } = {};
        COLUMNS.forEach(col => {
            initial[col.id] = jobs.filter(j => j.status === col.id);
        });
        return initial;
    });

    const [activeItem, setActiveItem] = useState<Job | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const item = jobs.find(j => j.id === active.id);
        if (item) setActiveItem(item);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) {
            setActiveItem(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        const sourceCol = Object.keys(items).find(key => items[key].some(i => i.id === activeId));
        const destCol = Object.keys(items).find(key => key === overId || items[key].some(i => i.id === overId));

        if (sourceCol && destCol && sourceCol !== destCol) {
            const activeItemLocal = items[sourceCol].find(i => i.id === activeId);

            if (activeItemLocal) {
                setItems(prev => ({
                    ...prev,
                    [sourceCol]: prev[sourceCol].filter(i => i.id !== activeId),
                    [destCol]: [...prev[destCol], { ...activeItemLocal, status: destCol }]
                }));

                startTransition(async () => {
                    try {
                        await updateJobStatus(activeId, destCol as JobStatus);
                        toast.success(`Job moved to ${destCol}`);
                    } catch {
                        toast.error('Failed to update job status');
                    }
                });
            }
        }

        setActiveItem(null);
    }

    return (
        <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px] -mx-8 px-8">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {COLUMNS.map((column) => (
                    <div key={column.id} id={column.id} className="flex flex-col w-72 shrink-0 group">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{column.title}</h3>
                            <Badge variant="secondary" className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                                {items[column.id]?.length || 0}
                            </Badge>
                        </div>
                        <div className="flex-1 bg-slate-100/40 dark:bg-slate-900/40 rounded-2xl p-3 border-2 border-dashed border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-800 transition-colors min-h-[500px]">
                            <div className="space-y-4">
                                {items[column.id]?.map((job) => (
                                    <Card key={job.id} id={job.id} className="shadow-sm border-none dark:bg-slate-800 hover:shadow-xl hover:scale-[1.02] transition-all cursor-grab active:cursor-grabbing ring-1 ring-slate-200/60 dark:ring-slate-700/60 overflow-hidden">
                                        <CardContent className="p-4">
                                            <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase mb-2">{job.client.name}</p>
                                            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">{job.title}</div>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{job.description}</div>
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline" className="text-[9px] px-1.5 py-0 uppercase border-slate-200 dark:border-slate-700 text-slate-500 font-normal">
                                                    {job._count?.applications || 0} Apps
                                                </Badge>
                                                <span className="text-[10px] text-slate-400">{new Date(job.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                <DragOverlay>
                    {activeItem ? (
                        <Card className="shadow-2xl border-2 border-purple-500 w-72 rotate-3 opacity-90 scale-105 transition-transform dark:bg-slate-800">
                            <CardContent className="p-4">
                                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">{activeItem.title}</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">{activeItem.client.name}</div>
                            </CardContent>
                        </Card>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
