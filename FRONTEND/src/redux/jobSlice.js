import { createSlice } from "@reduxjs/toolkit";

const loadSavedJobs = () => {
    try {
        const item = localStorage.getItem("portal_saved_jobs");
        return item ? JSON.parse(item) : [];
    } catch (e) {
        console.warn("Error reading portal_saved_jobs from localStorage:", e);
        return [];
    }
};

const saveSavedJobs = (savedJobs) => {
    try {
        localStorage.setItem("portal_saved_jobs", JSON.stringify(savedJobs));
    } catch (e) {
        console.warn("Error saving portal_saved_jobs to localStorage:", e);
    }
};

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        singleJob: null,
        adminJobs: [],
        searchJobByText: "",
        allAppliedJobs: [],
        savedJobs: loadSavedJobs(),
        searchedQuery: "",
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = Array.isArray(action.payload) ? action.payload : [];
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAdminJobs: (state, action) => {
            state.adminJobs = Array.isArray(action.payload) ? action.payload : [];
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = Array.isArray(action.payload) ? action.payload : [];
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setSavedJobs: (state, action) => {
            state.savedJobs = Array.isArray(action.payload) ? action.payload : [];
            saveSavedJobs(state.savedJobs);
        },
        toggleSaveJob: (state, action) => {
            const jobId = action.payload;
            if (state.savedJobs.includes(jobId)) {
                state.savedJobs = state.savedJobs.filter(id => id !== jobId);
            } else {
                state.savedJobs.push(jobId);
            }
            saveSavedJobs(state.savedJobs);
        },
        addJobByAdmin: (state, action) => {
            const newJob = action.payload;
            if (newJob) {
                state.adminJobs = [newJob, ...state.adminJobs];
                state.allJobs = [newJob, ...state.allJobs];
            }
        },
        updateJobByAdmin: (state, action) => {
            const updated = action.payload;
            if (updated && updated._id) {
                state.adminJobs = state.adminJobs.map(j => j._id === updated._id ? { ...j, ...updated } : j);
                state.allJobs = state.allJobs.map(j => j._id === updated._id ? { ...j, ...updated } : j);
                if (state.singleJob && state.singleJob._id === updated._id) {
                    state.singleJob = { ...state.singleJob, ...updated };
                }
            }
        },
        deleteJobByAdmin: (state, action) => {
            const jobId = action.payload;
            state.adminJobs = state.adminJobs.filter(j => j._id !== jobId);
            state.allJobs = state.allJobs.filter(j => j._id !== jobId);
        },
        updateApplicationStatus: (state, action) => {
            const { applicationId, status } = action.payload;
            const normalizedStatus = status?.toLowerCase();

            state.allAppliedJobs = state.allAppliedJobs.map(app => {
                if (app._id === applicationId) {
                    return { ...app, status: normalizedStatus };
                }
                return app;
            });

            const updateApps = (job) => {
                if (!job || !Array.isArray(job.applications)) return job;
                return {
                    ...job,
                    applications: job.applications.map(app => {
                        if (app._id === applicationId) {
                            return { ...app, status: normalizedStatus };
                        }
                        return app;
                    })
                };
            };

            state.adminJobs = state.adminJobs.map(updateApps);
            state.allJobs = state.allJobs.map(updateApps);
            if (state.singleJob) {
                state.singleJob = updateApps(state.singleJob);
            }
        }
    }
});

export const {
    setAllJobs,
    setSingleJob,
    setAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    setSavedJobs,
    toggleSaveJob,
    addJobByAdmin,
    updateJobByAdmin,
    deleteJobByAdmin,
    updateApplicationStatus
} = jobSlice.actions;

export default jobSlice.reducer;
