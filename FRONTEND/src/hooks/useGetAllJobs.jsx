import { setAllJobs } from '@/redux/jobSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { JOB_API_END_POINT } from '@/utils/constants';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success && Array.isArray(res.data.jobs)) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.warn("Error fetching all jobs from backend:", error?.message);
                dispatch(setAllJobs([]));
            }
        };
        fetchAllJobs();
    }, [dispatch]);
};

export default useGetAllJobs;