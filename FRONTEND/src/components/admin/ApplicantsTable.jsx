import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreHorizontal, CheckCircle2, Clock, AlertCircle, FileText, Download, GraduationCap, Eye } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateApplicationStatus } from '@/redux/jobSlice';
import { toast } from 'sonner';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { APPLICATION_API_END_POINT, resolveFileUrl } from '@/utils/constants';
import ResumeViewerModal from '../ResumeViewerModal';

const shortlistingStatus = ["Accepted", "Rejected", "Pending"];

const ApplicantsTable = ({ jobId, applications }) => {
    const dispatch = useDispatch();
    const [selectedResume, setSelectedResume] = useState(null);

    const statusHandler = async (status, applicationId, applicantName) => {
        const normalized = status.toLowerCase();
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status: normalized }, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(updateApplicationStatus({
                    applicationId,
                    jobId,
                    status: normalized
                }));
                toast.success(res.data.message || `Application for ${applicantName} marked as "${status}"!`);
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error(error.response?.data?.message || "Failed to update application status");
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
            case 'shortlisted':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Shortlisted
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Under Review
                    </span>
                );
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <Table>
                <TableCaption className="text-xs text-slate-400 pb-3">
                    Review and evaluate student candidates who applied to this position
                </TableCaption>
                <TableHeader className="bg-slate-50/80">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-700 text-xs">Candidate Details</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs">Academic Background</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs">Key Skills</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs">Resume</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs">Current Status</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700 text-xs">Decision</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(!applications || applications.length === 0) ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                                <p className="font-medium text-sm text-slate-700">No applicants yet</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    When students apply to this position, their profiles and resumes will appear here.
                                </p>
                            </TableCell>
                        </TableRow>
                    ) : (
                        applications.map((item) => {
                            const applicant = item?.applicant;
                            const profile = applicant?.profile || {};
                            const currentStatus = item?.status || "pending";

                            return (
                                <TableRow key={item._id} className="hover:bg-slate-50/60 transition-colors">
                                    {/* Candidate */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 rounded-xl">
                                                <AvatarImage 
                                                    src={profile?.profilePhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80"} 
                                                    alt={applicant?.fullname || "Student"} 
                                                    className="object-cover"
                                                />
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">
                                                    {applicant?.fullname || "Student Applicant"}
                                                </p>
                                                <p className="text-xs text-slate-500">{applicant?.email}</p>
                                                <p className="text-[11px] text-slate-400">{applicant?.phoneNumber}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Academic */}
                                    <TableCell className="text-xs text-slate-600">
                                        <p className="font-medium text-slate-800 flex items-center gap-1">
                                            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                                            {profile?.college || "University Student"}
                                        </p>
                                        <p className="text-slate-500">
                                            {profile?.degree || "Undergraduate"} {profile?.graduationYear ? `(${profile.graduationYear})` : ""}
                                        </p>
                                        {profile?.cgpa && (
                                            <p className="text-emerald-700 font-semibold mt-0.5">CGPA: {profile.cgpa}</p>
                                        )}
                                    </TableCell>

                                    {/* Skills */}
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {profile?.skills?.slice(0, 3).map((skill, index) => (
                                                <Badge key={index} className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-[10px] px-1.5 py-0.2 rounded-md font-medium">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {(profile?.skills?.length || 0) > 3 && (
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    +{(profile?.skills?.length || 0) - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>

                                     {/* Resume */}
                                     <TableCell className="text-xs">
                                         {profile?.resume ? (
                                             <button 
                                                 type="button"
                                                 onClick={() => setSelectedResume({
                                                     url: profile.resume,
                                                     title: profile.resumeOriginalName || `${applicant?.fullname || "Candidate"}_Resume.pdf`,
                                                     name: applicant?.fullname
                                                 })}
                                                 className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                             >
                                                 <Eye className="w-3.5 h-3.5" />
                                                 View Resume
                                             </button>
                                         ) : (
                                             <span className="text-slate-400 text-xs">No resume</span>
                                         )}
                                     </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        {getStatusBadge(currentStatus)}
                                    </TableCell>

                                    {/* Decision Popover */}
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-1.5 rounded-xl shadow-lg border border-slate-200" align="end">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Set Decision</p>
                                                <button
                                                    onClick={() => statusHandler("Accepted", item._id, applicant?.fullname)}
                                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors font-semibold cursor-pointer text-left"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                    Shortlist / Accept
                                                </button>
                                                <button
                                                    onClick={() => statusHandler("Rejected", item._id, applicant?.fullname)}
                                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-700 hover:bg-rose-50 rounded-lg transition-colors font-semibold cursor-pointer text-left"
                                                >
                                                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                                    Reject
                                                </button>
                                                <button
                                                    onClick={() => statusHandler("Pending", item._id, applicant?.fullname)}
                                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-amber-700 hover:bg-amber-50 rounded-lg transition-colors font-semibold cursor-pointer text-left"
                                                >
                                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                                    Under Review
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

            {selectedResume && (
                <ResumeViewerModal 
                    open={Boolean(selectedResume)} 
                    setOpen={(val) => !val && setSelectedResume(null)} 
                    resumeUrl={selectedResume.url} 
                    resumeTitle={selectedResume.title} 
                    candidateName={selectedResume.name} 
                />
            )}
        </div>
    );
};

export default ApplicantsTable;
