import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/jobs");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            searchJobHandler();
        }
    };

    return (
        <div className="text-center py-12 md:py-20 px-4 bg-gradient-to-b from-slate-50/80 via-white to-white relative z-0">
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                <div className="mx-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    Verified Job Portal
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    Search, Apply & <br /> Land Your{" "}
                    <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
                        Dream Job
                    </span>
                </h1>
                <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                    Discover thousands of high-growth career opportunities from verified companies and industry leaders.
                </p>
                <div className="flex w-full max-w-xl shadow-md hover:shadow-lg transition-all border border-slate-200 bg-white pl-4 pr-1.5 py-1.5 rounded-full items-center gap-3 mx-auto focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 mt-2">
                    <Search className="h-5 w-5 text-slate-400 shrink-0" />
                    <input 
                        type="text"
                        placeholder="Job title, keywords, or company..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="outline-none border-none w-full text-slate-800 placeholder:text-slate-400 text-sm sm:text-base bg-transparent"
                    />
                    <Button onClick={searchJobHandler} className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 h-10 shadow-xs font-medium shrink-0">
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;