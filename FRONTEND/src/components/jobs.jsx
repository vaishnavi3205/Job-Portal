import React, { useState, useMemo } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Jobs = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth || {});
    const isStudent = Boolean(user && user.role === "student");

    const [selectedFilters, setSelectedFilters] = useState({
        jobType: "",
        location: "",
        role: "",
        salary: ""
    });

    // Helper to normalize strings by removing spaces, symbols, punctuation and lowercasing
    const normalize = (str) => {
        if (!str) return "";
        return String(str).toLowerCase().replace(/[^a-z0-9]/g, "");
    };

    // Resilient search matching: handles "fullstack" vs "Full Stack", casing, multi-token, etc.
    const matchesSearch = (target, query) => {
        if (!target || !query) return false;
        const targetStr = String(target).toLowerCase();
        const queryStr = String(query).toLowerCase().trim();

        // 1. Direct substring match
        if (targetStr.includes(queryStr)) return true;

        // 2. Bidirectional normalized alphanumeric match (removes spaces, hyphens, dots, etc.)
        // e.g. "fullstack" matches "Full Stack", "Full-Stack", "FullStack Developer"
        const targetNorm = normalize(target);
        const queryNorm = normalize(query);
        if (queryNorm && targetNorm && (targetNorm.includes(queryNorm) || queryNorm.includes(targetNorm))) return true;

        // 3. Multi-word token match: every token in search query matches somewhere
        const tokens = queryStr.split(/\s+/).filter(Boolean);
        if (tokens.length > 1) {
            const allTokensMatch = tokens.every(token => {
                const tokenNorm = normalize(token);
                return targetStr.includes(token) || (tokenNorm && targetNorm.includes(tokenNorm));
            });
            if (allTokensMatch) return true;
        }

        return false;
    };

    // Resilient filter matching: specifically handles role titles, locations, job types without spacing or terminology barriers
    const matchesFilter = (jobValue, filterValue) => {
        if (!jobValue || !filterValue) return false;
        if (matchesSearch(jobValue, filterValue)) return true;

        const jobNorm = normalize(jobValue);
        const filterNorm = normalize(filterValue);
        if (jobNorm && filterNorm && (jobNorm.includes(filterNorm) || filterNorm.includes(jobNorm))) return true;

        // Domain-specific keyword matching for roles (e.g. "Full Stack", "Frontend", "Backend", "Data Science")
        const filterWords = String(filterValue).toLowerCase().split(/\s+/).filter(w => !["developer", "engineer", "manager"].includes(w));
        if (filterWords.length > 0) {
            const allDomainWordsPresent = filterWords.every(word => {
                const wordNorm = normalize(word);
                return jobNorm.includes(wordNorm);
            });
            if (allDomainWordsPresent) return true;
        }

        return false;
    };

    const filterJobs = useMemo(() => {
        let result = allJobs || [];

        // 1. Job Type Filter (handles "Full Time", "FullTime", "Internship", etc.)
        if (selectedFilters.jobType) {
            result = result.filter(job => matchesFilter(job.jobType, selectedFilters.jobType));
        }

        // 2. Location Filter (handles "Delhi NCR", "DelhiNCR", "Bangalore", etc.)
        if (selectedFilters.location) {
            result = result.filter(job => matchesFilter(job.location, selectedFilters.location));
        }

        // 3. Domain / Role Filter (handles "Full Stack", "FullStack", "Frontend", "Backend", etc.)
        if (selectedFilters.role) {
            result = result.filter(job => {
                const titleMatch = matchesFilter(job.title, selectedFilters.role);
                const descMatch = matchesFilter(job.description, selectedFilters.role);
                const reqMatch = job.requirements?.some(req => matchesFilter(req, selectedFilters.role));
                return titleMatch || descMatch || reqMatch;
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

        // 5. Global keyword / text search if active (space, punctuation, and casing agnostic)
        if (searchedQuery) {
            const rawQuery = searchedQuery.trim();
            const lowerQuery = rawQuery.toLowerCase();

            if (lowerQuery === "0-5 lpa" || lowerQuery === "0-40k") {
                return result.filter(job => Number(job.salary) <= 5);
            }
            if (lowerQuery === "6-15 lpa" || lowerQuery === "42-1lakh") {
                return result.filter(job => Number(job.salary) >= 6 && Number(job.salary) <= 15);
            }
            if (lowerQuery === "16-30 lpa" || lowerQuery === "1lakh to 5lakh") {
                return result.filter(job => Number(job.salary) >= 16 && Number(job.salary) <= 30);
            }
            if (lowerQuery === "30+ lpa") {
                return result.filter(job => Number(job.salary) > 30);
            }

            result = result.filter((job) => {
                const hasReq = job.requirements?.some(r => matchesSearch(r, rawQuery));
                return (
                    matchesSearch(job.title, rawQuery) ||
                    matchesSearch(job.description, rawQuery) ||
                    matchesSearch(job.location, rawQuery) ||
                    matchesSearch(job.company?.name, rawQuery) ||
                    matchesSearch(job.jobType, rawQuery) ||
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
                            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Showing <span className="text-indigo-600 font-bold">{filterJobs.length}</span> {isStudent ? "positions for students" : "available jobs"}
                                </span>
                                {!isStudent && (
                                    <span className="text-xs text-slate-500 bg-indigo-50/70 border border-indigo-100/80 px-3 py-1 rounded-full w-fit">
                                        Browsing mode: <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign up as Student</Link> to apply
                                    </span>
                                )}
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