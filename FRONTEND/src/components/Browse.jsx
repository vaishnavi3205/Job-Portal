import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Browse = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    // Preserve searchedQuery across navigation so navigating back maintains user's search

    const filteredJobs = searchedQuery
        ? allJobs.filter((job) => {
            const query = searchedQuery.toLowerCase();
            const hasReq = job.requirements?.some(r => r.toLowerCase().includes(query));
            return (
                job.title?.toLowerCase().includes(query) ||
                job.description?.toLowerCase().includes(query) ||
                job.location?.toLowerCase().includes(query) ||
                job.company?.name?.toLowerCase().includes(query) ||
                job.jobType?.toLowerCase().includes(query) ||
                hasReq
            );
        })
        : allJobs;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16">
            <Navbar />
            <div className="max-w-7xl mx-auto my-8 px-4">
                <div className="mb-8">
                    <h1 className="font-bold text-2xl text-slate-900 tracking-tight flex items-center gap-3">
                        <span>Search Results</span>
                        <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/80 px-2.5 py-0.5 rounded-full">
                            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                        </span>
                    </h1>
                    {searchedQuery && (
                        <p className="text-slate-500 text-sm mt-1">
                            Showing results for &ldquo;<span className="text-slate-800 font-medium">{searchedQuery}</span>&rdquo;
                        </p>
                    )}
                </div>

                {filteredJobs.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-slate-200/90 rounded-2xl shadow-xs px-4">
                        <p className="text-slate-700 font-semibold text-lg">No jobs found matching your criteria</p>
                        <p className="text-slate-400 text-sm mt-1">Try adjusting your keywords or clearing the search query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredJobs.map((job) => (
                            <Job key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Browse;