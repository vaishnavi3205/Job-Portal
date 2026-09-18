import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name: "company",
    initialState: {
        singleCompany: null,
        companies: [],
        searchCompanyByText: "",
    },
    reducers: {
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        setCompanies: (state, action) => {
            state.companies = Array.isArray(action.payload) ? action.payload : [];
        },
        addCompany: (state, action) => {
            if (action.payload) {
                state.companies = [action.payload, ...state.companies];
            }
        },
        updateCompanyById: (state, action) => {
            const updated = action.payload;
            if (updated) {
                state.companies = state.companies.map(c => c._id === updated._id ? { ...c, ...updated } : c);
                if (state.singleCompany && state.singleCompany._id === updated._id) {
                    state.singleCompany = { ...state.singleCompany, ...updated };
                }
            }
        },
        deleteCompanyById: (state, action) => {
            const id = action.payload;
            state.companies = state.companies.filter(c => c._id !== id);
            if (state.singleCompany && state.singleCompany._id === id) {
                state.singleCompany = null;
            }
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        }
    }
});

export const {
    setSingleCompany,
    setCompanies,
    addCompany,
    updateCompanyById,
    deleteCompanyById,
    setSearchCompanyByText
} = companySlice.actions;

export default companySlice.reducer;
