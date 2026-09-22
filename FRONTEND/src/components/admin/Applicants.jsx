import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { 
    ArrowLeft, 
    Users, 
    Briefcase, 
    Building2, 
    Search, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    SlidersHorizontal,
    Sparkles,
    GraduationCap
} from 'lucide-react';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constants';

const Applicants = () => {
    const params = useParams();
    const jobId = params.id;
    const navigate = useNavigate();
    const { allJobs, adminJobs } = useSelector(store => store.job);

    const [jobDetails, setJobDetails] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'accepted', 'rejected'
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch or find job
    useEffect(() => {
        const found = (adminJobs || []).find(j => j._id === jobId) ||
            (allJobs || []).find(j => j._id === jobId);
        if (found) {
            setJobDetails(found);
        }

        const fetchApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, {
                    withCredentials: true
                });
                if (res.data.success && res.data.job) {
                    setJobDetails(res.data.job);
                }
            } catch (error) {
                console.warn("Applicants fetch error (handled gracefully):", error?.message);
            }
        };

        fetchApplicants();
    }, [jobId, adminJobs, allJobs]);

    const applications = jobDetails?.applications || [];

    // Filter applications by search query and status tab
    const filteredApplications = useMemo(() => {
        return applications.filter(item => {
            const status = (item?.status || 'pending').toLowerCase();
            const applicant = item?.applicant;
            const profile = applicant?.profile || {};

            // Status filter
            let matchesStatus = true;
            if (statusFilter === 'pending') {
                matchesStatus = status === 'pending';
            } else if (statusFilter === 'accepted') {
                matchesStatus = status === 'accepted' || status === 'shortlisted';
            } else if (statusFilter === 'rejected') {
                matchesStatus = status === 'rejected';
            }

            // Search filter (name, email, college, skills)
            let matchesSearch = true;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const name = applicant?.fullname?.toLowerCase() || '';
                const email = applicant?.email?.toLowerCase() || '';
                const college = profile?.college?.toLowerCase() || '';
                const skillsStr = Array.isArray(profile?.skills) 
                    ? profile.skills.join(' ').toLowerCase() 
                    : (profile?.skills?.toLowerCase() || '');

                matchesSearch = name.includes(q) || email.includes(q) || college.includes(q) || skillsStr.includes(q);
            }

            return matchesStatus && matchesSearch;
        });
    }, [applications, statusFilter, searchQuery]);

    // Compute metric counts
    const counts = useMemo(() => {
        const total = applications.length;
        const accepted = applications.filter(a => (a?.status === 'accepted' || a?.status === 'shortlisted')).length;
        const pending = applications.filter(a => (!a?.status || a?.status === 'pending')).length;
        const rejected = applications.filter(a => a?.status === 'rejected').length;
        return { total, accepted, pending, rejected };
    }, [applications]);

    const handleStatusChange = (applicationId, newStatus) => {
        setJobDetails(prev => {
            if (!prev || !Array.isArray(prev.applications)) return prev;
            return {
                ...prev,
                applications: prev.applications.map(app => {
                    if (app._id === applicationId) {
                        return { ...app, status: newStatus };
                    }
                    return app;
                })
            };
        });
    };

    return (
        <div className="min-h-screen bg-slate-50/60 pb-16">
            <Navbar />
            <div className="max-w-6xl mx-auto my-8 px-4 space-y-6">
                {/* Back Button */}
                <Button 
                    onClick={() => navigate("/admin/jobs")} 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Posted Openings
                </Button>

                {/* Job Summary Banner */}
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                            <Users className="w-3.5 h-3.5" /> Recruiter Evaluation Board
                        </div>
                        <h1 className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
                            Applicants for {jobDetails?.title || "Position"}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                            <span className="text-slate-800 font-semibold flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                {jobDetails?.company?.name || "Company"}
                            </span>
                            <span>•</span>
                            <span>{jobDetails?.location || "Location"}</span>
                            <span>•</span>
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">{jobDetails?.jobType || "Full Time"}</span>
                            {jobDetails?.salary && (
                                <>
                                    <span>•</span>
                                    <span className="text-emerald-700 font-bold">₹{jobDetails.salary} LPA</span>
                                </>
                            )}
                        </div>

                        {/* Requirements tag list */}
                        {jobDetails?.requirements && jobDetails.requirements.length > 0 && (
                            <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Required Skills:</span>
                                {jobDetails.requirements.map((req, idx) => (
                                    <span key={idx} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/70">
                                        {req}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Stats summary boxes */}
                    <div className="flex items-center gap-2.5 bg-slate-50/90 p-3 rounded-2xl border border-slate-200/80 shrink-0 self-start md:self-auto">
                        <div className="text-center px-3 border-r border-slate-200">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Received</p>
                            <p className="text-2xl font-black text-indigo-600">{counts.total}</p>
                        </div>
                        <div className="text-center px-3 border-r border-slate-200">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Shortlisted</p>
                            <p className="text-2xl font-black text-emerald-600">{counts.accepted}</p>
                        </div>
                        <div className="text-center px-3">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Positions</p>
                            <p className="text-2xl font-black text-slate-800">{jobDetails?.position || 1}</p>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Status Tabs */}
                    <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => setStatusFilter('all')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                statusFilter === 'all'
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            All ({counts.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('accepted')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                statusFilter === 'accepted'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Accepted ({counts.accepted})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('pending')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                statusFilter === 'pending'
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'text-amber-700 hover:bg-amber-50'
                            }`}
                        >
                            <Clock className="w-3.5 h-3.5" />
                            Under Review ({counts.pending})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('rejected')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                statusFilter === 'rejected'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'text-rose-700 hover:bg-rose-50'
                            }`}
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            Rejected ({counts.rejected})
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search candidate name, email, college, or skill..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                        />
                    </div>
                </div>

                {/* Applicants Review Table */}
                <ApplicantsTable 
                    jobId={jobId} 
                    applications={filteredApplications}
                    jobRequirements={jobDetails?.requirements || []}
                    onStatusChange={handleStatusChange}
                />
            </div>
        </div>
    );
};

export default Applicants;
