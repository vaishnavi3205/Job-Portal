import React from 'react';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { X } from 'lucide-react';

export const filterData = [
    {
        key: "jobType",
        filterType: "Job Type",
        array: ["Internship", "Full Time"]
    },
    {
        key: "location",
        filterType: "Location",
        array: ["Bangalore", "Delhi NCR", "Hyderabad", "Pune", "Mumbai", "Remote"]
    },
    {
        key: "role",
        filterType: "Domain / Role",
        array: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Science", "Product Manager"]
    },
    {
        key: "salary",
        filterType: "Salary Range",
        array: ["0-5 LPA", "6-15 LPA", "16-30 LPA", "30+ LPA"]
    },
];

const FilterCard = ({ selectedFilters = {}, setSelectedFilters }) => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    const handleSelect = (categoryKey, value) => {
        if (!setSelectedFilters) return;
        setSelectedFilters(prev => ({
            ...prev,
            [categoryKey]: prev[categoryKey] === value ? "" : value // Toggle on/off
        }));
    };

    const handleClearCategory = (categoryKey) => {
        if (!setSelectedFilters) return;
        setSelectedFilters(prev => ({
            ...prev,
            [categoryKey]: ""
        }));
    };

    const hasAnyActiveFilter = Object.values(selectedFilters).some(Boolean) || Boolean(searchedQuery);

    const handleClearAll = () => {
        if (setSelectedFilters) {
            setSelectedFilters({
                jobType: "",
                location: "",
                role: "",
                salary: ""
            });
        }
        dispatch(setSearchedQuery(""));
    };

    return (
        <div className="w-full bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-base text-slate-900 tracking-tight">Filter Openings</h1>
                {hasAnyActiveFilter && (
                    <Button 
                        onClick={handleClearAll} 
                        variant="ghost" 
                        size="xs" 
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-medium rounded-lg h-7 px-2"
                    >
                        Clear All
                    </Button>
                )}
            </div>

            {searchedQuery && (
                <div className="mt-3 p-2 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-indigo-800 font-medium truncate">
                        Keyword: &ldquo;{searchedQuery}&rdquo;
                    </span>
                    <button 
                        onClick={() => dispatch(setSearchedQuery(""))} 
                        className="text-indigo-500 hover:text-indigo-700 p-0.5 rounded cursor-pointer transition-colors"
                        title="Remove keyword filter"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            <hr className="my-5 border-slate-100" />

            <div className="space-y-6">
                {filterData.map((data, index) => {
                    const activeVal = selectedFilters[data.key];
                    return (
                        <div key={data.key || index} className="space-y-2">
                            <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
                                <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                                    {data.filterType}
                                </h2>
                                {activeVal && (
                                    <button 
                                        onClick={() => handleClearCategory(data.key)} 
                                        className="text-[11px] text-slate-400 hover:text-rose-600 font-medium transition-colors cursor-pointer"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                            <div className="space-y-1.5 pt-1">
                                {data.array.map((item, idx) => {
                                    const isSelected = activeVal === item;
                                    const itemId = `filter-${data.key}-${idx}`;
                                    return (
                                        <div 
                                            key={itemId} 
                                            onClick={() => handleSelect(data.key, item)}
                                            className={`flex items-center space-x-3 px-3 py-2 rounded-xl cursor-pointer transition-all select-none ${
                                                isSelected 
                                                    ? "bg-indigo-50/90 text-indigo-900 font-semibold shadow-xs" 
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                                                isSelected 
                                                    ? "border-indigo-600 bg-indigo-600" 
                                                    : "border-slate-300 bg-white"
                                            }`}>
                                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            </div>
                                            <Label htmlFor={itemId} className="text-xs cursor-pointer select-none leading-relaxed">
                                                {item}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FilterCard;