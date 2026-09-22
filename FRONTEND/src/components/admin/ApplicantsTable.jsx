import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    XCircle, 
    Check, 
    Download, 
    GraduationCap, 
    Eye, 
    Mail, 
    Phone, 
    Sparkles, 
    ChevronDown, 
    FileText, 
    Search, 
    Building2, 
    Calendar, 
    Award,
    Loader2
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateApplicationStatus } from '@/redux/jobSlice';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { APPLICATION_API_END_POINT, resolveFileUrl } from '@/utils/constants';
import ResumeViewerModal from '../ResumeViewerModal';

// Helper to safely parse requirements list
const parseSkillsList = (input) => {
    if (!input) return [];
    if (Array.isArray(input)) {
        return input.flatMap(item => typeof item === 'string' ? item.split(/[,/]+/).map(s => s.trim()) : []).filter(Boolean);
    }
    if (typeof input === 'string') {
        return input.split(/[,/]+/).map(s => s.trim()).filter(Boolean);
    }
    return [];
};

// Compute skills match breakdown
const calculateSkillsMatch = (jobRequirements, applicantSkills) => {
    const jobReqs = parseSkillsList(jobRequirements);
    const candidateSkills = parseSkillsList(applicantSkills);

    if (jobReqs.length === 0) {
        return {
            percentage: candidateSkills.length > 0 ? 100 : 0,
            hasJobReqs: false,
            matched: [],
            missing: [],
            allSkills: candidateSkills
        };
    }

    const candSkillsLower = candidateSkills.map(s => s.toLowerCase());
    const matched = [];
    const missing = [];

    jobReqs.forEach(req => {
        const reqLower = req.toLowerCase();
        const found = candSkillsLower.some(cand => cand === reqLower || cand.includes(reqLower) || reqLower.includes(cand));
        if (found) {
            matched.push(req);
        } else {
            missing.push(req);
        }
    });

    const percentage = Math.round((matched.length / jobReqs.length) * 100);

    return {
        percentage,
        hasJobReqs: true,
        matched,
        missing,
        allSkills: candidateSkills
    };
};

const ApplicantsTable = ({ jobId, applications = [], jobRequirements = [], onStatusChange }) => {
    const dispatch = useDispatch();
    const [appList, setAppList] = useState(applications);
    const [selectedResume, setSelectedResume] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [openDropdownId, setOpenDropdownId] = useState(null);

    // Keep appList in sync with incoming props
    useEffect(() => {
        setAppList(applications);
    }, [applications]);

    const statusHandler = async (status, applicationId, applicantName) => {
        const normalized = status.toLowerCase();
        setUpdatingId(applicationId);

        // Optimistically update local state immediately
        setAppList(prev => prev.map(app => {
            if (app._id === applicationId) {
                return { ...app, status: normalized };
            }
            return app;
        }));

        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { 
                status: normalized 
            }, {
                withCredentials: true
            });

            if (res.data.success) {
                // Update global Redux store for real-time synchronization
                dispatch(updateApplicationStatus({
                    applicationId,
                    jobId,
                    status: normalized
                }));

                if (onStatusChange) {
                    onStatusChange(applicationId, normalized);
                }

                const statusLabel = 
                    normalized === "accepted" || normalized === "shortlisted" ? "Selected / Accepted" :
                    normalized === "rejected" ? "Rejected" : "Pending / Under Review";

                toast.success(`Application for ${applicantName || 'Candidate'} set to "${statusLabel}"!`);
            }
        } catch (error) {
            console.error("Status update error:", error);
            // Revert state if error occurred
            setAppList(applications);
            toast.error(error.response?.data?.message || "Failed to update application status");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableCaption className="text-xs text-slate-400 pb-3">
                        Authority review table: Evaluate student candidates, verify skills match, review resumes, and decide acceptance
                    </TableCaption>
                    <TableHeader className="bg-slate-50/80">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-slate-700 text-xs min-w-[220px]">Candidate Details</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-xs min-w-[200px]">Academic Background</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-xs min-w-[240px]">Skills Match Breakdown</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-xs min-w-[130px]">Resume</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700 text-xs min-w-[180px]">Status / Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(!appList || appList.length === 0) ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-14 text-slate-500">
                                    <div className="max-w-sm mx-auto space-y-2">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm">No applicants match this criteria</p>
                                        <p className="text-xs text-slate-400">
                                            When students apply to this position, their complete profiles, academic records, and resumes will appear here for decision-making.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            appList.map((item) => {
                                const applicant = item?.applicant;
                                const profile = applicant?.profile || {};
                                const currentStatus = item?.status || "pending";
                                const isUpdating = updatingId === item._id;

                                // Skills match breakdown
                                const skillMatch = calculateSkillsMatch(jobRequirements, profile?.skills);

                                return (
                                    <TableRow key={item._id} className="hover:bg-slate-50/70 transition-colors">
                                        {/* 1. Candidate Full Name, Email, Phone, Profile Photo */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
                                                    <AvatarImage 
                                                        src={profile?.profilePhoto} 
                                                        alt={applicant?.fullname || "Student"} 
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl">
                                                        {applicant?.fullname ? applicant.fullname.slice(0, 2).toUpperCase() : "ST"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-slate-900 text-sm leading-snug">
                                                        {applicant?.fullname || "Student Applicant"}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                                        <a href={`mailto:${applicant?.email}`} className="hover:text-indigo-600 truncate max-w-[160px]">
                                                            {applicant?.email || "No email"}
                                                        </a>
                                                    </div>
                                                    {applicant?.phoneNumber && (
                                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                                            <span>{applicant.phoneNumber}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* 2. Academic Background (Degree, College, Graduation year, CGPA) */}
                                        <TableCell className="text-xs">
                                            <div className="space-y-1">
                                                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                                                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                                    <span className="truncate max-w-[180px]" title={profile?.college || "University Student"}>
                                                        {profile?.college || "College / University"}
                                                    </span>
                                                </p>
                                                <p className="text-slate-600">
                                                    {profile?.degree || "Undergraduate Degree"}
                                                </p>
                                                <div className="flex items-center gap-2 pt-0.5">
                                                    {profile?.graduationYear && (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                                            <Calendar className="w-3 h-3 text-slate-400" />
                                                            Batch {profile.graduationYear}
                                                        </span>
                                                    )}
                                                    {profile?.cgpa && (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                                            <Award className="w-3 h-3 text-emerald-600" />
                                                            CGPA: {profile.cgpa}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* 3. Skills Match Breakdown */}
                                        <TableCell>
                                            <div className="space-y-2 max-w-[260px]">
                                                {/* Match Score Indicator */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                                                        skillMatch.percentage >= 70 
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : skillMatch.percentage >= 40
                                                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}>
                                                        <Sparkles className="w-3 h-3" />
                                                        {skillMatch.percentage}% Match
                                                    </span>
                                                    {skillMatch.hasJobReqs && (
                                                        <span className="text-[10px] text-slate-400 font-medium">
                                                            {skillMatch.matched.length} of {skillMatch.matched.length + skillMatch.missing.length} requirements
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Matched & Missing Skills Pills */}
                                                <div className="flex flex-wrap gap-1">
                                                    {skillMatch.matched.slice(0, 3).map((skill, idx) => (
                                                        <span 
                                                            key={`matched-${idx}`}
                                                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            title={`Matched required skill: ${skill}`}
                                                        >
                                                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {skillMatch.missing.slice(0, 2).map((skill, idx) => (
                                                        <span 
                                                            key={`missing-${idx}`}
                                                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200 line-through opacity-75"
                                                            title={`Missing requirement: ${skill}`}
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {(skillMatch.matched.length + skillMatch.missing.length) > 5 && (
                                                        <span className="text-[10px] text-slate-400 font-medium self-center">
                                                            +{(skillMatch.matched.length + skillMatch.missing.length) - 5} more
                                                        </span>
                                                    )}
                                                    {!skillMatch.hasJobReqs && skillMatch.allSkills.slice(0, 3).map((skill, idx) => (
                                                        <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0 rounded">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* 4. Resume Viewer (Inline Preview + Direct Download) */}
                                        <TableCell className="text-xs">
                                            {profile?.resume ? (
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <Button 
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedResume({
                                                            url: profile.resume,
                                                            title: profile.resumeOriginalName || `${applicant?.fullname || "Candidate"}_Resume.pdf`,
                                                            name: applicant?.fullname,
                                                            profile: profile
                                                        })}
                                                        className="h-7 text-xs font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 border-indigo-200/80 gap-1.5 px-2.5 rounded-lg cursor-pointer transition-colors"
                                                        title="Preview resume PDF inline or view Summary CV"
                                                    >
                                                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                                        <span>Preview PDF</span>
                                                    </Button>

                                                    <a 
                                                        href={resolveFileUrl(profile.resume)}
                                                        download={profile.resumeOriginalName || `${applicant?.fullname || "Candidate"}_Resume.pdf`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 hover:underline px-1 py-0.5 transition-colors"
                                                        title="Download resume PDF directly"
                                                    >
                                                        <Download className="w-3 h-3 text-slate-400" />
                                                        <span>Download</span>
                                                    </a>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">No resume attached</span>
                                            )}
                                        </TableCell>

                                        {/* Status / Action Dropdown (Select, Pending, Reject) */}
                                        <TableCell className="text-right">
                                            <div className="inline-flex justify-end">
                                                <Popover 
                                                    open={openDropdownId === item._id} 
                                                    onOpenChange={(isOpen) => setOpenDropdownId(isOpen ? item._id : null)}
                                                >
                                                    <PopoverTrigger asChild>
                                                        <button
                                                            type="button"
                                                            disabled={isUpdating}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                                                                (currentStatus === "accepted" || currentStatus === "shortlisted")
                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                                                                    : currentStatus === "rejected"
                                                                    ? "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
                                                                    : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                                                            }`}
                                                            title="Click to change status: Select, Pending, or Reject"
                                                        >
                                                            {isUpdating ? (
                                                                <>
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                                                                    <span className="text-slate-500 font-medium">Updating...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {(currentStatus === "accepted" || currentStatus === "shortlisted") && (
                                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                                    )}
                                                                    {currentStatus === "pending" && (
                                                                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                                    )}
                                                                    {currentStatus === "rejected" && (
                                                                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                                                    )}
                                                                    <span>
                                                                        {(currentStatus === "accepted" || currentStatus === "shortlisted")
                                                                            ? "Selected"
                                                                            : currentStatus === "rejected"
                                                                            ? "Rejected"
                                                                            : "Pending"}
                                                                    </span>
                                                                    <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
                                                                </>
                                                            )}
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-56 p-1.5 rounded-xl shadow-xl border border-slate-200 bg-white z-50" align="end">
                                                        <p className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1 tracking-wider">
                                                            Set Status / Action
                                                        </p>
                                                        
                                                        {/* 1. Select / Accept */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setOpenDropdownId(null);
                                                                statusHandler("accepted", item._id, applicant?.fullname);
                                                            }}
                                                            className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors font-semibold cursor-pointer text-left ${
                                                                (currentStatus === "accepted" || currentStatus === "shortlisted")
                                                                    ? "bg-emerald-50 text-emerald-800"
                                                                    : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                                <div>
                                                                    <p className="leading-tight text-emerald-700 font-bold">Select</p>
                                                                    <p className="text-[10px] font-normal text-slate-400">Accept candidate</p>
                                                                </div>
                                                            </div>
                                                            {(currentStatus === "accepted" || currentStatus === "shortlisted") && (
                                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                            )}
                                                        </button>

                                                        {/* 2. Pending */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setOpenDropdownId(null);
                                                                statusHandler("pending", item._id, applicant?.fullname);
                                                            }}
                                                            className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors font-semibold cursor-pointer text-left mt-0.5 ${
                                                                currentStatus === "pending"
                                                                    ? "bg-amber-50 text-amber-800"
                                                                    : "text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                                                                <div>
                                                                    <p className="leading-tight text-amber-700 font-bold">Pending</p>
                                                                    <p className="text-[10px] font-normal text-slate-400">Keep under review</p>
                                                                </div>
                                                            </div>
                                                            {currentStatus === "pending" && (
                                                                <Check className="w-3.5 h-3.5 text-amber-600" />
                                                            )}
                                                        </button>

                                                        {/* 3. Reject */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setOpenDropdownId(null);
                                                                statusHandler("rejected", item._id, applicant?.fullname);
                                                            }}
                                                            className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors font-semibold cursor-pointer text-left mt-0.5 ${
                                                                currentStatus === "rejected"
                                                                    ? "bg-rose-50 text-rose-800"
                                                                    : "text-slate-700 hover:bg-rose-50 hover:text-rose-800"
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                                                <div>
                                                                    <p className="leading-tight text-rose-700 font-bold">Reject</p>
                                                                    <p className="text-[10px] font-normal text-slate-400">Decline application</p>
                                                                </div>
                                                            </div>
                                                            {currentStatus === "rejected" && (
                                                                <Check className="w-3.5 h-3.5 text-rose-600" />
                                                            )}
                                                        </button>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Resume Viewer Modal */}
            {selectedResume && (
                <ResumeViewerModal 
                    open={Boolean(selectedResume)} 
                    setOpen={(val) => !val && setSelectedResume(null)} 
                    resumeUrl={selectedResume.url} 
                    resumeTitle={selectedResume.title} 
                    candidateName={selectedResume.name}
                    candidateProfile={selectedResume.profile}
                />
            )}
        </div>
    );
};

export default ApplicantsTable;
