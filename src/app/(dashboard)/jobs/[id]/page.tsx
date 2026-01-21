import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
    Briefcase,
    Building2,
    Users,
    Calendar,
    DollarSign,
    MapPin,
    Clock,
    Plus,
    Edit,
    ChevronRight,
    TrendingUp,
    LayoutGrid,
    Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import KanbanBoard from "@/components/kanban/KanbanBoard";

export const dynamic = 'force-dynamic';

interface JobPageProps {
    params: { id: string };
}

export default async function JobDetailPage({ params }: JobPageProps) {
    const job = await prisma.job.findUnique({
        where: { id: params.id },
        include: {
            client: true,
            applications: {
                where: { deletedAt: null },
                include: {
                    candidate: true
                }
            }
        },
    });

    if (!job || job.deletedAt) {
        notFound();
    }

    const candidatesInPipeline = job.applications.map(app => ({
        ...app.candidate,
        status: app.status // Use application status for kanban
    }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Link href="/dashboard/jobs" className="hover:text-purple-600 transition-colors">Jobs</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900 truncate max-w-[200px]">{job.title}</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-blue-100 rounded-2xl shadow-inner">
                        <Briefcase className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{job.title}</h1>
                            <Badge variant={job.status === 'OPEN' ? 'default' : 'secondary'} className={`uppercase tracking-widest text-[9px] px-2 ${job.status === 'OPEN' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' : ''
                                }`}>
                                {job.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                            <Link href={`/dashboard/clients/${job.client.id}`} className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors group">
                                <Building2 className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                                <span className="font-semibold">{job.client.name}</span>
                            </Link>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 text-sm flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="font-semibold">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Job
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-md font-semibold" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Sourcing
                    </Button>
                </div>
            </div>

            {/* Stats Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Applied", value: job.applications.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Interviews", value: job.applications.filter(a => a.status === 'INTERVIEW').length, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Pipeline Health", value: "Great", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Time to Fill", value: "12 days", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1.5">{stat.label}</p>
                            <p className="text-lg font-bold text-slate-900 leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <Tabs defaultValue="pipeline" className="space-y-6">
                        <TabsList className="bg-white/50 backdrop-blur-md border border-slate-200 p-1 inline-flex w-auto self-start">
                            <TabsTrigger value="pipeline" className="px-6 flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4" />
                                Kanban Pipeline
                            </TabsTrigger>
                            <TabsTrigger value="applicants" className="px-6">Applicants ({job.applications.length})</TabsTrigger>
                            <TabsTrigger value="description" className="px-6">Position Details</TabsTrigger>
                        </TabsList>

                        <TabsContent value="pipeline" className="focus-visible:ring-0">
                            <KanbanBoard candidates={candidatesInPipeline} />
                        </TabsContent>

                        <TabsContent value="applicants">
                            <div className="space-y-4">
                                {job.applications.length === 0 ? (
                                    <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-100">
                                        <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-sm font-medium">No candidates in the pipeline yet.</p>
                                        <Button variant="link" className="text-blue-600 mt-2">Start sourcing candidates</Button>
                                    </div>
                                ) : (
                                    job.applications.map((app) => (
                                        <Card key={app.id} className="border-none shadow-sm hover:shadow-md transition-all group">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                        {app.candidate.firstName[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">{app.candidate.firstName} {app.candidate.lastName}</h4>
                                                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {app.candidate.email}</span>
                                                            <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100">
                                                        {app.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="icon" className="text-slate-400">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="description">
                            <Card className="border-none shadow-sm">
                                <CardContent className="p-8 space-y-8">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 border-l-4 border-blue-500 pl-3 mb-4 uppercase tracking-wider">Job Description</h4>
                                        <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                            {job.description || "No description provided."}
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 border-l-4 border-indigo-500 pl-3 mb-4 uppercase tracking-wider">Requirements</h4>
                                        <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                            {job.requirements || "No specific requirements listed."}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Quick Facts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Target Budget</p>
                                <div className="flex items-center gap-2 text-xl font-extrabold text-green-400">
                                    <DollarSign className="w-5 h-5" />
                                    $120k - $160k
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Location Type</p>
                                <div className="flex items-center gap-2 text-md font-semibold text-blue-300">
                                    <MapPin className="w-4 h-4" />
                                    Hybrid / Berlin, DE
                                </div>
                            </div>
                            <Separator className="bg-slate-700" />
                            <Button className="w-full bg-blue-500 hover:bg-blue-400 text-slate-900 font-bold">
                                Refer a Candidate
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold text-slate-800">Assigned Recruiters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white">JD</div>
                                <span className="text-sm font-medium text-slate-700">Jane Doe (Owner)</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
