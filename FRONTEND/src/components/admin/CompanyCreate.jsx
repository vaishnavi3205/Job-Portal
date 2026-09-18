import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany, addCompany } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constants';
import { Building2, ArrowLeft } from 'lucide-react';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        if (!companyName.trim()) {
            toast.error("Please provide a company name");
            return;
        }

        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName: companyName.trim() }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                dispatch(addCompany(res.data.company));
                toast.success(res.data.message || `Registered ${companyName}!`);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.error("Error registering company:", error);
            toast.error(error.response?.data?.message || "Failed to register company. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/60 pb-16">
            <Navbar />
            <div className="max-w-3xl mx-auto my-12 px-4">
                <Button 
                    onClick={() => navigate("/admin/companies")} 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-1.5 text-xs text-slate-500 mb-6"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Companies
                </Button>

                <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight">Register Your Company</h1>
                        <p className="text-xs text-slate-500 mt-1">
                            What is the official brand or legal name of your hiring organization? You can configure logo, description, and website in the next step.
                        </p>
                    </div>

                    <div className="space-y-2 pt-2">
                        <Label htmlFor="companyName" className="text-xs font-semibold text-slate-700">Company Name</Label>
                        <Input
                            id="companyName"
                            type="text"
                            className="h-10 text-xs border-slate-200 focus-visible:ring-indigo-500/20"
                            placeholder="e.g. Razorpay, Swiggy, Google, Atlassian"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') registerNewCompany();
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                        <Button 
                            variant="outline" 
                            onClick={() => navigate("/admin/companies")}
                            className="text-xs h-9 border-slate-200 text-slate-600"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={registerNewCompany}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs h-9 px-5 rounded-xl shadow-xs"
                        >
                            Continue to Setup
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;
