'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function StatusFilter({
    options,
    placeholder = "All Statuses",
    paramKey = "status"
}: {
    options: string[],
    placeholder?: string,
    paramKey?: string
}) {
    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleSelect = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== 'ALL') {
            params.set(paramKey, value);
        } else {
            params.delete(paramKey);
        }

        startTransition(() => {
            replace(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <Select
            defaultValue={searchParams.get(paramKey) || 'ALL'}
            onValueChange={handleSelect}
            disabled={isPending}
        >
            <SelectTrigger className="w-[180px] bg-white border-slate-200">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {options.map(opt => (
                    <SelectItem key={opt} value={opt} className="capitalize">
                        {opt.toLowerCase().replace('_', ' ')}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
