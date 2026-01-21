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
import { updateProfile } from '@/lib/actions/profile';
import { uploadAvatar } from '@/lib/actions/avatar';
import { Separator } from '@/components/ui/separator';
import { useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    initialData: { name: string; email: string, image?: string };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: initialData.name,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            await uploadAvatar(formData);
            toast.success('Avatar updated successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to upload avatar';
            toast.error(message);
        } finally {
            setIsUploading(false);
        }
    };

    async function onSubmit(data: ProfileFormValues) {
        try {
            await updateProfile(data);
            toast.success('Profile updated successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update profile';
            toast.error(message);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-4 border-purple-100">
                        {initialData.image ? (
                            <Image src={initialData.image} alt="Profile" width={80} height={80} className="w-full h-full object-cover" />
                        ) : (
                            initialData.name?.charAt(0)
                        )}
                    </div>
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAvatarClick}
                            disabled={isUploading}
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Change Avatar
                        </Button>
                    </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid gap-2">
                        <FormLabel className="text-slate-500">Email Address</FormLabel>
                        <Input defaultValue={initialData.email} disabled className="bg-slate-50 border-slate-100" />
                        <p className="text-[10px] text-slate-400">Email cannot be changed directly.</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
