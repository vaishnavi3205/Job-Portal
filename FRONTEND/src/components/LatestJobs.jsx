import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    
    return (
        <div className="max-w-7xl mx-auto my-16 px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        <span className="text-indigo-600">Latest & Top </span> Job Openings
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Explore recently posted roles from verified employers</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    (!allJobs || allJobs.length <= 0) ? (
                        <div className="col-span-full text-center py-12 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-500">
                            No Jobs Available right now
                        </div>
                    ) : (
                        allJobs?.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)
                    )
                }
            </div>
        </div>
    );
};

export default LatestJobs;