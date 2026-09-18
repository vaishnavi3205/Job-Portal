import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSaveJob, setSavedJobs, setAllAppliedJobs } from '@/redux/jobSlice';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { BookmarkCheck, Briefcase, DollarSign, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT, USER_API_END_POINT } from '@/utils/constants';

const SavedJobTable = () => {
    const { savedJobs, allJobs, allAppliedJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch synced saved jobs from backend
    useEffect(() => {
        const fetchSavedJobs = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`, { withCredentials: true });
                if (res.data.success && Array.isArray(res.data.savedJobs)) {
                    const ids = res.data.savedJobs.map(j => typeof j === 'object' ? j._id : j);
                    dispatch(setSavedJobs(ids));
                }
            } catch (err) {
                console.info("Unable to sync saved jobs from backend:", err?.message);
            }
        };
        fetchSavedJobs();
    }, [user, dispatch]);

    // Filter jobs matching the saved IDs
    const bookmarkedList = (allJobs || []).filter(job => savedJobs?.includes(job._id));

    const handleRemove = async (e, jobId) => {
        e.stopPropagation();
        dispatch(toggleSaveJob(jobId));
        toast.info("Job removed from bookmarks");

        if (user) {
            try {
                await axios.post(`${USER_API_END_POINT}/save-job/${jobId}`, {}, { withCredentials: true });
            } catch (err) {
                console.warn("Backend bookmark sync failed:", err?.message);
            }
        }
    };

    const handleApply = async (e, job) => {
        e.stopPropagation();
        if (!user) {
            toast.error("Please log in to apply");
            navigate("/login");
            return;
        }
        if (user.role === "recruiter") {
            toast.error("Recruiter accounts cannot apply for jobs");
            return;
        }

        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${job._id}`, {}, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message || `Successfully applied to ${job.title} at ${job.company?.name}!`);
                try {
                    const appliedRes = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
                    if (appliedRes.data.success && Array.isArray(appliedRes.data.applications)) {
                        dispatch(setAllAppliedJobs(appliedRes.data.applications));
                    }
                } catch (err) {}
            }
        } catch (error) {
            console.error("Application error:", error);
            toast.error(error.response?.data?.message || "Failed to apply for job");
        }
    };

    if (!bookmarkedList || bookmarkedList.length === 0) {
        return (
            <div className="text-center py-12 px-4 bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                    <BookmarkCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">No Saved Jobs Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Bookmark interesting job postings and internships while exploring to review and apply to them later.
                </p>
                <Button 
                    onClick={() => navigate('/jobs')} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2 rounded-xl shadow-xs"
                >
                    Explore Job Openings
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="text-xs font-medium text-slate-500 mb-2 flex items-center justify-between">
                <span>You have saved <strong>{bookmarkedList.length}</strong> {bookmarkedList.length === 1 ? 'position' : 'positions'}</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {bookmarkedList.map((job) => {
                    const isApplied = allAppliedJobs?.some(app => app?.job?._id === job._id);
                    return (
                        <div 
                            key={job._id}
                            onClick={() => navigate(`/description/${job._id}`)}
                            className="p-4 rounded-xl border border-slate-200/80 hover:border-indigo-200 bg-white hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="w-12 h-12 rounded-xl border border-slate-200/80 p-1 flex items-center justify-center bg-slate-50 shrink-0">
                                    <Avatar className="w-full h-full rounded-lg">
                                        <AvatarImage src={job?.company?.logo} className="object-contain" />
                                    </Avatar>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {job?.title}
                                        </h3>
                                        {isApplied && (
                                            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                Applied
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        {job?.company?.name} • {job?.location}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-slate-600">
                                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                                            <Briefcase className="w-3 h-3 text-slate-400" />
                                            {job?.jobType}
                                        </span>
                                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">
                                            <DollarSign className="w-3 h-3 text-emerald-500" />
                                            {job?.salary} LPA
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => handleRemove(e, job._id)}
                                    className="border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 h-8 px-2.5 rounded-lg text-xs cursor-pointer"
                                    title="Remove from saved"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                                
                                {isApplied ? (
                                    <Button 
                                        size="sm"
                                        variant="ghost"
                                        disabled
                                        className="h-8 px-3 text-xs bg-slate-100 text-slate-400 cursor-not-allowed rounded-lg"
                                    >
                                        Already Applied
                                    </Button>
                                ) : (
                                    <Button 
                                        size="sm"
                                        onClick={(e) => handleApply(e, job)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs h-8 px-3.5 rounded-lg shadow-xs cursor-pointer"
                                    >
                                        Apply Now
                                    </Button>
                                )}

                                <Button 
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => navigate(`/description/${job._id}`)}
                                    className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 h-8 px-2 rounded-lg text-xs cursor-pointer"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SavedJobTable;
