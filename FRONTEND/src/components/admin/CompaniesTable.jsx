import React, { useMemo } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit2, MoreHorizontal, Building2, Globe, MapPin, ExternalLink, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { deleteCompanyById } from '@/redux/companySlice';
import { toast } from 'sonner';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constants';

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const filteredCompanies = useMemo(() => {
        if (!companies) return [];
        return companies.filter(company => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase()) ||
                company?.location?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
    }, [companies, searchCompanyByText]);

    const handleDelete = async (e, companyId, companyName) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete "${companyName}"? This will also remove all job listings associated with this company.`)) {
            return;
        }

        try {
            const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, { withCredentials: true });
            if (res.data.success) {
                dispatch(deleteCompanyById(companyId));
                toast.success(res.data.message || `Company "${companyName}" deleted`);
            }
        } catch (error) {
            console.error("Delete company error:", error);
            toast.error(error.response?.data?.message || "Failed to delete company");
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <Table>
                <TableCaption className="text-xs text-slate-400 pb-3">
                    A list of your registered recruitment companies
                </TableCaption>
                <TableHeader className="bg-slate-50/80">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-700 text-xs">Logo & Company</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs">Location</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs">Website</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-xs">Registered Date</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700 text-xs">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCompanies.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                <div className="max-w-xs mx-auto text-center space-y-2">
                                    <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
                                    <p className="font-medium text-sm text-slate-700">No companies found</p>
                                    <p className="text-xs text-slate-400">
                                        Register your company profile to begin posting job listings.
                                    </p>
                                    <Button 
                                        onClick={() => navigate('/admin/companies/create')}
                                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-1.5 rounded-lg shadow-xs cursor-pointer"
                                    >
                                        Register Company
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredCompanies.map((company) => (
                            <TableRow key={company._id} className="hover:bg-slate-50/60 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl border border-slate-200/80 p-1 flex items-center justify-center bg-slate-50 shrink-0">
                                            <Avatar className="w-full h-full rounded-lg">
                                                <AvatarImage src={company?.logo} className="object-contain" />
                                            </Avatar>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{company?.name}</p>
                                            <p className="text-xs text-slate-400 line-clamp-1 max-w-xs">
                                                {company?.description || "No description added"}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-slate-600">
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        {company?.location || "Not specified"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-xs">
                                    {company?.website ? (
                                        <a 
                                            href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1 font-medium"
                                        >
                                            <Globe className="w-3.5 h-3.5" />
                                            Visit <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                    ) : (
                                        <span className="text-slate-400">N/A</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-xs text-slate-500 font-medium whitespace-nowrap">
                                    {company?.createdAt?.split("T")[0] || "Recent"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 cursor-pointer">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-1.5 rounded-xl shadow-lg border border-slate-200" align="end">
                                            <button 
                                                onClick={() => navigate(`/admin/companies/${company._id}`)}
                                                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors font-medium cursor-pointer"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                                Edit Company
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(e, company._id, company.name)}
                                                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Delete Company
                                            </button>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default CompaniesTable;
