import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constants';
import { toast } from 'sonner';
import { updateJobByAdmin } from '@/redux/jobSlice';
import { ArrowLeft, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';

const EditJob = () => {
    useGetAllCompanies();
    const params = useParams();
    const jobId = params.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { companies } = useSelector(store => store.company);
    const { adminJobs } = useSelector(store => store.job);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "Full-Time",
        experience: 0,
        position: 1,
        companyId: "",
        eligibility: "",
        perks: "",
        status: "active"
    });

    useEffect(() => {
        const fetchJobDetails = async () => {
            setFetching(true);
            try {
                // First check in adminJobs store
                const existing = adminJobs?.find(j => j._id === jobId);
                if (existing) {
                    populateFields(existing);
                    setFetching(false);
                    return;
                }

                // Otherwise fetch from server
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success && res.data.job) {
                    populateFields(res.data.job);
                }
            } catch (err) {
                console.error("Error fetching job to edit:", err);
                toast.error("Failed to load job details");
            } finally {
                setFetching(false);
            }
        };

        const populateFields = (job) => {
            setInput({
                title: job.title || "",
                description: job.description || "",
                requirements: Array.isArray(job.requirements) ? job.requirements.join(", ") : (job.requirements || ""),
                salary: job.salary || "",
                location: job.location || "",
                jobType: job.jobType || "Full-Time",
                experience: job.experience !== undefined ? job.experience : 0,
                position: job.position !== undefined ? job.position : 1,
                companyId: typeof job.company === "object" ? job.company?._id : (job.company || ""),
                eligibility: job.eligibility || "",
                perks: Array.isArray(job.perks) ? job.perks.join(", ") : (job.perks || ""),
                status: job.status || "active"
            });
        };

        fetchJobDetails();
    }, [jobId, adminJobs]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.title || !input.description || !input.requirements || !input.salary || !input.location || !input.companyId) {
            toast.error("Please fill in all mandatory fields and select a company");
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
            const res = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, {
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
                perks: perksArray,
                status: input.status
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(updateJobByAdmin(res.data.job));
                toast.success(res.data.message || "Job updated successfully!");
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error("Error updating job:", error);
            toast.error(error.response?.data?.message || "Failed to update job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16">
            <Navbar />
            <div className="max-w-4xl mx-auto py-8 px-4">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate("/admin/jobs")}
                    className="mb-6 text-slate-600 hover:text-slate-900 gap-2 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Listings
                </Button>

                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
                    <div className="mb-6">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider mb-2">
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            Recruiter Portal
                        </span>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Job Posting</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Update role parameters, compensation, and requirements for candidates.
                        </p>
                    </div>

                    {fetching ? (
                        <div className="py-20 text-center text-slate-500">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600 mb-2" />
                            <p className="text-xs font-medium">Loading position details...</p>
                        </div>
                    ) : (
                        <form onSubmit={submitHandler} className="space-y-6">
                            {/* Company & Status row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Company *</Label>
                                    <select
                                        name="companyId"
                                        value={input.companyId}
                                        onChange={changeEventHandler}
                                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                                    >
                                        <option value="">Select a Company</option>
                                        {companies.map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Listing Status</Label>
                                    <select
                                        name="status"
                                        value={input.status}
                                        onChange={changeEventHandler}
                                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                                    >
                                        <option value="active">Active (Accepting Applications)</option>
                                        <option value="closed">Closed (Applications Paused)</option>
                                        <option value="draft">Draft (Hidden from Candidates)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Job Title */}
                            <div className="space-y-1.5">
                                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Job Title *</Label>
                                <Input 
                                    type="text" 
                                    name="title" 
                                    value={input.title} 
                                    onChange={changeEventHandler} 
                                    placeholder="e.g. Frontend Engineer (React.js)" 
                                    className="h-10 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-600"
                                />
                            </div>

                            {/* Type, Location, Salary */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Job Type *</Label>
                                    <select
                                        name="jobType"
                                        value={input.jobType}
                                        onChange={changeEventHandler}
                                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus-visible:border-indigo-600"
                                    >
                                        <option value="Full-Time">Full-Time</option>
                                        <option value="Part-Time">Part-Time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="location" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Location *</Label>
                                    <Input 
                                        type="text" 
                                        name="location" 
                                        value={input.location} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g. Bangalore, India (Hybrid)" 
                                        className="h-10 border-slate-200"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="salary" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Annual Salary (LPA) *</Label>
                                    <Input 
                                        type="number" 
                                        name="salary" 
                                        value={input.salary} 
                                        onChange={changeEventHandler} 
                                        placeholder="e.g. 14" 
                                        className="h-10 border-slate-200"
                                    />
                                </div>
                            </div>

                            {/* Openings & Experience */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="position" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Number of Openings</Label>
                                    <Input 
                                        type="number" 
                                        name="position" 
                                        value={input.position} 
                                        onChange={changeEventHandler} 
                                        className="h-10 border-slate-200"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="experience" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Required Experience (Years)</Label>
                                    <Input 
                                        type="number" 
                                        name="experience" 
                                        value={input.experience} 
                                        onChange={changeEventHandler} 
                                        className="h-10 border-slate-200"
                                    />
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="space-y-1.5">
                                <Label htmlFor="requirements" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    Key Skills / Requirements * (comma separated)
                                </Label>
                                <Input 
                                    type="text" 
                                    name="requirements" 
                                    value={input.requirements} 
                                    onChange={changeEventHandler} 
                                    placeholder="React.js, Tailwind CSS, TypeScript, REST APIs" 
                                    className="h-10 border-slate-200"
                                />
                                <p className="text-[11px] text-slate-400">Used for student skill matching engine</p>
                            </div>

                            {/* Eligibility */}
                            <div className="space-y-1.5">
                                <Label htmlFor="eligibility" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Candidate Eligibility</Label>
                                <Input 
                                    type="text" 
                                    name="eligibility" 
                                    value={input.eligibility} 
                                    onChange={changeEventHandler} 
                                    placeholder="e.g. Open to 2025/2026 Batch Graduates" 
                                    className="h-10 border-slate-200"
                                />
                            </div>

                            {/* Perks */}
                            <div className="space-y-1.5">
                                <Label htmlFor="perks" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Perks & Benefits (comma separated)</Label>
                                <Input 
                                    type="text" 
                                    name="perks" 
                                    value={input.perks} 
                                    onChange={changeEventHandler} 
                                    placeholder="Health Insurance, Remote Option, Performance Bonus" 
                                    className="h-10 border-slate-200"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Job Description *</Label>
                                <textarea 
                                    name="description" 
                                    rows="5" 
                                    value={input.description} 
                                    onChange={changeEventHandler} 
                                    placeholder="Provide a comprehensive role overview, responsibilities, and expected outcomes..."
                                    className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/admin/jobs")}
                                    className="border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                {loading ? (
                                    <Button disabled className="bg-indigo-600 text-white gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                    </Button>
                                ) : (
                                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-xs gap-2 cursor-pointer">
                                        <CheckCircle2 className="w-4 h-4" /> Save Changes
                                    </Button>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditJob;
