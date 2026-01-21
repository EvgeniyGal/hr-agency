export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <div className="relative w-12 h-12">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-100 rounded-full" />
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-600 rounded-full border-t-transparent animate-spin" />
            </div>
            <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
        </div>
    );
}
