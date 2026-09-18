import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';
import { Building2, Plus, Search } from 'lucide-react';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companies } = useSelector(store => store.company);

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input, dispatch]);

    return (
        <div className="min-h-screen bg-slate-50/60 pb-16">
            <Navbar />
            <div className="max-w-6xl mx-auto my-10 px-4 space-y-6">
                {/* Header and Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1">
                            <Building2 className="w-3.5 h-3.5" /> Recruiter Portal
                        </div>
                        <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2.5">
                            <span>Registered Companies</span>
                            <span className="text-xs font-bold bg-slate-200/80 text-slate-700 px-2.5 py-0.5 rounded-full">
                                {companies?.length || 0}
                            </span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Register and update organization profiles to publish official job listings
                        </p>
                    </div>

                    <Button 
                        onClick={() => navigate("/admin/companies/create")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
                    >
                        <Plus className="w-4 h-4" /> Register New Company
                    </Button>
                </div>

                {/* Filter / Search Bar */}
                <div className="relative max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input 
                        className="pl-9 h-10 text-xs bg-white border-slate-200 rounded-xl focus-visible:ring-indigo-500/20"
                        placeholder="Search company by name or location..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                {/* Companies Table */}
                <CompaniesTable />
            </div>
        </div>
    );
};

export default Companies;
