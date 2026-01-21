'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadCV } from '@/lib/actions/cv';

export function CVUpload({ candidateId }: { candidateId: string }) {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            await uploadCV(candidateId, formData);
            toast.success('CV uploaded successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to upload CV';
            toast.error(message);
        } finally {
            setIsUploading(false);
        }
    }, [candidateId]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxFiles: 1,
        multiple: false,
    });

    return (
        <div
            {...getRootProps()}
            className={`
        relative border-2 border-dashed rounded-xl p-8 transition-all text-center cursor-pointer
        ${isDragActive ? 'border-purple-500 bg-purple-50/50' : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'}
        ${isUploading ? 'pointer-events-none opacity-60' : ''}
      `}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
                {isUploading ? (
                    <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
                ) : (
                    <Upload className={`w-10 h-10 mb-4 ${isDragActive ? 'text-purple-600' : 'text-slate-400'}`} />
                )}
                <h4 className="font-semibold text-slate-900 mb-1">
                    {isUploading ? 'Uploading...' : 'Drop CV here or click to upload'}
                </h4>
                <p className="text-xs text-slate-500">
                    PDF or DOCX (Max 10MB)
                </p>
            </div>
        </div>
    );
}
