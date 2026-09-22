import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
    LogOut, 
    User2, 
    Bookmark, 
    Briefcase, 
    Sparkles, 
    GraduationCap, 
    Building2, 
    PlusCircle, 
    ShieldCheck,
    Maximize2,
    X,
    ExternalLink,
    Menu
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';
import { USER_API_END_POINT } from '@/utils/constants';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import ImageViewerModal from '../ImageViewerModal';

const Navbar = () => {
    useGetAppliedJobs();
    const { user } = useSelector(store => store.auth || {});
    const { allAppliedJobs, savedJobs, adminJobs } = useSelector(store => store.job || {});
    const { companies } = useSelector(store => store.company || {});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
    const [quickProfileOpen, setQuickProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setPopoverOpen(false);
            }
        };
        if (popoverOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popoverOpen]);

    const isRecruiter = Boolean(user && user.role === "recruiter");
    const isStudent = Boolean(user && user.role === "student");

    const isProfilePage = location.pathname === "/profile";
    const isProfileActive = isProfilePage && (!location.search || location.search === "");
    const isAppliedActive = isProfilePage && location.search.includes("tab=applied");
    const isSavedActive = isProfilePage && location.search.includes("tab=saved");

    const logoutHandler = async () => {
        try {
            await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
        } catch (error) {
            // Offline fallback
        }
        dispatch(setUser(null));
        navigate("/login");
        toast.success("Logged out successfully");
    };

    const userAvatar = user?.profile?.profilePhoto || 
        (isRecruiter 
            ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80" 
            : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80");

    const appliedCount = allAppliedJobs?.length || 0;
    const savedCount = savedJobs?.length || 0;
    const adminJobsCount = adminJobs?.length || 0;
    const companiesCount = companies?.length || 0;

    return (
        <div className="bg-white border-b border-slate-200/80 sticky top-0 z-[100] shadow-xs">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                {/* Logo & Edition Tag */}
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Job<span className="text-indigo-600">Portal</span>
                    </Link>
                    {isRecruiter && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                            <ShieldCheck className="w-3 h-3 text-violet-600" />
                            Recruiter Admin
                        </span>
                    )}
                    {isStudent && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            <GraduationCap className="w-3 h-3 text-indigo-600" />
                            Student Edition
                        </span>
                    )}
                </div>

                {/* Center / Right Navigation Links */}
                <div className="flex items-center gap-4 sm:gap-6">
                    <ul className="hidden md:flex font-medium items-center gap-6 text-sm text-slate-600">
                        <li>
                            <Link 
                                to="/" 
                                className={`transition-colors ${location.pathname === "/" ? "text-indigo-600 font-semibold" : "hover:text-indigo-600"}`}
                            >
                                Home
                            </Link>
                        </li>

                        {isRecruiter ? (
                            <>
                                <li>
                                    <Link 
                                        to="/admin/companies" 
                                        className={`transition-colors flex items-center gap-1.5 ${location.pathname.startsWith("/admin/companies") ? "text-indigo-600 font-semibold" : "hover:text-indigo-600"}`}
                                    >
                                        Companies
                                        <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                                            {companiesCount}
                                        </span>
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/admin/jobs" 
                                        className={`transition-colors flex items-center gap-1.5 ${location.pathname.startsWith("/admin/jobs") ? "text-indigo-600 font-semibold" : "hover:text-indigo-600"}`}
                                    >
                                        Posted Jobs
                                        <span className="bg-indigo-100 text-indigo-700 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                                            {adminJobsCount}
                                        </span>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link 
                                        to="/jobs" 
                                        className={`transition-colors ${location.pathname === "/jobs" ? "text-indigo-600 font-semibold" : "hover:text-indigo-600"}`}
                                    >
                                        Jobs & Internships
                                    </Link>
                                </li>
                                {isStudent && (
                                    <li>
                                        <Link 
                                            to="/profile" 
                                            className={`transition-colors flex items-center gap-1.5 ${location.pathname === "/profile" ? "text-indigo-600 font-semibold" : "hover:text-indigo-600"}`}
                                        >
                                            Student Dashboard
                                            {appliedCount > 0 && (
                                                <span className="bg-indigo-100 text-indigo-700 font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                                                    {appliedCount}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>



                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* User Profile Avatar Popover or Login */}
                    {!user ? (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs h-9">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs font-medium text-xs h-9">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setPopoverOpen(prev => !prev)}
                                className="flex items-center gap-2 cursor-pointer p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/30 transition-all focus:outline-none"
                            >
                                <Avatar className="h-9 w-9 ring-2 ring-indigo-500/20">
                                    <AvatarImage src={userAvatar} alt="user" className="object-cover" />
                                </Avatar>
                            </button>

                            {popoverOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 p-4 rounded-2xl shadow-2xl border border-slate-200 bg-white z-[9999] animate-in fade-in-0 zoom-in-95">
                                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                        <div 
                                            onClick={() => {
                                                setPopoverOpen(false);
                                                setPhotoViewerOpen(true);
                                            }}
                                            className="relative group cursor-pointer shrink-0"
                                            title="Click to view full photo"
                                        >
                                            <Avatar className="h-11 w-11 rounded-xl ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all overflow-hidden">
                                                <AvatarImage src={userAvatar} alt="user" className="object-cover" />
                                            </Avatar>
                                            <div className="absolute inset-0 bg-indigo-950/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Maximize2 className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="font-bold text-sm text-slate-900 truncate">{user?.fullname}</h4>
                                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                                                isRecruiter 
                                                    ? "bg-violet-100 text-violet-800" 
                                                    : "bg-indigo-100 text-indigo-800"
                                            }`}>
                                                {isRecruiter ? "Recruiter / Admin" : "Candidate / Student"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Open Centered Profile View Button */}
                                    <div className="py-2 border-b border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPopoverOpen(false);
                                                setQuickProfileOpen(true);
                                            }}
                                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors cursor-pointer"
                                        >
                                            <User2 className="w-3.5 h-3.5" />
                                            Open Profile in Center of Screen
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-1 my-3 text-xs text-slate-700">
                                        {isRecruiter ? (
                                            <>
                                                <Link 
                                                    to="/admin/jobs" 
                                                    onClick={() => setPopoverOpen(false)}
                                                    className="flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-medium"
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                                        Manage Job Postings
                                                    </span>
                                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                                        {adminJobsCount}
                                                    </span>
                                                </Link>

                                                <Link 
                                                    to="/admin/companies" 
                                                    onClick={() => setPopoverOpen(false)}
                                                    className="flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-medium"
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        <Building2 className="w-4 h-4 text-slate-400" />
                                                        Manage Companies
                                                    </span>
                                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                                        {companiesCount}
                                                    </span>
                                                </Link>

                                                <Link 
                                                    to="/admin/jobs/create" 
                                                    onClick={() => setPopoverOpen(false)}
                                                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-medium"
                                                >
                                                    <PlusCircle className="w-4 h-4 text-slate-400" />
                                                    Post New Opening
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link 
                                                    to="/profile" 
                                                    onClick={() => setPopoverOpen(false)}
                                                    className={`flex items-center gap-2.5 p-2 rounded-xl transition-colors font-medium ${
                                                        isProfileActive 
                                                            ? "bg-indigo-50/80 text-indigo-600 font-semibold" 
                                                            : "hover:bg-indigo-50 hover:text-indigo-600 text-slate-700"
                                                    }`}
                                                >
                                                    <User2 className={`w-4 h-4 ${isProfileActive ? "text-indigo-600" : "text-slate-400"}`} />
                                                    My Student Profile
                                                </Link>

                                                <Link 
                                                    to="/profile?tab=applied" 
                                                    onClick={() => setPopoverOpen(false)}
                                                    className={`flex items-center justify-between p-2 rounded-xl transition-colors font-medium ${
                                                        isAppliedActive 
                                                            ? "bg-indigo-50/80 text-indigo-600 font-semibold" 
                                                            : "hover:bg-indigo-50 hover:text-indigo-600 text-slate-700"
                                                    }`}
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        <Briefcase className={`w-4 h-4 ${isAppliedActive ? "text-indigo-600" : "text-slate-400"}`} />
                                                        Applied Jobs
                                                    </span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        isAppliedActive ? "bg-indigo-100/80 text-indigo-800" : "bg-slate-100 text-slate-600"
                                                    }`}>
                                                        {appliedCount}
                                                    </span>
                                                </Link>

                                                <Link 
                                                    to="/profile?tab=saved" 
                                                    onClick={() => setPopoverOpen(false)}
                                                    className={`flex items-center justify-between p-2 rounded-xl transition-colors font-medium ${
                                                        isSavedActive 
                                                            ? "bg-indigo-50/80 text-indigo-600 font-semibold" 
                                                            : "hover:bg-indigo-50 hover:text-indigo-600 text-slate-700"
                                                    }`}
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        <Bookmark className={`w-4 h-4 ${isSavedActive ? "text-indigo-600" : "text-slate-400"}`} />
                                                        Saved Positions
                                                    </span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        isSavedActive ? "bg-indigo-100/80 text-indigo-800" : "bg-slate-100 text-slate-600"
                                                    }`}>
                                                        {savedCount}
                                                    </span>
                                                </Link>
                                            </>
                                        )}
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                                        <button 
                                            onClick={logoutHandler}
                                            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Photo Viewer Modal */}
            <ImageViewerModal
                open={photoViewerOpen}
                setOpen={setPhotoViewerOpen}
                imageUrl={userAvatar}
                title={`${user?.fullname || "User"}'s Profile Photo`}
                subtitle="Full-resolution profile picture"
            />

            {/* Centered Quick Profile Modal Dialog */}
            {quickProfileOpen && (
                <div 
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-0"
                    onClick={() => setQuickProfileOpen(false)}
                >
                    <div 
                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 my-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Banner */}
                        <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 relative p-4 flex justify-between items-start">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/95 text-indigo-950 shadow-xs">
                                {isRecruiter ? <ShieldCheck className="w-3.5 h-3.5 text-violet-600" /> : <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />}
                                {isRecruiter ? "Recruiter Account" : "Student Profile Overview"}
                            </span>
                            <button 
                                onClick={() => setQuickProfileOpen(false)}
                                className="p-1.5 rounded-full bg-black/25 hover:bg-black/45 text-white transition-colors cursor-pointer"
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Card Content */}
                        <div className="p-6 pt-0 relative">
                            <div className="flex items-end justify-between -mt-12 mb-4">
                                <div 
                                    onClick={() => {
                                        setQuickProfileOpen(false);
                                        setPhotoViewerOpen(true);
                                    }}
                                    className="relative group cursor-pointer shrink-0"
                                    title="Click to view full photo"
                                >
                                    <Avatar className="h-20 w-20 rounded-2xl ring-4 ring-white shadow-md bg-white overflow-hidden">
                                        <AvatarImage src={userAvatar} alt="user" className="object-cover" />
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <Maximize2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <Link 
                                    to={isRecruiter ? "/admin/jobs" : "/profile"} 
                                    onClick={() => setQuickProfileOpen(false)}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
                                >
                                    {isRecruiter ? "Admin Dashboard" : "Full Profile Dashboard"} <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{user?.fullname || "User Name"}</h3>
                                <p className="text-xs text-slate-500 font-medium">
                                    {user?.email} {user?.phoneNumber ? `• ${user.phoneNumber}` : ""}
                                </p>
                                {user?.profile?.bio && (
                                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        {user.profile.bio}
                                    </p>
                                )}
                            </div>

                            {/* Academic details if candidate */}
                            {!isRecruiter && (
                                <div className="mt-4 p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100/70 space-y-2 text-xs">
                                    <div className="flex items-center justify-between text-slate-700">
                                        <span className="font-semibold flex items-center gap-1.5 text-indigo-900">
                                            <GraduationCap className="w-4 h-4 text-indigo-600" /> Education:
                                        </span>
                                        <span className="font-medium text-slate-900">
                                            {user?.profile?.degree ? `${user.profile.degree} - ${user.profile.college || "College"}` : "Details not added"}
                                        </span>
                                    </div>
                                    {(user?.profile?.graduationYear || user?.profile?.cgpa) && (
                                        <div className="flex items-center justify-between text-slate-600 text-[11px] pt-1.5 border-t border-indigo-100">
                                            <span>Graduation: {user?.profile?.graduationYear || "N/A"}</span>
                                            <span className="font-semibold text-indigo-700">CGPA: {user?.profile?.cgpa || "N/A"}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Skills */}
                            {user?.profile?.skills && (Array.isArray(user.profile.skills) ? user.profile.skills.length > 0 : Boolean(user.profile.skills)) && (
                                <div className="mt-4">
                                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                                        Skills & Expertise
                                    </span>
                                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                        {(Array.isArray(user.profile.skills) ? user.profile.skills : user.profile.skills.split(',')).map((sk, idx) => (
                                            <span key={idx} className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                                                {sk.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bottom Actions */}
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setQuickProfileOpen(false)}
                                    className="text-xs text-slate-600 border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
                                >
                                    Close
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Link 
                                        to={isRecruiter ? "/admin/jobs" : "/profile"} 
                                        onClick={() => setQuickProfileOpen(false)}
                                    >
                                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer">
                                            {isRecruiter ? "Manage Jobs" : "Open Full Profile"}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2">
                    <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block py-2 px-3 rounded-lg text-sm font-medium ${location.pathname === "/" ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                        Home
                    </Link>
                    {isRecruiter ? (
                        <>
                            <Link
                                to="/admin/companies"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium ${location.pathname.startsWith("/admin/companies") ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}
                            >
                                <span>Companies</span>
                                <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-full">{companiesCount}</span>
                            </Link>
                            <Link
                                to="/admin/jobs"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium ${location.pathname.startsWith("/admin/jobs") ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}
                            >
                                <span>Posted Jobs</span>
                                <span className="bg-indigo-100 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded-full">{adminJobsCount}</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/jobs"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block py-2 px-3 rounded-lg text-sm font-medium ${location.pathname === "/jobs" ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}
                            >
                                Jobs & Internships
                            </Link>
                            {isStudent && (
                                <Link
                                    to="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium ${location.pathname === "/profile" ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}
                                >
                                    <span>Student Dashboard</span>
                                    {appliedCount > 0 && (
                                        <span className="bg-indigo-100 text-indigo-700 font-bold text-[10px] px-2 py-0.5 rounded-full">{appliedCount}</span>
                                    )}
                                </Link>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;