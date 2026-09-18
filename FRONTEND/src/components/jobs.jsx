import React, { useState, useMemo } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Jobs = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);

    const [selectedFilters, setSelectedFilters] = useState({
        jobType: "",
        location: "",
        role: "",
        salary: ""
    });

    const filterJobs = useMemo(() => {
        let result = allJobs || [];

        // 1. Job Type Filter
        if (selectedFilters.jobType) {
            const jt = selectedFilters.jobType.toLowerCase();
            result = result.filter(job => job.jobType?.toLowerCase().includes(jt));
        }

        // 2. Location Filter
        if (selectedFilters.location) {
            const loc = selectedFilters.location.toLowerCase();
            result = result.filter(job => job.location?.toLowerCase().includes(loc));
        }

        // 3. Domain / Role Filter
        if (selectedFilters.role) {
            const r = selectedFilters.role.toLowerCase();
            result = result.filter(job => {
                const titleMatch = job.title?.toLowerCase().includes(r);
                const reqMatch = job.requirements?.some(req => req.toLowerCase().includes(r));
                return titleMatch || reqMatch;
            });
        }

        // 4. Salary Range Filter
        if (selectedFilters.salary) {
            const sal = selectedFilters.salary;
            if (sal === "0-5 LPA") {
                result = result.filter(job => Number(job.salary) <= 5);
            } else if (sal === "6-15 LPA") {
                result = result.filter(job => Number(job.salary) >= 6 && Number(job.salary) <= 15);
            } else if (sal === "16-30 LPA") {
                result = result.filter(job => Number(job.salary) >= 16 && Number(job.salary) <= 30);
            } else if (sal === "30+ LPA") {
                result = result.filter(job => Number(job.salary) > 30);
            }
        }

        // 5. Global keyword / text search if active
        if (searchedQuery) {
            const query = searchedQuery.toLowerCase().trim();

            if (query === "0-5 lpa" || query === "0-40k") {
                return result.filter(job => Number(job.salary) <= 5);
            }
            if (query === "6-15 lpa" || query === "42-1lakh") {
                return result.filter(job => Number(job.salary) >= 6 && Number(job.salary) <= 15);
            }
            if (query === "16-30 lpa" || query === "1lakh to 5lakh") {
                return result.filter(job => Number(job.salary) >= 16 && Number(job.salary) <= 30);
            }
            if (query === "30+ lpa") {
                return result.filter(job => Number(job.salary) > 30);
            }

            result = result.filter((job) => {
                const hasReq = job.requirements?.some(r => r.toLowerCase().includes(query));
                return (
                    job.title?.toLowerCase().includes(query) ||
                    job.description?.toLowerCase().includes(query) ||
                    job.location?.toLowerCase().includes(query) ||
                    job.company?.name?.toLowerCase().includes(query) ||
                    job.jobType?.toLowerCase().includes(query) ||
                    hasReq
                );
            });
        }

        return result;
    }, [allJobs, selectedFilters, searchedQuery]);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16">
            <Navbar />
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-[260px] lg:w-[280px] shrink-0">
                        <FilterCard 
                            selectedFilters={selectedFilters} 
                            setSelectedFilters={setSelectedFilters} 
                        />
                    </div>
                    {filterJobs.length <= 0 ? (
                        <div className="flex-1 text-center py-20 bg-white rounded-2xl border border-slate-200/90 shadow-xs px-4">
                            <h2 className="text-slate-800 text-xl font-bold tracking-tight">No Opportunities Found</h2>
                            <p className="text-slate-400 text-sm mt-1">Try selecting a different filter or clearing search criteria</p>
                        </div>
                    ) : (
                        <div className="flex-1 min-h-[70vh] pb-5">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Showing <span className="text-indigo-600 font-bold">{filterJobs.length}</span> positions for students
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filterJobs.map((job) => (
                                    <div key={job?._id}>
                                        <Job job={job} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Jobs;