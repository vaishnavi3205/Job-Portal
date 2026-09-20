import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { 
    Contact, 
    Mail, 
    Pen, 
    GraduationCap, 
    MapPin, 
    Globe, 
    FileText, 
    Download, 
    Eye,
    CheckCircle2, 
    Bookmark, 
    Briefcase,
    Sparkles,
    Maximize2
} from 'lucide-react';
import ResumeViewerModal from './ResumeViewerModal';
import ImageViewerModal from './ImageViewerModal';

const GithubIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
);

const LinkedinIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
);
import { Badge } from './ui/badge';
import AppliedJobTable from './AppliedJobTable';
import SavedJobTable from './SavedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import axios from 'axios';
import { setUser } from '@/redux/authSlice';
import { resolveFileUrl, USER_API_END_POINT } from '@/utils/constants';

const Profile = () => {
    useGetAllJobs();
    useGetAppliedJobs();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [resumeViewerOpen, setResumeViewerOpen] = useState(false);
    const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const queryTab = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(queryTab === "saved" || queryTab === "academics" ? queryTab : "applied");

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);

    useEffect(() => {
        if (queryTab === "saved" || queryTab === "applied" || queryTab === "academics") {
            setActiveTab(queryTab);
        } else if (!queryTab) {
            setActiveTab("applied");
        }
    }, [queryTab]);

    // Fetch fresh profile from database to ensure real local URLs are active
    useEffect(() => {
        const fetchLatestProfile = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true });
                if (res.data.success && res.data.user) {
                    dispatch(setUser(res.data.user));
                }
            } catch (err) {
                // Session maintained via state
            }
        };
        fetchLatestProfile();
    }, [dispatch]);

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setSearchParams({ tab: tabName });
    };
    const { user } = useSelector(store => store.auth);
    const { allAppliedJobs, savedJobs } = useSelector(store => store.job);

    const profile = user?.profile || {};
    const skills = profile?.skills || [];
    const appliedCount = allAppliedJobs?.length || 0;
    const savedCount = savedJobs?.length || 0;

    // Calculate profile strength
    const calculateStrength = () => {
        let score = 20; // baseline
        if (user?.fullname) score += 10;
        if (user?.email) score += 10;
        if (user?.phoneNumber) score += 10;
        if (profile?.college) score += 15;
        if (profile?.skills?.length > 0) score += 15;
        if (profile?.resume) score += 10;
        if (profile?.github || profile?.linkedin) score += 10;
        return Math.min(score, 100);
    };

    const strength = calculateStrength();

    return (
        <div className="min-h-screen bg-slate-50/60 pb-16">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 mt-8 space-y-6">
                {/* Profile Header Card */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                    {/* Top Decorative Gradient Banner */}
                    <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 relative">
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-indigo-950 backdrop-blur-md shadow-xs">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                Student / Candidate
                            </span>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 -mt-12">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                            <div className="flex items-end gap-4">
                                <div 
                                    onClick={() => setPhotoViewerOpen(true)}
                                    className="relative group cursor-pointer shrink-0"
                                    title="Click to view full profile picture"
                                >
                                    <Avatar className="h-24 w-24 rounded-2xl ring-4 ring-white group-hover:ring-indigo-300 shadow-md bg-white transition-all overflow-hidden">
                                        <AvatarImage 
                                            src={profile?.profilePhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80"} 
                                            alt={user?.fullname || "Student"} 
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </Avatar>
                                    <div className="absolute inset-0 bg-indigo-950/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[1px] text-white">
                                        <Maximize2 className="w-5 h-5 drop-shadow-md" />
                                        <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">View</span>
                                    </div>
                                </div>
                                <div className="mb-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="font-bold text-2xl text-slate-900 tracking-tight">
                                            {user?.fullname || "Student Name"}
                                        </h1>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            ● Open to Work
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                                        {profile?.headline || (profile?.degree ? `${profile.degree} Student` : "Aspiring Software Engineer")}
                                    </p>
                                </div>
                            </div>

                            <Button 
                                onClick={() => setOpen(true)} 
                                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs rounded-xl text-xs font-semibold px-4 py-2 flex items-center gap-2"
                            >
                                <Pen className="h-3.5 w-3.5 text-slate-500" />
                                Edit Profile
                            </Button>
                        </div>

                        {/* Bio / Summary */}
                        <p className="text-xs sm:text-sm text-slate-600 mt-5 leading-relaxed max-w-3xl">
                            {profile?.bio || "Passionate student looking for exciting internship and entry-level career opportunities."}
                        </p>

                        {/* Profile Strength Bar */}
                        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center justify-between text-xs font-semibold pr-4">
                                    <span className="text-slate-700 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                                        Profile Strength
                                    </span>
                                    <span className="text-indigo-600 font-bold">{strength}% Complete</span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${strength}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-500 sm:text-right shrink-0">
                                {strength >= 90 ? "Your profile is interview-ready!" : "Add resume and education to increase recruiter visibility"}
                            </p>
                        </div>

                        {/* Academic & Contact Meta Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs text-slate-600">
                            {/* Academic info */}
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 font-medium text-slate-700">
                                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                                    <span>{profile?.college || "College not added"}</span>
                                </div>
                                <p className="text-slate-500 pl-6">
                                    {profile?.degree || "Degree"} {profile?.graduationYear ? `(Batch of ${profile.graduationYear})` : ""}
                                </p>
                                {profile?.cgpa && (
                                    <p className="text-slate-500 pl-6 font-medium text-emerald-700">
                                        CGPA: {profile.cgpa}
                                    </p>
                                )}
                            </div>

                            {/* Contact info */}
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{user?.email || "Not specified"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Contact className="w-4 h-4 text-slate-400" />
                                    <span>{user?.phoneNumber || "Not specified"}</span>
                                </div>
                                {profile?.location && (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                            </div>

                            {/* Social / Portfolio Links */}
                            <div className="space-y-2">
                                <p className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">Profiles & Links</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {profile?.github ? (
                                        <a 
                                            href={profile.github.startsWith("http") ? profile.github : `https://${profile.github}`}
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-xs font-medium"
                                        >
                                            <GithubIcon /> GitHub
                                        </a>
                                    ) : null}
                                    {profile?.linkedin ? (
                                        <a 
                                            href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`}
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-xs font-medium"
                                        >
                                            <LinkedinIcon /> LinkedIn
                                        </a>
                                    ) : null}
                                    {profile?.portfolio ? (
                                        <a 
                                            href={profile.portfolio.startsWith("http") ? profile.portfolio : `https://${profile.portfolio}`}
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors text-xs"
                                        >
                                            <Globe className="w-3.5 h-3.5" /> Portfolio
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Skills & Resume Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
                            {/* Skills */}
                            <div>
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                                    Key Skills ({skills.length})
                                </h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.length ? (
                                        skills.map((skill, index) => (
                                            <Badge 
                                                key={index} 
                                                className="bg-indigo-50/80 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 font-medium px-2.5 py-0.5 rounded-full text-xs transition-colors"
                                            >
                                                {skill}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400">No skills added yet. Click edit profile to add your tech stack.</span>
                                    )}
                                </div>
                            </div>

                            {/* Resume Hub */}
                            <div>
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
                                    Active Resume
                                </h2>
                                {profile?.resume ? (
                                    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                                        <div className="flex items-center gap-2.5 overflow-hidden">
                                            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 shrink-0">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-xs font-semibold text-slate-800 truncate">
                                                    {profile?.resumeOriginalName || "Student_Resume.pdf"}
                                                </p>
                                                <p className="text-[10px] text-slate-400">
                                                    PDF Document • Updated {profile?.resumeUploadDate || "Recently"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button 
                                                type="button"
                                                onClick={() => setResumeViewerOpen(true)}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-indigo-200/80 shadow-2xs h-8"
                                            >
                                                <Eye className="w-3.5 h-3.5 text-indigo-600" /> View
                                            </Button>
                                            <a 
                                                href={resolveFileUrl(profile.resume)} 
                                                download={profile?.resumeOriginalName || "Resume.pdf"}
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                                                title="Download Resume"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-center">
                                        <p className="text-xs text-slate-400 mb-2">No resume uploaded yet</p>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={() => setOpen(true)}
                                            className="text-xs h-7 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                        >
                                            Upload Resume
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabbed Activity Dashboard */}
                <div id="profile-tabs" className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleTabChange("applied")}
                                className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 transition-all cursor-pointer ${
                                    activeTab === "applied"
                                        ? "text-indigo-600 border-indigo-600"
                                        : "text-slate-500 border-transparent hover:text-slate-800"
                                }`}
                            >
                                <Briefcase className="w-4 h-4" />
                                Applied Jobs
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    activeTab === "applied" ? "bg-indigo-50 text-indigo-700 font-bold" : "bg-slate-100 text-slate-600"
                                }`}>
                                    {appliedCount}
                                </span>
                            </button>

                            <button
                                onClick={() => handleTabChange("saved")}
                                className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 transition-all cursor-pointer ${
                                    activeTab === "saved"
                                        ? "text-indigo-600 border-indigo-600"
                                        : "text-slate-500 border-transparent hover:text-slate-800"
                                }`}
                            >
                                <Bookmark className="w-4 h-4" />
                                Saved Positions
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    activeTab === "saved" ? "bg-indigo-50 text-indigo-700 font-bold" : "bg-slate-100 text-slate-600"
                                }`}>
                                    {savedCount}
                                </span>
                            </button>

                            <button
                                onClick={() => handleTabChange("academics")}
                                className={`flex items-center gap-2 text-sm font-semibold pb-2 border-b-2 transition-all cursor-pointer ${
                                    activeTab === "academics"
                                        ? "text-indigo-600 border-indigo-600"
                                        : "text-slate-500 border-transparent hover:text-slate-800"
                                }`}
                            >
                                <GraduationCap className="w-4 h-4" />
                                Academics & Info
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === "applied" && (
                        <div className="animate-in fade-in-50 duration-200">
                            <AppliedJobTable />
                        </div>
                    )}

                    {activeTab === "saved" && (
                        <div className="animate-in fade-in-50 duration-200">
                            <SavedJobTable />
                        </div>
                    )}

                    {activeTab === "academics" && (
                        <div className="animate-in fade-in-50 duration-200 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                                    <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                                        <GraduationCap className="w-4 h-4" />
                                        <h3>Higher Education</h3>
                                    </div>
                                    <div className="space-y-1 text-xs text-slate-600">
                                        <p className="font-semibold text-slate-900 text-sm">{profile?.college || "College not set"}</p>
                                        <p>{profile?.degree || "Undergraduate Program"}</p>
                                        <p className="text-slate-500">Graduation: {profile?.graduationYear || "2025"}</p>
                                        <p className="text-emerald-700 font-semibold">Cumulative Score: {profile?.cgpa || "8.9 / 10"}</p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                                    <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                                        <Briefcase className="w-4 h-4" />
                                        <h3>Career Preferences</h3>
                                    </div>
                                    <div className="space-y-1.5 text-xs text-slate-600">
                                        <p><span className="font-medium text-slate-800">Preferred Roles:</span> Frontend Developer, Full Stack Engineer, React Developer</p>
                                        <p><span className="font-medium text-slate-800">Job Types:</span> Internship, Full Time</p>
                                        <p><span className="font-medium text-slate-800">Preferred Locations:</span> Bangalore, Delhi NCR, Pune, Remote</p>
                                        <p><span className="font-medium text-slate-800">Availability:</span> Immediate / 2025 Batch</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Update Profile Dialog */}
            <UpdateProfileDialog open={open} setOpen={setOpen} />

            {/* Resume Viewer Modal */}
            <ResumeViewerModal 
                open={resumeViewerOpen} 
                setOpen={setResumeViewerOpen} 
                resumeUrl={profile?.resume} 
                resumeTitle={profile?.resumeOriginalName || "Student_Resume.pdf"} 
                candidateName={user?.fullname} 
                candidateProfile={profile}
            />

            {/* Profile Photo Viewer Modal */}
            <ImageViewerModal
                open={photoViewerOpen}
                setOpen={setPhotoViewerOpen}
                imageUrl={profile?.profilePhoto || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80"}
                title={`${user?.fullname || "Student"}'s Profile Picture`}
                subtitle="Full-resolution candidate photo"
            />
        </div>
    );
};

export default Profile;
