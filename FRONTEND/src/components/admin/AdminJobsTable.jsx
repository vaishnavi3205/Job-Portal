import React, { useMemo } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Eye, MoreHorizontal, Users, Briefcase, ExternalLink, Trash2, Edit2, PowerOff, CheckCircle2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { deleteJobByAdmin, updateJobByAdmin } from '@/redux/jobSlice';
import { toast } from 'sonner';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constants';

const AdminJobsTable = () => {
    const { adminJobs, searchJobByText } = useSelector(store => store.job);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const filteredJobs = useMemo(() => {
        if (!adminJobs) return [];
        return adminJobs.filter(job => {
            if (!searchJobByText) return true;
            return (
                job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job?.location?.toLowerCase().includes(searchJobByText.toLowerCase())
            );
        });
    }, [adminJobs, searchJobByText]);

    const handleDelete = async (e, jobId, title) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete "${title}"? This will also remove all candidate applications for this position.`)) {
            return;
        }

        try {
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                dispatch(deleteJobByAdmin(jobId));
                toast.success(res.data.message || `Job "${title}" deleted successfully`);
            }
        } catch (error) {
            console.error("Backend delete request failed:", error);
            toast.error(error.response?.data?.message || "Failed to delete job listing");
        }
    };

    const handleToggleStatus = async (e, jobId) => {
        e.stopPropagation();
        try {
            const res = await axios.patch(`${JOB_API_END_POINT}/status/${jobId}`, {}, { withCredentials: true });
            if (res.data.success && res.data.job) {
                dispatch(updateJobByAdmin(res.data.job));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Status toggle error:", error);
            toast.error(error.response?.data?.message || "Failed to update job status");
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <Table>
                <TableCaption className="text-xs text-slate-400 pb-3">
                    A list of your posted jobs and current student applicant counts
                </TableCaption>
                <TableHeader className="bg-slate-50/80">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-700 text-xs">Company & Role</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs">Status</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs">Type & Package</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs">Date Posted</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs">Total Applicants</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700 text-xs">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredJobs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                                <div className="max-w-xs mx-auto text-center space-y-2">
                                    <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                                    <p className="font-medium text-sm text-slate-700">No jobs posted yet</p>
                                    <p className="text-xs text-slate-400">
                                        Create job listings to invite student applications.
                                    </p>
                                    <Button 
                                        onClick={() => navigate('/admin/jobs/create')}
                                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-1.5 rounded-lg shadow-xs cursor-pointer"
                                    >
                                        Post New Job
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredJobs.map((job) => {
                            const applicantsCount = job?.applications?.length || 0;
                            const isClosed = job?.status === "closed";

                            return (
                                <TableRow key={job._id} className="hover:bg-slate-50/60 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl border border-slate-200/80 p-1 flex items-center justify-center bg-slate-50 shrink-0">
                                                <Avatar className="w-full h-full rounded-lg">
                                                    <AvatarImage src={job?.company?.logo} className="object-contain" />
                                                </Avatar>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{job?.title}</p>
                                                <p className="text-xs text-slate-500">{job?.company?.name} • {job?.location}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {isClosed ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                                <PowerOff className="w-3 h-3 text-slate-400" /> Closed
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        <p className="font-medium text-slate-800">{job?.jobType}</p>
                                        <p className="text-emerald-700 font-semibold">₹{job?.salary} LPA</p>
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500 font-medium whitespace-nowrap">
                                        {job?.createdAt?.split("T")[0] || "Recent"}
                                    </TableCell>
                                    <TableCell>
                                        <button 
                                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition-colors cursor-pointer"
                                        >
                                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                                            <span>{applicantsCount} {applicantsCount === 1 ? 'Applicant' : 'Applicants'}</span>
                                        </button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 cursor-pointer">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-48 p-1.5 rounded-xl shadow-lg border border-slate-200" align="end">
                                                <button 
                                                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-medium cursor-pointer"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    View Applicants ({applicantsCount})
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/admin/jobs/edit/${job._id}`)}
                                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-medium cursor-pointer"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                    Edit Job
                                                </button>
                                                <button 
                                                    onClick={(e) => handleToggleStatus(e, job._id)}
                                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium cursor-pointer"
                                                >
                                                    <PowerOff className="w-3.5 h-3.5" />
                                                    {isClosed ? "Reopen Applications" : "Close Applications"}
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/description/${job._id}`)}
                                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-medium cursor-pointer"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    Candidate Preview
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDelete(e, job._id, job.title)}
                                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete Job
                                                </button>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;
