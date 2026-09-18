import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2, Building2, Upload } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { updateCompanyById, setSingleCompany } from '@/redux/companySlice';
import { Avatar, AvatarImage } from '../ui/avatar';

const CompanySetup = () => {
    const params = useParams();
    const companyId = params.id;
    const { companies, singleCompany } = useSelector(store => store.company);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null,
        logo: ""
    });

    // Populate data from store or backend
    useEffect(() => {
        const found = singleCompany?._id === companyId 
            ? singleCompany 
            : companies.find(c => c._id === companyId);

        if (found) {
            setInput({
                name: found.name || "",
                description: found.description || "",
                website: found.website || "",
                location: found.location || "",
                file: null,
                logo: found.logo || ""
            });
        } else {
            const fetchSingleCompany = async () => {
                try {
                    const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, { withCredentials: true });
                    if (res.data.success && res.data.company) {
                        dispatch(setSingleCompany(res.data.company));
                        setInput({
                            name: res.data.company.name || "",
                            description: res.data.company.description || "",
                            website: res.data.company.website || "",
                            location: res.data.company.location || "",
                            file: null,
                            logo: res.data.company.logo || ""
                        });
                    }
                } catch (error) {
                    console.info("Could not fetch company by ID from server:", error?.message);
                }
            };
            fetchSingleCompany();
        }
    }, [companyId, companies, singleCompany, dispatch]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ 
                ...input, 
                file, 
                logo: URL.createObjectURL(file) 
            });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedCompany = {
            _id: companyId,
            name: input.name,
            description: input.description,
            website: input.website,
            location: input.location,
            logo: input.logo || singleCompany?.logo || "https://cdn.iconscout.com/icon/free/png-256/free-building-1780515-1517616.png"
        };

        try {
            const formData = new FormData();
            formData.append("name", input.name);
            formData.append("description", input.description);
            formData.append("website", input.website);
            formData.append("location", input.location);
            if (input.file) {
                formData.append("file", input.file);
            }

            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${companyId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(updateCompanyById(res.data.company));
                toast.success(res.data.message || "Company profile updated successfully!");
                navigate("/admin/companies");
            }
        } catch (error) {
            console.error("Error updating company:", error);
            toast.error(error.response?.data?.message || "Failed to update company profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/60 pb-16">
            <Navbar />
            <div className="max-w-2xl mx-auto my-10 px-4">
                <Button 
                    onClick={() => navigate("/admin/companies")} 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-1.5 text-xs text-slate-500 mb-6"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Companies
                </Button>

                <form onSubmit={submitHandler} className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                            <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight">Company Profile Setup</h1>
                            <p className="text-xs text-slate-500 mt-1">Configure company metadata and branding assets</p>
                        </div>
                        {input.logo && (
                            <Avatar className="h-14 w-14 rounded-xl border border-slate-200 p-1 bg-slate-50">
                                <AvatarImage src={input.logo} className="object-contain" />
                            </Avatar>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Company Name</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                className="h-9 text-xs border-slate-200"
                                placeholder="Acme Inc."
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="text-xs font-semibold text-slate-700">Headquarters / Location</Label>
                            <Input
                                id="location"
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="h-9 text-xs border-slate-200"
                                placeholder="Bangalore, Karnataka"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="website" className="text-xs font-semibold text-slate-700">Company Website</Label>
                            <Input
                                id="website"
                                type="url"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                                className="h-9 text-xs border-slate-200"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="description" className="text-xs font-semibold text-slate-700">About Company</Label>
                            <textarea
                                id="description"
                                name="description"
                                rows="3"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500/20 text-slate-800"
                                placeholder="Brief summary of what the company builds, products, or services..."
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="logoFile" className="text-xs font-semibold text-slate-700">Brand Logo Image</Label>
                            <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/60">
                                <Input
                                    id="logoFile"
                                    type="file"
                                    accept="image/*"
                                    onChange={changeFileHandler}
                                    className="text-xs border-slate-200 cursor-pointer"
                                />
                                <p className="text-[11px] text-slate-400 mt-1.5">PNG, JPG, SVG logo recommended (transparent background)</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => navigate("/admin/companies")}
                            className="text-xs h-9 border-slate-200 text-slate-600"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs h-9 px-5 rounded-xl shadow-xs"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Saving...
                                </>
                            ) : (
                                "Update Company"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanySetup;
