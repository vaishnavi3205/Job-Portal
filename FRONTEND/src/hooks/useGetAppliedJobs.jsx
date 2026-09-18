import { setAllAppliedJobs } from '@/redux/jobSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { APPLICATION_API_END_POINT } from '@/utils/constants';

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    
    useEffect(() => {
        if (!user || user.role !== "student") {
            dispatch(setAllAppliedJobs([]));
            return;
        }

        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { 
                    withCredentials: true 
                });
                if (res.data.success && Array.isArray(res.data.applications)) {
                    dispatch(setAllAppliedJobs(res.data.applications));
                }
            } catch (error) {
                console.warn("Error fetching applied jobs from backend:", error?.message);
                dispatch(setAllAppliedJobs([]));
            }
        };
        fetchAppliedJobs();
    }, [dispatch, user]);
};

export default useGetAppliedJobs;
