import React from 'react';
import { Button } from './ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSaveJob } from '@/redux/jobSlice';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constants';

const Job = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { savedJobs, allAppliedJobs } = useSelector(store => store.job);

    const { user } = useSelector(store => store.auth);
    const isSaved = savedJobs?.includes(job?._id);
    const isApplied = allAppliedJobs?.some(app => app?.job?._id === job?._id);

    const daysAgoFunction = (mongodbTime) => {
        if (!mongodbTime) return "Recent";
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
        return days === 0 ? "Posted today" : `Posted ${days}d ago`;
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        dispatch(toggleSaveJob(job?._id));
        if (!isSaved) {
            toast.success("Job saved to your bookmarks!");
        } else {
            toast.info("Job removed from bookmarks");
        }

        if (user) {
            try {
                await axios.post(`${USER_API_END_POINT}/save-job/${job?._id}`, {}, { withCredentials: true });
            } catch (err) {}
        }
    };
    
    return (
        <div className="p-5 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 bg-white border border-slate-200/90 hover:border-indigo-200 flex flex-col justify-between group">
            <div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                        {daysAgoFunction(job?.createdAt)}
                    </span>
                    <Button 
                        variant="ghost" 
                        onClick={handleSave}
                        className={`rounded-full h-8 w-8 transition-colors ${
                            isSaved 
                                ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" 
                                : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                        }`} 
                        size="icon"
                        title={isSaved ? "Saved to bookmarks" : "Save for later"}
                    >
                        {isSaved ? <BookmarkCheck className="w-4 h-4 text-indigo-600" /> : <Bookmark className="w-4 h-4" />}
                    </Button>
                </div>

                <div className="flex items-center gap-3 my-3">
                    <div className="w-11 h-11 rounded-xl border border-slate-200/80 p-1 flex items-center justify-center bg-slate-50 shrink-0">
                        <Avatar className="w-full h-full rounded-lg">
                            <AvatarImage src={job?.company?.logo} className="object-contain" />
                        </Avatar>
                    </div>
                    <div>
                        <h3 className="font-semibold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {job?.company?.name}
                        </h3>
                        <p className="text-xs text-slate-500">{job?.location || "India"}</p>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {job?.title}
                        </h2>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {job?.description}
                    </p>
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {job?.position} Positions
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {job?.jobType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ₹{job?.salary} LPA
                    </span>
                    {isApplied && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            ✓ Applied
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        onClick={() => navigate(`/description/${job?._id}`)} 
                        variant="outline" 
                        className="flex-1 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                        Details
                    </Button>
                    <Button 
                        onClick={() => navigate(`/description/${job?._id}`)} 
                        className={`flex-1 text-xs font-medium rounded-xl shadow-xs ${
                            isApplied 
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200" 
                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                    >
                        {isApplied ? "View Status" : "Apply Now"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Job;