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
import { updateApplicationStatus } from '@/lib/actions/applications';
import { updateCandidateStatus } from '@/lib/actions/candidates';
import { ApplicationStatus, CandidateStatus } from '@prisma/client';
import { toast } from 'sonner';

// Unified status type
const APP_COLUMNS = [
    { id: 'APPLIED', title: 'Applied' },
    { id: 'SCREENING', title: 'Screening' },
    { id: 'INTERVIEW', title: 'Interview' },
    { id: 'OFFER', title: 'Offer' },
    { id: 'HIRED', title: 'Hired' },
    { id: 'REJECTED', title: 'Rejected' },
];

const CANDIDATE_COLUMNS = [
    { id: 'LEAD', title: 'Lead' },
    { id: 'CONTACTED', title: 'Contacted' },
    { id: 'INTERVIEWING', title: 'Interviewing' },
    { id: 'PLACED', title: 'Placed' },
    { id: 'REJECTED', title: 'Rejected' },
];

interface Candidate {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    skills?: string[];
    job?: { title: string };
    applicationId?: string;
}

export default function KanbanBoard({ candidates, isGlobal = false }: { candidates: Candidate[], isGlobal?: boolean }) {
    const columns = isGlobal ? CANDIDATE_COLUMNS : APP_COLUMNS;
    const [, startTransition] = useTransition();
    const [items, setItems] = useState<{ [key: string]: Candidate[] }>(() => {
        const initial: { [key: string]: Candidate[] } = {};
        columns.forEach(col => {
            initial[col.id] = candidates.filter(c => c.status === col.id);
        });
        return initial;
    });

    const [activeItem, setActiveItem] = useState<Candidate | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const item = candidates.find(c => c.id === active.id);
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
                        if (isGlobal) {
                            await updateCandidateStatus(activeId, destCol as CandidateStatus);
                        } else if (activeItemLocal.applicationId) {
                            await updateApplicationStatus(activeItemLocal.applicationId, destCol as ApplicationStatus);
                        }
                        toast.success(`Moved to ${destCol}`);
                    } catch {
                        toast.error('Failed to update status');
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
                {columns.map((column) => (
                    <div key={column.id} id={column.id} className="flex flex-col w-72 shrink-0 group">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{column.title}</h3>
                            <Badge variant="secondary" className="bg-slate-200 text-slate-600 text-[10px]">
                                {items[column.id]?.length || 0}
                            </Badge>
                        </div>
                        <div className="flex-1 bg-slate-100/40 rounded-2xl p-3 border-2 border-dashed border-transparent group-hover:border-slate-200 transition-colors min-h-[500px]">
                            <div className="space-y-4">
                                {items[column.id]?.map((candidate) => (
                                    <Card key={candidate.id} id={candidate.id} className="shadow-sm border-none hover:shadow-xl hover:scale-[1.02] transition-all cursor-grab active:cursor-grabbing ring-1 ring-slate-200/60 overflow-hidden">
                                        <CardContent className="p-4">
                                            {candidate.job && <p className="text-[10px] font-bold text-blue-600 uppercase mb-2">{candidate.job.title}</p>}
                                            <div className="font-bold text-slate-900 text-sm mb-1">{candidate.firstName} {candidate.lastName}</div>
                                            <div className="text-[11px] text-slate-500 line-clamp-1 mb-3">{candidate.email}</div>
                                            <div className="flex flex-wrap gap-1">
                                                {candidate.skills?.slice(0, 2).map((skill: string) => (
                                                    <Badge key={skill} variant="outline" className="text-[9px] px-1.5 py-0 uppercase border-slate-200 text-slate-500 font-normal">
                                                        {skill}
                                                    </Badge>
                                                ))}
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
                        <Card className="shadow-2xl border-2 border-purple-500 w-72 rotate-3 opacity-90 scale-105 transition-transform">
                            <CardContent className="p-4">
                                <div className="font-bold text-slate-900 text-sm mb-1">{activeItem.firstName} {activeItem.lastName}</div>
                                <div className="text-[11px] text-slate-500">{activeItem.email}</div>
                            </CardContent>
                        </Card>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
