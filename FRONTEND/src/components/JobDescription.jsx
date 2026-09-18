import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setSingleJob, toggleSaveJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import { 
    ArrowLeft, 
    Bookmark, 
    BookmarkCheck, 
    Briefcase, 
    DollarSign, 
    MapPin, 
    Users, 
    CheckCircle2, 
    Sparkles, 
    GraduationCap, 
    Gift,
    ExternalLink,
    Share2,
    Check
} from 'lucide-react';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT, USER_API_END_POINT } from '@/utils/constants';

const JobDescription = () => {
    const { singleJob, allJobs, allAppliedJobs, savedJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Check application and saved status
    const isInitiallyApplied = allAppliedJobs?.some(app => app?.job?._id === jobId) || false;

    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    const isSaved = savedJobs?.includes(jobId);

    // Synchronize isApplied if store updates
    useEffect(() => {
        const applied = allAppliedJobs?.some(app => app?.job?._id === jobId) || false;
        setIsApplied(applied);
    }, [allAppliedJobs, jobId]);

    const applyJobHandler = async () => {
        if (!user) {
            toast.error("Please login to apply for this position");
            navigate("/login");
            return;
        }

        if (user.role === "recruiter") {
            toast.error("Recruiter accounts cannot apply for jobs");
            return;
        }

        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                setIsApplied(true);
                toast.success(res.data.message || `Application submitted for ${singleJob?.title || "this job"}!`);
                
                // Re-fetch job to update application counts
                try {
                    const updated = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                    if (updated.data.success && updated.data.job) {
                        dispatch(setSingleJob(updated.data.job));
                    }
                } catch (e) {}
            }
        } catch (error) {
            console.error("Apply job error:", error);
            toast.error(error.response?.data?.message || "Failed to submit application");
        }
    };

    const saveJobHandler = async () => {
        dispatch(toggleSaveJob(jobId));
        if (!isSaved) {
            toast.success("Job saved to your bookmarks!");
        } else {
            toast.info("Job removed from bookmarks");
        }

        if (user) {
            try {
                await axios.post(`${USER_API_END_POINT}/save-job/${jobId}`, {}, { withCredentials: true });
            } catch (err) {
                console.warn("Bookmark sync failed:", err?.message);
            }
        }
    };

    const shareJobHandler = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Job link copied to clipboard!");
        } else {
            toast.info("Share URL: " + window.location.href);
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true
                });
                if (res.data.success && res.data.job) {
                    dispatch(setSingleJob(res.data.job));
                    return;
                }
            } catch (error) {
                console.warn("Could not fetch job from backend:", error?.message);
            }

            const foundJob = (allJobs || []).find(j => j._id === jobId);
            if (foundJob) {
                dispatch(setSingleJob(foundJob));
            }
        };

        fetchJob();
    }, [jobId, dispatch]);

    // Skill Match Calculation
    const candidateSkills = (user?.profile?.skills || []).map(s => s.toLowerCase().trim());
    const jobRequirements = (singleJob?.requirements || []);

    const matchedRequirements = jobRequirements.filter(req => 
        candidateSkills.some(cs => cs.includes(req.toLowerCase().trim()) || req.toLowerCase().trim().includes(cs))
    );
    const missingRequirements = jobRequirements.filter(req => !matchedRequirements.includes(req));
    const matchPercentage = jobRequirements.length > 0 
        ? Math.round((matchedRequirements.length / jobRequirements.length) * 100) 
        : 100;

    const totalApplicationsCount = singleJob?.totalApplications ?? singleJob?.applications?.length ?? 0;
    const isClosed = singleJob?.status === "closed";

    if (!singleJob) {
        return (
            <div className="min-h-screen bg-slate-50/50">
                <Navbar />
                <div className="max-w-7xl mx-auto my-10 px-4">
                    <div className="flex items-center justify-center h-[50vh]">
                        <div className="text-center space-y-3">
                            <h2 className="text-xl font-bold text-slate-800">Job position not found</h2>
                            <p className="text-slate-500 text-sm">The job may have expired or is unavailable.</p>
                            <Button onClick={() => navigate('/jobs')} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs cursor-pointer">
                                Back to All Jobs
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <Navbar />
            <div className="max-w-6xl mx-auto my-8 px-4">
                {/* Back & Share Button Bar */}
                <div className="flex items-center justify-between mb-6">
                    <Button 
                        onClick={() => navigate(-1)} 
                        variant="ghost" 
                        size="sm"
                        className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Openings
                    </Button>

                    <Button
                        onClick={shareJobHandler}
                        variant="outline"
                        size="sm"
                        className="border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-medium gap-1.5 cursor-pointer"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        Share Opportunity
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                    {/* Main Left Content */}
                    <div className="flex-1 space-y-6">
                        {/* Header Box */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            {singleJob?.company?.name}
                                        </span>
                                        {isClosed ? (
                                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                                Applications Paused
                                            </span>
                                        ) : (
                                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                Active Opening
                                            </span>
                                        )}
                                        <span className="text-xs font-medium text-slate-400">
                                            Posted {singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : "Recently"}
                                        </span>
                                    </div>
                                    <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                                        {singleJob?.title}
                                    </h1>
                                </div>
                            </div>

                            {/* Tags / Pills */}
                            <div className="flex items-center gap-2 mt-4 flex-wrap">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                    <Users className="w-3.5 h-3.5 mr-1.5" />
                                    {singleJob?.position} Openings
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                    <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                                    {singleJob?.jobType}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <DollarSign className="w-3.5 h-3.5 mr-1.5" />
                                    ₹{singleJob?.salary} LPA
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                    {singleJob?.location}
                                </span>
                            </div>

                            {/* Role Overview */}
                            <div className="border-t border-slate-100 pt-6 mt-6">
                                <h2 className="font-bold text-lg text-slate-900 mb-2.5">About the Role</h2>
                                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                    {singleJob?.description}
                                </p>
                            </div>

                            {/* Student Eligibility */}
                            {singleJob?.eligibility && (
                                <div className="border-t border-slate-100 pt-6 mt-6 bg-slate-50/60 -mx-6 -mb-6 p-6 rounded-b-2xl">
                                    <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm mb-1.5">
                                        <GraduationCap className="w-4 h-4" />
                                        <h3>Student Eligibility Criteria</h3>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {singleJob.eligibility}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Skill Compatibility Indicator (Candidate Value Feature) */}
                        {user && user.role === "student" && jobRequirements.length > 0 && (
                            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-indigo-100/80 shadow-xs bg-gradient-to-br from-indigo-50/30 via-white to-white">
                                <div className="flex items-center justify-between gap-4 mb-3">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-indigo-600" />
                                        <h2 className="font-bold text-base text-slate-900">Your Skill Compatibility</h2>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                        matchPercentage >= 70 
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : matchPercentage >= 40 
                                                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                                : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {matchPercentage}% Match
                                    </span>
                                </div>

                                <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            matchPercentage >= 70 
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                                                : matchPercentage >= 40 
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                                                    : 'bg-indigo-500'
                                        }`}
                                        style={{ width: `${Math.max(matchPercentage, 5)}%` }}
                                    />
                                </div>

                                <div className="space-y-2 text-xs">
                                    {matchedRequirements.length > 0 && (
                                        <div className="flex items-start gap-2">
                                            <span className="font-semibold text-emerald-700 shrink-0 mt-0.5">Matched:</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {matchedRequirements.map((m, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded-md font-medium">
                                                        <Check className="w-3 h-3 text-emerald-600" /> {m}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {missingRequirements.length > 0 && (
                                        <div className="flex items-start gap-2">
                                            <span className="font-semibold text-slate-500 shrink-0 mt-0.5">Missing:</span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {missingRequirements.map((m, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Key Responsibilities */}
                        {singleJob?.responsibilities && singleJob.responsibilities.length > 0 && (
                            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs">
                                <h2 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                    What You'll Do
                                </h2>
                                <ul className="space-y-2.5">
                                    {singleJob.responsibilities.map((resp, index) => (
                                        <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                                            <span>{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Requirements & Skills */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs">
                            <h2 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-indigo-600" />
                                Required Skills & Qualifications
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {singleJob?.requirements?.map((skill, index) => (
                                    <Badge 
                                        key={index} 
                                        className="bg-indigo-50 text-indigo-700 border border-indigo-100/80 px-3 py-1 text-xs font-medium rounded-full"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Perks & Benefits */}
                        {singleJob?.perks && singleJob.perks.length > 0 && (
                            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs">
                                <h2 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-indigo-600" />
                                    Perks & Learning Benefits
                                </h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {singleJob.perks.map((perk, index) => (
                                        <li key={index} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700 font-medium">
                                            <span className="text-emerald-600 font-bold">✓</span>
                                            <span>{perk}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar - Actions & Company */}
                    <div className="w-full lg:w-80 space-y-5 lg:sticky lg:top-24">
                        {/* Application Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                            <div>
                                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Compensation</p>
                                <p className="text-2xl font-bold text-slate-900 mt-0.5">₹{singleJob?.salary} LPA</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Annual CTC or Monthly Internship Equivalent</p>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <Button
                                    onClick={isApplied || isClosed ? null : applyJobHandler}
                                    disabled={isApplied || isClosed}
                                    className={`w-full font-semibold py-2.5 rounded-xl text-sm shadow-xs transition-all cursor-pointer ${
                                        isClosed
                                            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                                            : isApplied
                                                ? "bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed"
                                                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                                    }`}
                                >
                                    {isClosed ? "Applications Closed" : isApplied ? "✓ Already Applied" : "Apply Now"}
                                </Button>

                                <Button
                                    onClick={saveJobHandler}
                                    variant="outline"
                                    className={`w-full flex items-center justify-center gap-2 text-xs font-medium rounded-xl border-slate-200 cursor-pointer ${
                                        isSaved 
                                            ? "text-indigo-600 bg-indigo-50 border-indigo-200" 
                                            : "text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {isSaved ? (
                                        <>
                                            <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                                            Saved to Bookmarks
                                        </>
                                    ) : (
                                        <>
                                            <Bookmark className="w-4 h-4" />
                                            Save For Later
                                        </>
                                    )}
                                </Button>
                            </div>
                            
                            {isApplied && (
                                <p className="text-[11px] text-emerald-700 text-center font-medium bg-emerald-50 py-1.5 rounded-lg border border-emerald-100">
                                    Application active • Status: Under Review
                                </p>
                            )}
                        </div>

                        {/* Company Card */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                                About {singleJob?.company?.name}
                            </h3>
                            <div className="space-y-3 text-xs">
                                <div>
                                    <p className="text-slate-400 font-medium">Headquarters</p>
                                    <p className="text-slate-800 font-medium mt-0.5">{singleJob?.company?.location || "India"}</p>
                                </div>
                                {singleJob?.company?.description && (
                                    <div>
                                        <p className="text-slate-400 font-medium">Overview</p>
                                        <p className="text-slate-600 mt-0.5 leading-relaxed">{singleJob.company.description}</p>
                                    </div>
                                )}
                                {singleJob?.company?.website && (
                                    <div className="pt-1">
                                        <a 
                                            href={singleJob.company.website.startsWith("http") ? singleJob.company.website : `https://${singleJob.company.website}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                                        >
                                            Visit Website <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Key Dates / Summary */}
                        <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Experience:</span>
                                <span className="font-semibold text-slate-800">{singleJob?.experience === 0 ? "Fresher / 0 Years" : `${singleJob?.experience} Years`}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Applications:</span>
                                <span className="font-semibold text-slate-800">{totalApplicationsCount} {totalApplicationsCount === 1 ? "candidate" : "candidates"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Employment:</span>
                                <span className="font-semibold text-slate-800">{singleJob?.jobType}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDescription;
