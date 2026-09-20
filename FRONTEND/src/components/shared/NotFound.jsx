import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Button } from '@/components/ui/button';
import { Compass, Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-slate-50/60 flex flex-col justify-between">
            <Navbar />
            <div className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-xl shadow-indigo-500/20">
                        <Compass className="w-12 h-12 animate-spin-slow" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
                        </span>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                            404 Error • Page Not Found
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                            Lost in your career search?
                        </h1>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                            The page or job opportunity you are looking for has been moved, expired, or does not exist.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link to="/" className="w-full sm:w-auto">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 h-10 rounded-xl shadow-xs gap-2 cursor-pointer">
                                <Home className="w-4 h-4" />
                                Return Home
                            </Button>
                        </Link>
                        <Link to="/jobs" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold px-5 h-10 rounded-xl gap-2 cursor-pointer">
                                <Search className="w-4 h-4" />
                                Explore Jobs
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white/50">
                JobPortal © {new Date().getFullYear()} • All rights reserved
            </div>
        </div>
    );
};

export default NotFound;
