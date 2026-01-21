import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
    Mail,
    Phone,
    Calendar,
    FileText,
    Download,
    Plus,
    Edit,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { CVUpload } from "@/components/candidates/CVUpload";

interface CandidatePageProps {
    params: { id: string };
}

export default async function CandidateDetailPage({ params }: CandidatePageProps) {
    const candidate = await prisma.candidate.findUnique({
        where: { id: params.id },
        include: {
            applications: {
                where: { deletedAt: null },
                include: {
                    job: {
                        include: { client: true }
                    }
                },
                orderBy: { appliedAt: 'desc' },
            },
            cvs: {
                where: { deletedAt: null },
                orderBy: { uploadedAt: 'desc' },
            },
        },
    });

    if (!candidate || candidate.deletedAt) {
        notFound();
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900">{candidate.firstName} {candidate.lastName}</h1>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 uppercase tracking-wider text-[10px]">
                                {candidate.status}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {candidate.email}
                            </span>
                            {candidate.phone && (
                                <span className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    {candidate.phone}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Apply to Job
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Summary & Skills */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Technical Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-slate-900 mb-3">Skills & Expertise</h4>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                                            {skill}
                                        </Badge>
                                    ))}
                                    {candidate.skills.length === 0 && (
                                        <p className="text-sm text-slate-400">No skills listed.</p>
                                    )}
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <h4 className="text-sm font-medium text-slate-900 mb-2">Metadata</h4>
                                <dl className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <dt className="text-slate-500">Source</dt>
                                        <dd className="text-slate-900 font-medium">LinkedIn</dd>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <dt className="text-slate-500">Experience</dt>
                                        <dd className="text-slate-900 font-medium">5+ Years</dd>
                                    </div>
                                </dl>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-indigo-50/50">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-indigo-900">Recent CVs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {candidate.cvs.length === 0 ? (
                                <div className="text-center py-6 text-indigo-400 text-sm italic">
                                    No CVs uploaded yet.
                                </div>
                            ) : (
                                candidate.cvs.map((cv) => (
                                    <div key={cv.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-indigo-100">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-indigo-500" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-slate-900 truncate max-w-[120px]">{cv.fileName}</p>
                                                <p className="text-[10px] text-slate-500 uppercase">{new Date(cv.uploadedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                            <CVUpload candidateId={candidate.id} />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Applications History */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="applications" className="space-y-6">
                        <TabsList className="bg-white border border-slate-200 p-1">
                            <TabsTrigger value="applications" className="px-6">Applications ({candidate.applications.length})</TabsTrigger>
                            <TabsTrigger value="history" className="px-6">Experience History</TabsTrigger>
                            <TabsTrigger value="notes" className="px-6">Recruitment Notes</TabsTrigger>
                        </TabsList>

                        <TabsContent value="applications">
                            <div className="space-y-4">
                                {candidate.applications.length === 0 ? (
                                    <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                                        Candidate hasn&apos;t applied to any jobs yet.
                                    </div>
                                ) : (
                                    candidate.applications.map((app) => (
                                        <Card key={app.id} className="border-none shadow-sm overflow-hidden hover:ring-2 hover:ring-purple-100 transition-all">
                                            <CardContent className="p-5">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-3 bg-blue-50 rounded-xl">
                                                            <Briefcase className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">{app.job.title}</h4>
                                                            <p className="text-sm text-slate-500 mt-0.5">{app.job.client.name}</p>
                                                            <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Badge className={`uppercase tracking-tighter text-[9px] ${app.status === 'HIRED' ? 'bg-green-100 text-green-700' :
                                                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {app.status}
                                                    </Badge>
                                                </div>
                                                {app.notes && (
                                                    <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 italic">
                                                        &quot;{app.notes}&quot;
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="history">
                            <Card className="border-none shadow-sm">
                                <CardContent className="p-8 text-center text-slate-400">
                                    Detailed professional experience and education history will be parsed from CV.
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="notes">
                            <Card className="border-none shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-semibold">Internal Recruiter Notes</CardTitle>
                                    <Button variant="ghost" size="sm" className="text-purple-600">Add Note</Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-sm text-slate-400 italic">No internal notes for this candidate yet.</div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
