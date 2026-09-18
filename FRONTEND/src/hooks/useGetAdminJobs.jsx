import { setAdminJobs } from '@/redux/jobSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { JOB_API_END_POINT } from '@/utils/constants';

const useGetAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
                if (res.data.success && Array.isArray(res.data.jobs)) {
                    dispatch(setAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.info("Unable to fetch admin jobs from backend:", error?.message);
            }
        };
        fetchAdminJobs();
    }, [dispatch]);
};

export default useGetAdminJobs;
