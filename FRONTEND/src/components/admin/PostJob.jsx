import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constants';
import { toast } from 'sonner';
import { addJobByAdmin } from '@/redux/jobSlice';
import { ArrowLeft, Loader2, Briefcase, Sparkles, Building2 } from 'lucide-react';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';

const PostJob = () => {
    useGetAllCompanies();
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "Internship",
        experience: 0,
        position: 2,
        companyId: "",
        eligibility: "Open to 2025/2026 students (B.Tech / BCA / MCA / B.Sc CS) with strong fundamentals.",
        perks: "Certificate of completion, PPO potential, flexible hybrid schedule, mentorship."
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companies } = useSelector(store => store.company);
    const { user } = useSelector(store => store.auth);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (e) => {
        setInput({ ...input, companyId: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.title || !input.description || !input.requirements || !input.salary || !input.location || !input.companyId) {
            toast.error("Please fill in all mandatory fields and select a company");
            return;
        }

        const selectedCompany = companies.find(c => c._id === input.companyId);
        if (!selectedCompany) {
            toast.error("Please select a valid registered company");
            return;
        }

        setLoading(true);

        const requirementsArray = input.requirements
            .split(",")
            .map(r => r.trim())
            .filter(Boolean);

        const perksArray = input.perks
            .split(",")
            .map(p => p.trim())
            .filter(Boolean);

        try {
            const res = await axios.post(`${JOB_API_END_POINT}/post`, {
                title: input.title.trim(),
                description: input.description.trim(),
                requirements: requirementsArray,
                salary: Number(input.salary),
                location: input.location.trim(),
                jobType: input.jobType,
                experience: Number(input.experience) || 0,
                position: Number(input.position) || 1,
                companyId: input.companyId,
                eligibility: input.eligibility,
                perks: perksArray
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(addJobByAdmin(res.data.job));
                toast.success(res.data.message || "Job posted successfully!");
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error("Error posting job:", error);
            toast.error(error.response?.data?.message || "Failed to post job. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/60 pb-16">
            <Navbar />
            <div className="max-w-4xl mx-auto my-10 px-4">
                <Button 
                    onClick={() => navigate("/admin/jobs")} 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-1.5 text-xs text-slate-500 mb-6"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Jobs
                </Button>

                <form onSubmit={submitHandler} className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
                    <div className="pb-4 border-b border-slate-100">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
                            <Sparkles className="w-3.5 h-3.5" /> New Opening
                        </div>
                        <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight">Post a New Job Opportunity</h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Publish a full-time role or student internship vacancy. It will immediately appear on the Student Career portal.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Role Title *</Label>
                            <Input
                                id="title"
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                className="h-9 text-xs border-slate-200"
                                placeholder="e.g. Frontend Developer Intern, Junior Full Stack Engineer"
                                required
                            />
                        </div>

                        {/* Company Selector */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="companyId" className="text-xs font-semibold text-slate-700">Select Hiring Organization *</Label>
                            {companies.length === 0 ? (
                                <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs flex items-center justify-between">
                                    <span>You need to register at least one company before posting a job.</span>
                                    <Button 
                                        type="button" 
                                        size="sm" 
                                        onClick={() => navigate('/admin/companies/create')}
                                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-7"
                                    >
                                        Add Company
                                    </Button>
                                </div>
                            ) : (
                                <select
                                    id="companyId"
                                    value={input.companyId}
                                    onChange={selectChangeHandler}
                                    className="w-full h-9 text-xs border border-slate-200 rounded-xl px-3 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500/20 text-slate-800"
                                    required
                                >
                                    <option value="">-- Choose a company --</option>
                                    {companies.map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.name} ({c.location || "India"})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="description" className="text-xs font-semibold text-slate-700">Job Description *</Label>
                            <textarea
                                id="description"
                                name="description"
                                rows="3"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/20 text-slate-800"
                                placeholder="Describe the role objectives, team context, and responsibilities..."
                                required
                            />
                        </div>

                        {/* Requirements */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="requirements" className="text-xs font-semibold text-slate-700">Required Skills (Comma separated) *</Label>
                            <Input
                                id="requirements"
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="h-9 text-xs border-slate-200"
                                placeholder="React.js, Node.js, JavaScript, Tailwind CSS, Git"
                                required
                            />
                        </div>

                        {/* Salary (LPA) */}
                        <div className="space-y-1.5">
                            <Label htmlFor="salary" className="text-xs font-semibold text-slate-700">Annual Salary / Stipend (LPA) *</Label>
                            <Input
                                id="salary"
                                type="number"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="h-9 text-xs border-slate-200"
                                placeholder="e.g. 8 for 8 LPA"
                                required
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="text-xs font-semibold text-slate-700">Location *</Label>
                            <Input
                                id="location"
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="h-9 text-xs border-slate-200"
                                placeholder="e.g. Bangalore, Remote, Pune, Delhi NCR"
                                required
                            />
                        </div>

                        {/* Job Type */}
                        <div className="space-y-1.5">
                            <Label htmlFor="jobType" className="text-xs font-semibold text-slate-700">Employment Type *</Label>
                            <select
                                id="jobType"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="w-full h-9 text-xs border border-slate-200 rounded-xl px-3 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500/20 text-slate-800"
                            >
                                <option value="Internship">Internship (Student Friendly)</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>

                        {/* Experience */}
                        <div className="space-y-1.5">
                            <Label htmlFor="experience" className="text-xs font-semibold text-slate-700">Experience Required (Years)</Label>
                            <Input
                                id="experience"
                                type="number"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="h-9 text-xs border-slate-200"
                                placeholder="0 for Freshers / Interns"
                            />
                        </div>

                        {/* Openings */}
                        <div className="space-y-1.5">
                            <Label htmlFor="position" className="text-xs font-semibold text-slate-700">Total Openings / Positions</Label>
                            <Input
                                id="position"
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="h-9 text-xs border-slate-200"
                                placeholder="e.g. 3"
                            />
                        </div>

                        {/* Student Eligibility */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="eligibility" className="text-xs font-semibold text-slate-700">Student Eligibility Criteria</Label>
                            <Input
                                id="eligibility"
                                type="text"
                                name="eligibility"
                                value={input.eligibility}
                                onChange={changeEventHandler}
                                className="h-9 text-xs border-slate-200"
                                placeholder="Batch of 2025/2026, B.Tech / BCA students"
                            />
                        </div>

                        {/* Perks */}
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="perks" className="text-xs font-semibold text-slate-700">Learning Perks & Benefits (Comma separated)</Label>
                            <Input
                                id="perks"
                                type="text"
                                name="perks"
                                value={input.perks}
                                onChange={changeEventHandler}
                                className="h-9 text-xs border-slate-200"
                                placeholder="Certificate, PPO offer, Mentorship, Health coverage"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => navigate("/admin/jobs")}
                            className="text-xs h-9 border-slate-200 text-slate-600"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading || companies.length === 0}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs h-9 px-6 rounded-xl shadow-xs"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Publishing...
                                </>
                            ) : (
                                "Publish Job Opening"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
