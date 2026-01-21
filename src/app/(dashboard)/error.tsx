'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong!</h2>
            <p className="text-slate-500 mb-8 max-w-md">
                An unexpected error occurred. We&apos;ve been notified and are working on a fix.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} className="bg-purple-600 hover:bg-purple-700">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Try again
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Return Home
                </Button>
            </div>
            {error.digest && (
                <p className="mt-8 text-xs text-slate-400 font-mono">Error ID: {error.digest}</p>
            )}
        </div>
    );
}
