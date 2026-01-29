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
import KanbanColumn from '@/components/kanban/KanbanColumn';
import DraggableCard from '@/components/kanban/DraggableCard';

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
                    <KanbanColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        count={items[column.id]?.length || 0}
                    >
                        {items[column.id]?.map((candidate) => (
                            <DraggableCard key={candidate.id} id={candidate.id}>
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
                            </DraggableCard>
                        ))}
                    </KanbanColumn>
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
