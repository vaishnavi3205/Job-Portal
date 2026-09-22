import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from './../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2, ChevronDown } from 'lucide-react';
import { USER_API_END_POINT } from '@/utils/constants';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "student"
    });

    const { loading } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (e) => {
        setInput({ ...input, role: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.email || !input.password) {
            toast.error("Please fill in your email and password");
            return;
        }

        dispatch(setLoading(true));

        try {
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                navigate(res.data.user?.role === "recruiter" ? "/admin/jobs" : "/");
                return;
            }
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials and role.";
            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto py-16 px-4">
                <form onSubmit={submitHandler} autoComplete="off" className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-8 shadow-sm">
                    {/* Decoy fields to intercept Chrome/Edge password autofill */}
                    <input type="text" name="prevent_autofill_email" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                    <input type="password" name="prevent_autofill_pwd" style={{ display: 'none' }} tabIndex={-1} autoComplete="new-password" />

                    <div className="mb-6">
                        <h1 className="font-bold text-2xl text-slate-900 tracking-tight">Welcome Back</h1>
                        <p className="text-sm text-slate-500 mt-1">Sign in to your JobPortal account</p>
                    </div>
                    
                    <div className="my-4 space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Email Address</Label>
                        <Input 
                            type="email" 
                            name="email" 
                            id="email"
                            value={input.email} 
                            onChange={changeEventHandler} 
                            placeholder="Enter your email" 
                            required
                            autoComplete="off"
                            className="h-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-600"
                        />
                    </div>
                    
                    <div className="my-4 space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Password</Label>
                        <Input 
                            type="password" 
                            name="password" 
                            id="password"
                            value={input.password} 
                            onChange={changeEventHandler} 
                            placeholder="Enter your password" 
                            required
                            autoComplete="new-password"
                            className="h-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus-visible:ring-indigo-500/20 focus-visible:border-indigo-600"
                        />
                    </div>

                    {/* Role Dropdown */}
                    <div className="my-4 space-y-1.5">
                        <Label htmlFor="role" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Select Role</Label>
                        <div className="relative">
                            <select
                                id="role"
                                name="role"
                                value={input.role || "student"}
                                onChange={handleRoleChange}
                                className="w-full h-10 px-3 py-2 pr-10 text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer appearance-none transition-colors"
                            >
                                <option value="student">Candidate / Student</option>
                                <option value="recruiter">Recruiter / Employer</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </div>
                    </div>

                    {
                        loading ? (
                            <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-xs cursor-pointer" disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-xs transition-colors cursor-pointer">
                                Sign In
                            </Button>
                        )
                    }
                    
                    <span className="text-sm text-slate-500 mt-5 block text-center">
                        Don't have an account? <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">Sign up</Link>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default Login;