'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createCandidate, updateCandidate } from '@/lib/actions/candidates';
import { useRouter } from 'next/navigation';
import { CandidateStatus } from '@prisma/client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const candidateSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    status: z.nativeEnum(CandidateStatus),
    skills: z.string().optional(),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

interface CandidateFormProps {
    initialData?: CandidateFormValues & { id: string, skills: string[] };
    onSuccess?: () => void;
}

export function CandidateForm({ initialData, onSuccess }: CandidateFormProps) {
    const router = useRouter();
    const form = useForm<CandidateFormValues>({
        resolver: zodResolver(candidateSchema),
        defaultValues: initialData ? {
            ...initialData,
            skills: initialData.skills?.join(', ') || ''
        } : {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            status: CandidateStatus.LEAD,
            skills: '',
        },
    });

    const isLoading = form.formState.isSubmitting;

    async function onSubmit(values: CandidateFormValues) {
        try {
            const data = {
                ...values,
                skills: values.skills ? values.skills.split(',').map(s => s.trim()) : []
            };

            if (initialData?.id) {
                await updateCandidate(initialData.id, data);
                toast.success('Candidate updated successfully');
            } else {
                await createCandidate(data);
                toast.success('Candidate added successfully');
            }
            router.refresh();
            onSuccess?.();
        } catch {
            toast.error('Failed to save candidate');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input placeholder="+1 234 567 890" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Global Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(CandidateStatus).map(status => (
                                        <SelectItem key={status} value={status}>
                                            {status.charAt(0) + status.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Skills (comma separated)</FormLabel>
                            <FormControl>
                                <Input placeholder="React, TypeScript, Node.js" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                        {isLoading ? 'Saving...' : 'Save Candidate'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
