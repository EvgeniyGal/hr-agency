import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
    Building2,
    Mail,
    Phone,
    Globe,
    Calendar,
    ExternalLink,
    Edit,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface ClientPageProps {
    params: { id: string };
}

export default async function ClientDetailPage({ params }: ClientPageProps) {
    const client = await prisma.client.findUnique({
        where: { id: params.id },
        include: {
            jobs: {
                where: { deletedAt: null },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!client || client.deletedAt) {
        notFound();
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-purple-100 rounded-2xl">
                        <Building2 className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-slate-900">{client.name}</h1>
                            {client.industry && (
                                <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                                    {client.industry}
                                </Badge>
                            )}
                        </div>
                        <p className="text-slate-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Client since {new Date(client.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info Card */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {client.email && (
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Mail className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm">{client.email}</span>
                                </div>
                            )}
                            {client.phone && (
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Phone className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm">{client.phone}</span>
                                </div>
                            )}
                            {client.website && (
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Globe className="w-4 h-4 text-purple-500" />
                                    <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-purple-600 flex items-center gap-1">
                                        {client.website.replace(/^https?:\/\//, '')}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            )}
                            <Separator className="my-4" />
                            <div>
                                <h4 className="text-sm font-medium text-slate-900 mb-2">About</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {client.description || 'No description provided.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Jobs & Activity */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="jobs" className="space-y-6">
                        <TabsList className="bg-white border border-slate-200">
                            <TabsTrigger value="jobs" className="data-[state=active]:bg-slate-100">Jobs ({client.jobs.length})</TabsTrigger>
                            <TabsTrigger value="applications" className="data-[state=active]:bg-slate-100">Applications</TabsTrigger>
                            <TabsTrigger value="activity" className="data-[state=active]:bg-slate-100">Activity</TabsTrigger>
                        </TabsList>

                        <TabsContent value="jobs">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {client.jobs.length === 0 ? (
                                    <div className="col-span-2 py-12 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                                        No jobs posted yet for this client.
                                    </div>
                                ) : (
                                    client.jobs.map((job) => (
                                        <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                                            <Card className="hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group">
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-semibold text-slate-900 group-hover:text-purple-600">{job.title}</h4>
                                                        <Badge variant={job.status === 'OPEN' ? 'default' : 'secondary'} className="text-[10px]">
                                                            {job.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(job.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="applications">
                            <Card className="border-none shadow-sm">
                                <CardContent className="p-8 text-center text-slate-400">
                                    Candidate applications for this client&apos;s jobs will appear here.
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="activity">
                            <Card className="border-none shadow-sm">
                                <CardContent className="p-8 text-center text-slate-400">
                                    Historical activity log for this client.
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
