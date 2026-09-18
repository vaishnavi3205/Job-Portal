import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { ArrowLeft, Users, Briefcase, Building2 } from 'lucide-react';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constants';

const Applicants = () => {
    const params = useParams();
    const jobId = params.id;
    const navigate = useNavigate();
    const { allJobs, adminJobs, allAppliedJobs } = useSelector(store => store.job);

    const [jobDetails, setJobDetails] = useState(null);

    // Look up job
    useEffect(() => {
        const found = (allJobs || []).find(j => j._id === jobId) ||
            (adminJobs || []).find(j => j._id === jobId);
        if (found) {
            setJobDetails(found);
        }

        // Try API if online
        const fetchApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, {
                    withCredentials: true
                });
                if (res.data.success && res.data.job) {
                    setJobDetails(res.data.job);
                }
            } catch (error) {
                // Offline fallback handled via Redux
            }
        };

        fetchApplicants();
    }, [jobId, allJobs, adminJobs]);

    const applications = jobDetails?.applications || [];

    return (
        <div className="min-h-screen bg-slate-50/60 pb-16">
            <Navbar />
            <div className="max-w-6xl mx-auto my-10 px-4 space-y-6">
                <Button 
                    onClick={() => navigate("/admin/jobs")} 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-1.5 text-xs text-slate-500 mb-2"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Posted Openings
                </Button>

                {/* Header Card */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
                            <Users className="w-3.5 h-3.5" /> Candidate Screening
                        </div>
                        <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
                            <span>Applicants for {jobDetails?.title || "Position"}</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            <span className="font-medium text-slate-700">{jobDetails?.company?.name || "Company"}</span>
                            <span>•</span>
                            <span>{jobDetails?.location || "Location"}</span>
                            <span>•</span>
                            <span>{jobDetails?.jobType || "Full Time"}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="text-center px-3 border-r border-slate-200">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Total Applicants</p>
                            <p className="text-xl font-bold text-indigo-600">{applications.length}</p>
                        </div>
                        <div className="text-center px-3">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Target Openings</p>
                            <p className="text-xl font-bold text-slate-800">{jobDetails?.position || 1}</p>
                        </div>
                    </div>
                </div>

                {/* Applicants Table */}
                <ApplicantsTable jobId={jobId} applications={applications} />
            </div>
        </div>
    );
};

export default Applicants;
