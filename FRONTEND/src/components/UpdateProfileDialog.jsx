import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, GraduationCap, LinkIcon, FileText, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constants';

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("basic");

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        bio: "",
        skills: "",
        college: "",
        degree: "",
        graduationYear: "",
        cgpa: "",
        github: "",
        linkedin: "",
        portfolio: "",
        resumeOriginalName: "",
        resume: "",
        file: null
    });

    useEffect(() => {
        if (open && user) {
            setInput({
                fullname: user?.fullname || "",
                email: user?.email || "",
                phoneNumber: user?.phoneNumber || "",
                bio: user?.profile?.bio || "",
                skills: Array.isArray(user?.profile?.skills) 
                    ? user.profile.skills.join(", ") 
                    : user?.profile?.skills || "",
                college: user?.profile?.college || "",
                degree: user?.profile?.degree || "",
                graduationYear: user?.profile?.graduationYear || "",
                cgpa: user?.profile?.cgpa || "",
                github: user?.profile?.github || "",
                linkedin: user?.profile?.linkedin || "",
                portfolio: user?.profile?.portfolio || "",
                resumeOriginalName: user?.profile?.resumeOriginalName || "",
                resume: user?.profile?.resume || "",
                file: null
            });
        }
    }, [open, user]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ 
                ...input, 
                file,
                resumeOriginalName: file.name,
                resume: URL.createObjectURL(file)
            });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        // 1. Mandatory Academic Details Validation
        if (!input.college || !input.college.trim()) {
            toast.error("College / University is mandatory. Please fill in your academics.");
            setActiveTab("academic");
            return;
        }
        if (!input.degree || !input.degree.trim()) {
            toast.error("Degree & Branch is mandatory. Please fill in your academics.");
            setActiveTab("academic");
            return;
        }
        if (!input.graduationYear || !input.graduationYear.toString().trim()) {
            toast.error("Graduation Year is mandatory. Please fill in your academics.");
            setActiveTab("academic");
            return;
        }
        if (!input.cgpa || !input.cgpa.toString().trim()) {
            toast.error("CGPA / Percentage is mandatory. Please fill in your academics.");
            setActiveTab("academic");
            return;
        }
        if (!input.skills || !input.skills.trim()) {
            toast.error("Technical Skills are mandatory. Please fill in your skills.");
            setActiveTab("academic");
            return;
        }

        // 2. Mandatory Resume Document Validation
        const hasResume = input.file || input.resume || input.resumeOriginalName;
        if (!hasResume) {
            toast.error("Resume document (PDF) is mandatory. Please upload your resume.");
            setActiveTab("links");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        formData.append("college", input.college);
        formData.append("degree", input.degree);
        formData.append("graduationYear", input.graduationYear);
        formData.append("cgpa", input.cgpa);
        formData.append("github", input.github);
        formData.append("linkedin", input.linkedin);
        formData.append("portfolio", input.portfolio);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message || "Profile updated successfully!");
                setOpen(false);
                return;
            }
        } catch (error) {
            console.error("Profile update error:", error);
            const errMsg = error.response?.data?.message || "Failed to update profile";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto p-6 my-auto" onInteractOutside={() => setOpen(false)}>
                <DialogHeader className="pb-2 border-b border-slate-100">
                    <DialogTitle className="text-xl font-bold text-slate-900">Edit Student Profile</DialogTitle>
                    <p className="text-xs text-slate-500">Update your academic credentials, skills, and resume</p>
                </DialogHeader>

                {/* Section Toggle Tabs */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl my-2 text-xs font-medium">
                    <button
                        type="button"
                        onClick={() => setActiveTab("basic")}
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === "basic" ? "bg-white text-indigo-600 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"}`}
                    >
                        <User className="w-3.5 h-3.5" /> Basic Info
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("academic")}
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === "academic" ? "bg-white text-indigo-600 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"}`}
                    >
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Academics & Skills</span>
                        <span className="text-[11px] font-bold text-rose-500">*</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("links")}
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === "links" ? "bg-white text-indigo-600 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"}`}
                    >
                        <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Links & Resume</span>
                        <span className="text-[11px] font-bold text-rose-500">*</span>
                    </button>
                </div>

                <form onSubmit={submitHandler} className="space-y-4 pt-1">
                    {/* Basic Info Tab */}
                    {activeTab === "basic" && (
                        <div className="space-y-3 animate-in fade-in-50 duration-200">
                            <div>
                                <Label htmlFor="fullname" className="text-xs font-semibold text-slate-700">Full Name</Label>
                                <Input 
                                    id="fullname" 
                                    name="fullname" 
                                    type="text" 
                                    value={input.fullname} 
                                    onChange={changeEventHandler} 
                                    className="mt-1 h-9 text-xs bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white" 
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Address</Label>
                                    <Input 
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        value={input.email} 
                                        onChange={changeEventHandler} 
                                        className="mt-1 h-9 text-xs bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white" 
                                        placeholder="email@college.edu"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phoneNumber" className="text-xs font-semibold text-slate-700">Phone Number</Label>
                                    <Input 
                                        id="phoneNumber" 
                                        name="phoneNumber" 
                                        type="text" 
                                        value={input.phoneNumber} 
                                        onChange={changeEventHandler} 
                                        className="mt-1 h-9 text-xs bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white" 
                                        placeholder="+91 9876543210"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="bio" className="text-xs font-semibold text-slate-700">Student Bio / Objective</Label>
                                <textarea 
                                    id="bio" 
                                    name="bio" 
                                    rows="3" 
                                    value={input.bio} 
                                    onChange={changeEventHandler} 
                                    className="w-full mt-1 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500/30 text-slate-800" 
                                    placeholder="Brief summary of your academic background, interests, and what kind of roles you are seeking..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Academic & Skills Tab - MANDATORY */}
                    {activeTab === "academic" && (
                        <div className="space-y-3 animate-in fade-in-50 duration-200">
                            <div className="p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-800 font-medium flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>All academic details are required for verified student placement applications.</span>
                            </div>

                            <div>
                                <Label htmlFor="college" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                    College / University <span className="text-rose-500 font-bold">*</span>
                                    <span className="text-[10px] text-rose-500 font-normal">(Mandatory)</span>
                                </Label>
                                <Input 
                                    id="college" 
                                    name="college" 
                                    type="text" 
                                    required
                                    value={input.college} 
                                    onChange={changeEventHandler} 
                                    className="mt-1 h-9 text-xs bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white" 
                                    placeholder="e.g. Delhi Technological University (DTU)"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="degree" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                        Degree & Branch <span className="text-rose-500 font-bold">*</span>
                                        <span className="text-[10px] text-rose-500 font-normal">(Mandatory)</span>
                                    </Label>
                                    <Input 
                                        id="degree" 
                                        name="degree" 
                                        type="text" 
                                        required
                                        value={input.degree} 
                                        onChange={changeEventHandler} 
                                        className="mt-1 h-9 text-xs bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white" 
                                        placeholder="e.g. B.Tech Computer Science"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="graduationYear" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                        Graduation Year <span className="text-rose-500 font-bold">*</span>
                                        <span className="text-[10px] text-rose-500 font-normal">(Mandatory)</span>
                                    </Label>
                                    <Input 
                                        id="graduationYear" 
                                        name="graduationYear" 
                                        type="text" 
                                        required
                                        value={input.graduationYear} 
                                        onChange={changeEventHandler} 
                                        className="mt-1 h-9 text-xs bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white" 
                                        placeholder="e.g. 2025 or 2026"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="cgpa" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                    CGPA or Percentage <span className="text-rose-500 font-bold">*</span>
                                    <span className="text-[10px] text-rose-500 font-normal">(Mandatory)</span>
                                </Label>
                                <Input 
                                    id="cgpa" 
                                    name="cgpa" 
                                    type="text" 
                                    required
                                    value={input.cgpa} 
                                    onChange={changeEventHandler} 
                                    className="mt-1 h-9 text-xs bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white" 
                                    placeholder="e.g. 8.8 / 10 or 85%"
                                />
                            </div>

                            <div>
                                <Label htmlFor="skills" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                                    Technical Skills <span className="text-rose-500 font-bold">*</span>
                                    <span className="text-[10px] text-rose-500 font-normal">(Mandatory)</span>
                                </Label>
                                <Input 
                                    id="skills" 
                                    name="skills" 
                                    type="text" 
                                    required
                                    value={input.skills} 
                                    onChange={changeEventHandler} 
                                    className="mt-1 h-9 text-xs bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white" 
                                    placeholder="React, JavaScript, Node.js, Python, Tailwind CSS, SQL"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">Separate skills with commas (e.g. React.js, Python, Tailwind)</p>
                            </div>
                        </div>
                    )}

                    {/* Links & Resume Tab - RESUME MANDATORY */}
                    {activeTab === "links" && (
                        <div className="space-y-3 animate-in fade-in-50 duration-200">
                            <div>
                                <Label htmlFor="github" className="text-xs font-semibold text-slate-700">GitHub Profile URL</Label>
                                <Input 
                                    id="github" 
                                    name="github" 
                                    type="url" 
                                    value={input.github} 
                                    onChange={changeEventHandler} 
                                    className="mt-1 h-9 text-xs bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white" 
                                    placeholder="https://github.com/yourusername"
                                />
                            </div>
                            <div>
                                <Label htmlFor="linkedin" className="text-xs font-semibold text-slate-700">LinkedIn Profile URL</Label>
                                <Input 
                                    id="linkedin" 
                                    name="linkedin" 
                                    type="url" 
                                    value={input.linkedin} 
                                    onChange={changeEventHandler} 
                                    className="mt-1 h-9 text-xs bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white" 
                                    placeholder="https://linkedin.com/in/yourprofile"
                                />
                            </div>
                            <div>
                                <Label htmlFor="portfolio" className="text-xs font-semibold text-slate-700">Personal Portfolio / Website</Label>
                                <Input 
                                    id="portfolio" 
                                    name="portfolio" 
                                    type="url" 
                                    value={input.portfolio} 
                                    onChange={changeEventHandler} 
                                    className="mt-1 h-9 text-xs bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white" 
                                    placeholder="https://yourportfolio.dev"
                                />
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <Label htmlFor="file" className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
                                    Resume Document (PDF) <span className="text-rose-500 font-bold">*</span>
                                    <span className="text-[10px] text-rose-500 font-normal">(Mandatory)</span>
                                </Label>
                                <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/60">
                                    <Input 
                                        id="file" 
                                        name="file" 
                                        type="file" 
                                        accept="application/pdf" 
                                        onChange={fileChangeHandler} 
                                        className="text-xs bg-white border-slate-200 cursor-pointer"
                                    />
                                    {input.resumeOriginalName ? (
                                        <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1.5 font-medium">
                                            <FileText className="w-3.5 h-3.5" />
                                            Current uploaded resume: {input.resumeOriginalName}
                                        </p>
                                    ) : (
                                        <p className="text-[11px] text-rose-500 mt-1.5 font-medium">
                                            No resume uploaded yet. A PDF resume is required.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setOpen(false)}
                            className="text-xs text-slate-500 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-5 h-9 rounded-xl shadow-xs cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;