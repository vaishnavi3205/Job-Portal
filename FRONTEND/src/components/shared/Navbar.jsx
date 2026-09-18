import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
    Maximize2
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

    const isRecruiter = user?.role === "recruiter";

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
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                {/* Logo & Edition Tag */}
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-900">
                        Job<span className="text-indigo-600">Portal</span>
                    </Link>
                    {isRecruiter ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                            <ShieldCheck className="w-3 h-3 text-violet-600" />
                            Recruiter Admin
                        </span>
                    ) : (
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
                                <li>
                                    <Link 
                                        to="/browse" 
                                        className={`transition-colors ${location.pathname === "/browse" ? "text-indigo-600 font-semibold" : "hover:text-indigo-600"}`}
                                    >
                                        Browse
                                    </Link>
                                </li>
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
                            </>
                        )}
                    </ul>



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
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                            <PopoverTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/30 transition-all">
                                    <Avatar className="h-9 w-9 ring-2 ring-indigo-500/20">
                                        <AvatarImage src={userAvatar} alt="user" className="object-cover" />
                                    </Avatar>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-72 p-4 rounded-2xl shadow-xl border border-slate-200" align="end">
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
                                        className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold p-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-3.5 h-3.5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
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
        </div>
    );
};

export default Navbar;