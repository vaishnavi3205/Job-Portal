import { setCompanies } from '@/redux/companySlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { COMPANY_API_END_POINT } from '@/utils/constants';

const useGetAllCompanies = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success && Array.isArray(res.data.companies)) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.info("Unable to fetch companies from backend:", error?.message);
            }
        };
        fetchCompanies();
    }, [dispatch]);
};

export default useGetAllCompanies;
