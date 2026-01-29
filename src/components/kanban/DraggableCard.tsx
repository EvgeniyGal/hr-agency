'use client';

import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent } from '@/components/ui/card';

interface DraggableCardProps {
    id: string;
    children: React.ReactNode;
}

export default function DraggableCard({ id, children }: DraggableCardProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: id,
    });

    const style = isDragging ? {
        opacity: 0.5,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <Card className="shadow-sm border-none hover:shadow-xl hover:scale-[1.02] transition-all cursor-grab active:cursor-grabbing ring-1 ring-slate-200/60 overflow-hidden">
                <CardContent className="p-4">
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}
