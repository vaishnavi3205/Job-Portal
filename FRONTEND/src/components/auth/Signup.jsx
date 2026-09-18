import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '../../redux/authSlice';
import { Loader2 } from 'lucide-react';
import { USER_API_END_POINT } from '@/utils/constants';

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        file: ""
    });
    
    const { loading } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
                return;
            }
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = error.response?.data?.message || "Registration failed. Please check your details.";
            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto py-12 px-4">
                <form onSubmit={submitHandler} className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-8 shadow-sm">
                    <div className="mb-6">
                        <h1 className="font-bold text-2xl text-slate-900 tracking-tight">
                            {input.role === "recruiter" ? "Create Recruiter Account" : "Create Candidate Account"}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {input.role === "recruiter" ? "Post job openings and hire verified candidates" : "Get started with your student career profile"}
                        </p>
                    </div>
                    
                    <div className="my-4 space-y-1.5">
                        <Label htmlFor="fullname" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Full Name</Label>
                        <Input 
                            type="text" 
                            name="fullname" 
                            value={input.fullname || ""} 
                            onChange={changeEventHandler} 
                            placeholder="Vaishnavi Sharma" 
                            className="h-10 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-600"
                        />
                    </div>
                    
                    <div className="my-4 space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Email Address</Label>
                        <Input 
                            type="email" 
                            name="email" 
                            value={input.email || ""} 
                            onChange={changeEventHandler} 
                            placeholder="name@example.com" 
                            className="h-10 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-600"
                        />
                    </div>

                    <div className="my-4 space-y-1.5">
                        <Label htmlFor="phoneNumber" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Phone Number</Label>
                        <Input 
                            type="text" 
                            name="phoneNumber" 
                            value={input.phoneNumber || ""} 
                            onChange={changeEventHandler} 
                            placeholder="1234567890" 
                            className="h-10 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-600"
                        />
                    </div>

                    <div className="my-4 space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Password</Label>
                        <Input 
                            type="password" 
                            name="password" 
                            value={input.password || ""} 
                            onChange={changeEventHandler} 
                            placeholder="••••••••" 
                            className="h-10 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-600"
                        />
                    </div>

                    <div className="flex items-center justify-between my-5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Role</Label>
                        <RadioGroup 
                            className="flex items-center gap-4 text-sm"
                            value={input.role || "student"} 
                            onValueChange={(value) => setInput({ ...input, role: value })}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="student" id="student" />
                                <Label htmlFor="student" className="text-sm font-medium text-slate-700 cursor-pointer">Candidate / Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="recruiter" id="recruiter" />
                                <Label htmlFor="recruiter" className="text-sm font-medium text-slate-700 cursor-pointer">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="my-4 space-y-1.5">
                        <Label htmlFor="file" className="text-xs font-semibold uppercase tracking-wider text-slate-600">Profile Picture</Label>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={changeFileHandler} 
                            className="border-slate-200 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                    </div>

                   {
                        loading ? (
                            <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-xs" disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-xs transition-colors">
                                Create Account
                            </Button>
                        )
                    }
                    
                    <span className="text-sm text-slate-500 mt-5 block text-center">
                        Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline">Sign in</Link>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default Signup;