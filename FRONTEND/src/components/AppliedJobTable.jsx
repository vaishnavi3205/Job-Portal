import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Clock, CheckCircle2, AlertCircle, Briefcase, ExternalLink, Search, ChevronDown, ChevronUp, Undo2, Check } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constants';
import { setAllAppliedJobs } from '@/redux/jobSlice';

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job || {});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchFilter, setSearchFilter] = useState('');
    const [expandedAppId, setExpandedAppId] = useState(null);

    const applications = allAppliedJobs || [];

    const handleWithdraw = async (applicationId, jobTitle) => {
        if (!window.confirm(`Are you sure you want to withdraw your application for "${jobTitle}"?`)) {
            return;
        }

        try {
            const res = await axios.delete(`${APPLICATION_API_END_POINT}/withdraw/${applicationId}`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setAllAppliedJobs(applications.filter(a => a._id !== applicationId)));
                toast.success(res.data.message || "Application withdrawn successfully");
            }
        } catch (error) {
            console.error("Withdraw error:", error);
            toast.error(error.response?.data?.message || "Failed to withdraw application");
        }
    };

    // Filter applications
    const filteredApps = applications.filter(app => {
        const s = app?.status?.toLowerCase();
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'shortlisted' ? (s === 'shortlisted' || s === 'accepted') : s === statusFilter.toLowerCase());
        const matchesSearch = 
            app?.job?.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
            app?.job?.company?.name?.toLowerCase().includes(searchFilter.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const counts = {
        total: applications.length,
        shortlisted: applications.filter(a => a?.status === 'shortlisted' || a?.status === 'accepted').length,
        pending: applications.filter(a => a?.status === 'pending').length,
        rejected: applications.filter(a => a?.status === 'rejected').length
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Accepted
                    </span>
                );
            case 'shortlisted':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Shortlisted
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Pending / Under Review
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {status || 'Submitted'}
                    </span>
                );
        }
    };

    const renderStepper = (status) => {
        const norm = status?.toLowerCase() || 'pending';
        const steps = [
            { id: 'submitted', label: 'Submitted', done: true },
            { id: 'review', label: 'Under Review', done: norm === 'pending' || norm === 'shortlisted' || norm === 'accepted' || norm === 'rejected' },
            { id: 'shortlist', label: 'Shortlisted', done: norm === 'shortlisted' || norm === 'accepted' },
            { id: 'decision', label: norm === 'rejected' ? 'Not Selected' : 'Decision Ready', done: norm === 'accepted' || norm === 'rejected' }
        ];

        return (
            <div className="py-3 px-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="w-full flex items-center justify-between max-w-lg mx-auto relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                    {steps.map((step, idx) => {
                        const isDone = step.done;
                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center gap-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                    isDone 
                                        ? (step.id === 'decision' && norm === 'rejected' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white shadow-xs') 
                                        : 'bg-white border border-slate-300 text-slate-400'
                                }`}>
                                    {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                                </div>
                                <span className={`text-[10px] font-medium whitespace-nowrap ${isDone ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div 
                    onClick={() => setStatusFilter('all')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${statusFilter === 'all' ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20' : 'border-slate-200/80 bg-white hover:border-slate-300'}`}
                >
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Total Applied</p>
                    <p className="text-xl font-bold text-slate-900 mt-0.5">{counts.total}</p>
                </div>
                <div 
                    onClick={() => setStatusFilter('pending')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${statusFilter === 'pending' ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20' : 'border-slate-200/80 bg-white hover:border-slate-300'}`}
                >
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-amber-600">Under Review</p>
                    <p className="text-xl font-bold text-amber-700 mt-0.5">{counts.pending}</p>
                </div>
                <div 
                    onClick={() => setStatusFilter('shortlisted')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${statusFilter === 'shortlisted' ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20' : 'border-slate-200/80 bg-white hover:border-slate-300'}`}
                >
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-emerald-600">Shortlisted</p>
                    <p className="text-xl font-bold text-emerald-700 mt-0.5">{counts.shortlisted}</p>
                </div>
                <div 
                    onClick={() => setStatusFilter('rejected')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${statusFilter === 'rejected' ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20' : 'border-slate-200/80 bg-white hover:border-slate-300'}`}
                >
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-rose-600">Not Selected</p>
                    <p className="text-xl font-bold text-rose-700 mt-0.5">{counts.rejected}</p>
                </div>
            </div>

            {/* Filter Search Input */}
            {applications.length > 0 && (
                <div className="flex items-center gap-2 pt-2">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text"
                            placeholder="Filter by role or company..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 text-slate-800"
                        />
                    </div>
                    {statusFilter !== 'all' && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setStatusFilter('all')}
                            className="text-xs text-indigo-600 hover:text-indigo-700 h-8 cursor-pointer"
                        >
                            Reset filter
                        </Button>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-white">
                <Table>
                    <TableCaption className="text-xs text-slate-400 pb-3">
                        Track updates and feedback for all your job applications
                    </TableCaption>
                    <TableHeader className="bg-slate-50/80">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-slate-700 text-xs">Date</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-xs">Company & Role</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-xs">Type / Package</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-xs">Status</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700 text-xs">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredApps.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                    <div className="max-w-xs mx-auto text-center space-y-2">
                                        <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                                        <p className="font-medium text-sm text-slate-700">No applications match your filter</p>
                                        <p className="text-xs text-slate-400">
                                            {applications.length === 0 
                                                ? "You haven't applied to any jobs yet. Check out the latest student positions!" 
                                                : "Try changing your status filter or search query."}
                                        </p>
                                        {applications.length === 0 && (
                                            <Button 
                                                onClick={() => navigate('/jobs')} 
                                                className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-1.5 rounded-lg shadow-xs cursor-pointer"
                                            >
                                                Explore Jobs
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredApps.map((appliedJob) => {
                                const job = appliedJob?.job;
                                const isExpanded = expandedAppId === appliedJob._id;
                                const isPending = appliedJob?.status === "pending";

                                return (
                                    <React.Fragment key={appliedJob?._id}>
                                        <TableRow className="hover:bg-slate-50/60 transition-colors">
                                            <TableCell className="text-xs text-slate-500 font-medium whitespace-nowrap">
                                                {appliedJob?.createdAt?.split("T")[0] || "Recent"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg border border-slate-200/80 p-0.5 flex items-center justify-center bg-slate-50 shrink-0">
                                                        <Avatar className="w-full h-full rounded-md">
                                                            <AvatarImage src={job?.company?.logo} className="object-contain" />
                                                        </Avatar>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 text-sm">{job?.title || "Role Title"}</p>
                                                        <p className="text-xs text-slate-500">{job?.company?.name || "Company"}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                <p className="text-slate-700 font-medium">{job?.jobType || "Full Time"}</p>
                                                <p className="text-slate-500">₹{job?.salary ? `${job.salary} LPA` : "Disclosed"}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(appliedJob?.status)}
                                                    <button
                                                        onClick={() => setExpandedAppId(isExpanded ? null : appliedJob._id)}
                                                        className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                                                        title={isExpanded ? "Hide timeline" : "View timeline"}
                                                    >
                                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {isPending && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleWithdraw(appliedJob._id, job?.title || "this job")}
                                                            className="text-rose-600 hover:bg-rose-50 text-xs h-8 px-2 rounded-lg gap-1 cursor-pointer"
                                                            title="Withdraw application"
                                                        >
                                                            <Undo2 className="w-3.5 h-3.5" />
                                                            <span className="hidden sm:inline">Withdraw</span>
                                                        </Button>
                                                    )}
                                                    {job?._id && (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => navigate(`/description/${job._id}`)}
                                                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 text-xs font-medium h-8 px-2.5 rounded-lg cursor-pointer"
                                                        >
                                                            View Job <ExternalLink className="w-3 h-3 ml-1" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {isExpanded && (
                                            <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
                                                <TableCell colSpan={5} className="p-0">
                                                    {renderStepper(appliedJob?.status)}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AppliedJobTable;