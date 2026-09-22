import React, { useState } from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSaveJob, setAllAppliedJobs } from '@/redux/jobSlice';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constants';

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { savedJobs, allAppliedJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isStudent = Boolean(user && user.role === "student");
    const [isApplying, setIsApplying] = useState(false);

    const isSaved = savedJobs?.includes(job?._id);
    const isApplied = allAppliedJobs?.some(app => app?.job?._id === job?._id || app?.job === job?._id);

    const saveJobHandler = async (e) => {
        e.stopPropagation();
        dispatch(toggleSaveJob(job?._id));
        if (!isSaved) {
            toast.success("Job saved to your bookmarks!");
        } else {
            toast.info("Job removed from bookmarks");
        }

        if (user) {
            try {
                await axios.post(`${USER_API_END_POINT}/save-job/${job?._id}`, {}, { withCredentials: true });
            } catch (err) {}
        }
    };

    const handleApply = async (e) => {
        e.stopPropagation();
        if (!user) {
            toast.error("Please login to apply for this position");
            navigate("/login");
            return;
        }

        if (user.role === "recruiter") {
            toast.error("Recruiter accounts cannot apply for jobs");
            return;
        }

        if (isApplied) {
            toast.info("You have already applied for this position");
            return;
        }

        try {
            setIsApplying(true);
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${job?._id}`, {}, {
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message || `Application submitted for ${job?.title}!`);
                
                try {
                    const appliedRes = await axios.get(`${APPLICATION_API_END_POINT}/get`, { 
                        withCredentials: true 
                    });
                    if (appliedRes.data.success && Array.isArray(appliedRes.data.applications)) {
                        dispatch(setAllAppliedJobs(appliedRes.data.applications));
                    }
                } catch (err) {
                    dispatch(setAllAppliedJobs([
                        ...(allAppliedJobs || []), 
                        { _id: `temp-${Date.now()}`, job: job, applicant: user?._id, status: "pending" }
                    ]));
                }
            }
        } catch (error) {
            console.error("Apply job error:", error);
            toast.error(error.response?.data?.message || "Failed to submit application");
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div 
            onClick={() => navigate(`/description/${job?._id}`)}
            className="p-6 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 bg-white border border-slate-200/90 hover:border-indigo-200 flex flex-col justify-between group cursor-pointer"
        >
            <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-base text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {job?.company?.name}
                    </h3>
                    <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200/60">
                        {job?.location || "India"}
                    </span>
                </div>
                <div>
                    <h2 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {job?.title}
                    </h2>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {job?.description}
                    </p>
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {job?.position} Positions
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {job?.jobType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ₹{job?.salary} LPA
                    </span>
                    {isStudent && isApplied && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            ✓ Applied
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/description/${job._id}`);
                        }} 
                        className={`${isStudent ? "flex-1" : "w-full"} border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 text-xs h-9 rounded-xl cursor-pointer transition-colors`}
                    >
                        View Details
                    </Button>
                    {isStudent && (
                        <>
                            <Button 
                                onClick={isApplied ? (e) => { e.stopPropagation(); navigate("/profile?tab=applied"); } : handleApply}
                                disabled={isApplying}
                                className={`flex-1 font-medium text-xs h-9 rounded-xl shadow-xs transition-colors cursor-pointer ${
                                    isApplied 
                                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200" 
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                }`}
                                title={isApplied ? "Already applied — view status in Student Dashboard" : "Apply directly for this position"}
                            >
                                {isApplying ? (
                                    <span className="flex items-center justify-center gap-1.5">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        Applying...
                                    </span>
                                ) : isApplied ? (
                                    "✓ Applied"
                                ) : (
                                    "Apply Now"
                                )}
                            </Button>
                            <Button 
                                onClick={saveJobHandler}
                                variant="outline"
                                size="icon"
                                className={`shrink-0 rounded-xl h-9 w-9 border-slate-200 cursor-pointer ${
                                    isSaved 
                                        ? 'text-indigo-600 border-indigo-300 bg-indigo-50/70' 
                                        : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                                title={isSaved ? "Saved" : "Save for later"}
                            >
                                {isSaved ? <BookmarkCheck className="w-4 h-4 text-indigo-600" /> : <Bookmark className="w-4 h-4" />}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LatestJobCards;